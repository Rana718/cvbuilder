import redis.asyncio as redis
import os
import dotenv
import asyncio

dotenv.load_dotenv()

redis_client: redis.Redis = None
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

async def init_redis():
    global redis_client
    if redis_client is None:
        try:
            redis_client = redis.from_url(
                redis_url, 
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True,
                health_check_interval=30
            )
            # Test connection with timeout
            await asyncio.wait_for(redis_client.ping(), timeout=5.0)
            print("Connected to Redis successfully")
        except Exception as e:
            print(f"Failed to connect to Redis: {e}")
            print("Application will continue without Redis caching")
            redis_client = None
    return redis_client

async def get_redis_client():
    """Get Redis client with connection retry"""
    global redis_client
    if redis_client is None:
        await init_redis()
    return redis_client
