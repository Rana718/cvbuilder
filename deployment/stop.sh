#!/bin/bash

set -e

# Create logs directory if it doesn't exist
mkdir -p ./logs

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a ./logs/logs.log
}

log "Stopping all deployment services"

# Stop all environments
log "Stopping blue environment"
docker-compose -f ./docker/docker-compose.blue.yml down 2>/dev/null || true

log "Stopping green environment"
docker-compose -f ./docker/docker-compose.green.yml down 2>/dev/null || true

log "Stopping nginx"
docker-compose -f ./docker/docker-compose.nginx.yml down 2>/dev/null || true

log "Stopping redis"
docker-compose -f ./docker/docker-compose.redis.yml down 2>/dev/null || true

log "All services stopped successfully"
