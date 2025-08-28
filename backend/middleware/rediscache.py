import json
import hashlib
from functools import wraps
from fastapi import Request
from config.redis import redis_client

class RedisCache:
    def __init__(self, expire_minutes: int = 20):
        self.expire_seconds = expire_minutes * 60
    
    def cache_key(self, request: Request) -> str:
        """Generate cache key from request"""
        key_data = f"{request.method}:{request.url.path}:{request.url.query}"
        return f"cache:{hashlib.md5(key_data.encode()).hexdigest()}"
    
    def cache_get(self, expire_minutes: int = 20):
        """Cache GET requests"""
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                request = kwargs.get('request') or (args[0] if args and hasattr(args[0], 'method') else None)
                
                if request and request.method == "GET":
                    cache_key = self.cache_key(request)
                    cached = await redis_client.get(cache_key)
                    
                    if cached:
                        return json.loads(cached)
                
                result = await func(*args, **kwargs)
                
                if request and request.method == "GET":
                    cache_key = self.cache_key(request)
                    await redis_client.setex(
                        cache_key, 
                        expire_minutes * 60, 
                        json.dumps(result, default=str)
                    )
                
                return result
            return wrapper
        return decorator
    
    async def purge_pattern(self, pattern: str):
        """Purge cache keys matching pattern"""
        keys = await redis_client.keys(f"cache:*{pattern}*")
        if keys:
            await redis_client.delete(*keys)
    
    async def purge_all(self):
        """Purge all cache"""
        keys = await redis_client.keys("cache:*")
        if keys:
            await redis_client.delete(*keys)

redis_cache = RedisCache()
