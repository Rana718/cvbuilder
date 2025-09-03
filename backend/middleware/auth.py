from fastapi import Request, status, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from config.firebase import verify_firebase_token

def get_current_user(request: Request) -> dict:
    """Dependency to get current user from request state"""
    if not hasattr(request.state, 'user_id'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )
    
    return {
        "user_id": request.state.user_id,
        "email": getattr(request.state, 'user_email', None)
    }

class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.protected_prefixes = ["/api/resume-op", "/api/auth/profile"]

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        if not any(request.url.path.startswith(prefix) for prefix in self.protected_prefixes):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Missing or invalid token"}
            )

        token = auth_header.split(" ")[1]
        decoded_token = verify_firebase_token(token)
        
        if not decoded_token:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid token"}
            )

        # Keep same request state structure as before
        request.state.user_id = decoded_token.get("uid")  
        request.state.user_email = decoded_token.get("email")

        return await call_next(request)
