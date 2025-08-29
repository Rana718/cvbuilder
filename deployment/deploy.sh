#!/bin/bash

set -e

# Create logs directory if it doesn't exist
mkdir -p ./logs

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a ./logs/logs.log
}

# Determine current active environment
determine_active_env() {
    if docker ps | grep -q aicvbuilder-backend-blue; then
        echo "blue"
    elif docker ps | grep -q aicvbuilder-backend-green; then
        echo "green"
    else
        echo "none"
    fi
}

# Check and start Redis if not running
ensure_redis_running() {
    if ! docker ps | grep -q resume-redis; then
        log "Redis not running. Starting Redis for the first time"
        docker-compose -f ./docker/docker-compose.redis.yml up -d
        
        # Wait for Redis to be ready
        log "Waiting for Redis to become ready"
        RETRY_COUNT=0
        MAX_RETRIES=10
        
        until docker exec resume-redis redis-cli ping | grep -q PONG || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
            log "Redis health check attempt $((RETRY_COUNT+1))/$MAX_RETRIES"
            RETRY_COUNT=$((RETRY_COUNT+1))
            sleep 3
        done
        
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            log "WARNING: Redis health check timed out, continuing with deployment"
        else
            log "Redis is ready"
        fi
    else
        log "Redis is already running, skipping startup"
    fi
}

ensure_redis_running

log "Starting Docker deployment process"
ACTIVE_ENV=$(determine_active_env)
log "Current active environment: $ACTIVE_ENV"

if [ "$ACTIVE_ENV" == "blue" ] || [ "$ACTIVE_ENV" == "none" ]; then
    NEW_ENV="green"
    OLD_ENV="blue"
else
    NEW_ENV="blue"
    OLD_ENV="green"
fi

log "Deploying to $NEW_ENV environment"

log "Starting $NEW_ENV environment"
docker-compose -f ./docker/docker-compose.$NEW_ENV.yml up -d

log "Waiting for $NEW_ENV environment to become healthy"
RETRY_COUNT=0
MAX_RETRIES=15
HEALTHCHECK_PORT=$([ "$NEW_ENV" == "blue" ] && echo 8001 || echo 8002)

until curl -s http://localhost:$HEALTHCHECK_PORT/ > /dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
    log "Health check attempt $((RETRY_COUNT+1))/$MAX_RETRIES"
    RETRY_COUNT=$((RETRY_COUNT+1))
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    log "ERROR: $NEW_ENV environment failed health checks"
    log "Rolling back to $OLD_ENV environment"
    docker-compose -f ./docker/docker-compose.$NEW_ENV.yml down
    exit 1
fi

log "$NEW_ENV environment is healthy"

if [ "$ACTIVE_ENV" != "none" ]; then
    log "Preparing to update Nginx configuration for balanced traffic"
    cp ./nginx/default_balanced.conf ./nginx/default.conf
    
    if ! docker ps | grep -q resume-nginx; then
        log "Starting Nginx container"
        docker-compose -f ./docker/docker-compose.nginx.yml up -d
        sleep 5
    else
        log "Restarting Nginx to apply balanced configuration"
        docker-compose -f ./docker/docker-compose.nginx.yml restart
        sleep 5
    fi

    log "Monitoring for errors during 10 second transition period"
    ERROR_COUNT=0
    
    for i in {1..2}; do
        sleep 5
        if [ -f ./logs/error.log ] && grep -q "500\|502\|503\|504" ./logs/error.log; then
            log "ERROR: Detected error responses during transition"
            ERROR_COUNT=$((ERROR_COUNT+1))
        fi
        log "Transition progress: $((i*5))/10 seconds"
    done

    if [ $ERROR_COUNT -gt 0 ]; then
        log "ERROR: Detected $ERROR_COUNT error periods during transition"
        log "Rolling back to $OLD_ENV environment"
        cp ./nginx/default_$OLD_ENV.conf ./nginx/default.conf
        docker-compose -f ./docker/docker-compose.nginx.yml restart
        docker-compose -f ./docker/docker-compose.$NEW_ENV.yml down
        log "Rollback complete. Deployment failed."
        exit 1
    fi

    log "Transition successful. Shifting 100% traffic to $NEW_ENV"
    cp ./nginx/default_$NEW_ENV.conf ./nginx/default.conf
    docker-compose -f ./docker/docker-compose.nginx.yml restart
    
    log "Stopping $OLD_ENV environment"
    docker-compose -f ./docker/docker-compose.$OLD_ENV.yml down
else
    log "Initial deployment. Setting up Nginx to point to $NEW_ENV"
    cp ./nginx/default_$NEW_ENV.conf ./nginx/default.conf
    
    if ! docker ps | grep -q resume-nginx; then
        log "Starting Nginx container"
        docker-compose -f ./docker/docker-compose.nginx.yml up -d
    else
        log "Restarting Nginx to apply configuration"
        docker-compose -f ./docker/docker-compose.nginx.yml restart
    fi
fi

log "Deployment successful! Active environment: $NEW_ENV"
