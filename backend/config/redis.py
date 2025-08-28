import redis.asyncio as redis
import os


redis_client: redis.Redis = None

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")


async def init_redis():
    global redis_client
    if redis_client is None:
        redis_client = redis.from_url(redis_url, decode_responses=True)
        try:
            await redis_client.ping()
            print("Connected to Redis")
        except Exception as e:
            print(f"Failed to connect to Redis: {e}")
            redis_client = None
    return redis_client
