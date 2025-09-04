from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from utils.activity_logger import log_user_activity
import asyncio

class ActivityTrackerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Only track authenticated users
        if hasattr(request.state, 'user_id') and request.state.user_id:
            # Track specific endpoints
            if request.url.path.startswith('/api/'):
                action = self._get_action_from_path(request.method, request.url.path)
                if action:
                    # Run activity logging in background
                    asyncio.create_task(self._log_activity_async(request, action))
        
        return response
    
    def _get_action_from_path(self, method: str, path: str) -> str:
        if '/resume-op/' in path:
            if method == 'POST' and path.endswith('/save'):
                return 'Resume Created'
            elif method == 'GET' and '/all' in path:
                return 'Viewed Resumes'
            elif method == 'PUT':
                return 'Resume Updated'
            elif method == 'DELETE':
                return 'Resume Deleted'
        elif '/cover-letters/' in path:
            if method == 'POST':
                return 'Cover Letter Created'
            elif method == 'GET':
                return 'Viewed Cover Letters'
        elif '/payment/' in path:
            if method == 'POST':
                return 'Payment Action'
        return None
    
    async def _log_activity_async(self, request: Request, action: str):
        try:
            async for db in get_db():
                from db.scheme import User
                from sqlalchemy import select
                
                # Get user ID from firebase_uid
                result = await db.execute(select(User.id).where(User.firebase_uid == request.state.user_id))
                user_id = result.scalar_one_or_none()
                
                if user_id:
                    await log_user_activity(db, user_id, action, request=request)
                break
        except Exception:
            pass  # Silently fail to not affect main request
