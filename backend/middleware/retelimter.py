from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from config.redis import redis_client

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 50, window_minutes: int = 1, block_minutes: int = 10):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_minutes * 60
        self.block_seconds = block_minutes * 60
    
    def get_client_ip(self, request: Request) -> str:
        """Get client IP address"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host
    
    async def is_allowed(self, ip: str) -> bool:
        """Check if IP is allowed to make request"""
        # If Redis is not available, allow all requests
        if redis_client is None:
            return True
            
        try:
            block_key = f"blocked:{ip}"
            if await redis_client.exists(block_key):
                return False
            
            rate_key = f"rate:{ip}"
            count = await redis_client.get(rate_key)
            
            if count is None:
                await redis_client.setex(rate_key, self.window_seconds, 1)
                return True
            
            count = int(count)
            
            if count >= self.max_requests:
                await redis_client.setex(block_key, self.block_seconds, 1)
                return False
            
            await redis_client.incr(rate_key)
            return True
            
        except Exception:
            return True
    
    async def dispatch(self, request: Request, call_next):
        ip = self.get_client_ip(request)
        
        if not await self.is_allowed(ip):
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded. IP blocked for 10 minutes."}
            )
        
        return await call_next(request)
