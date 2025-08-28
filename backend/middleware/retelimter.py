from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from config.redis import redis_client
from typing import Tuple


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 50, window_minutes: int = 1, block_minutes: int = 10):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_minutes * 60
        self.block_seconds = block_minutes * 60
        self.rate_limit_response = JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": f"Rate limit exceeded. IP blocked for {block_minutes} minutes."}
        )

    @staticmethod
    def get_client_ip(request: Request) -> str:
        forwarded = request.headers.get("X-Forwarded-For")
        return forwarded.split(",")[0].strip() if forwarded else request.client.host

    def _get_redis_keys(self, ip: str) -> Tuple[str, str]:
        return f"blocked:{ip}", f"rate:{ip}"

    async def is_allowed(self, ip: str) -> bool:
        block_key, rate_key = self._get_redis_keys(ip)
        
        if await redis_client.exists(block_key):
            return False

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

    async def dispatch(self, request: Request, call_next):
        if not await self.is_allowed(self.get_client_ip(request)):
            return self.rate_limit_response
        
        return await call_next(request)