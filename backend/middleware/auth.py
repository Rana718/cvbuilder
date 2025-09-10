from fastapi import Request, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from config.firebase import verify_firebase_token
from db.db import get_db
from db.scheme import User
from utils.auth_utils import get_user_from_firebase_uid

async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    """Dependency to get current user from database using Firebase UID"""
    firebase_uid = getattr(request.state, 'user_id', None)
    email = getattr(request.state, 'user_email', None)
    
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )
    
    # Use the auth_utils function for consistent user retrieval
    return await get_user_from_firebase_uid(db, firebase_uid, email)

class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.protected_prefixes = [
            "/api/resume-op", 
            "/api/auth/profile", 
            "/api/cover-letters", 
            "/api/linkedin", 
            "/api/payment",
            "/api/dashboard",
            "/api/admin"  # Protect all admin routes
        ]

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
        request.state.user_id = decoded_token.get("uid")  # Store Firebase UID
        request.state.user_email = decoded_token.get("email")

        return await call_next(request)
