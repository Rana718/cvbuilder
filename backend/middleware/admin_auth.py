from fastapi import HTTPException, status, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from utils.auth_utils import get_user_from_firebase_uid

async def require_admin(request: Request, db: AsyncSession = Depends(get_db)):
    """Middleware to require admin or super admin access"""
    firebase_uid = getattr(request.state, 'user_id', None)
    email = getattr(request.state, 'user_email', None)
    
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )
    
    user = await get_user_from_firebase_uid(db, firebase_uid, email)
    
    if not (user.isAdmin or user.isSuperAdmin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return user

async def require_super_admin(request: Request, db: AsyncSession = Depends(get_db)):
    """Middleware to require super admin access only"""
    firebase_uid = getattr(request.state, 'user_id', None)
    email = getattr(request.state, 'user_email', None)
    
    if not firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated"
        )
    
    user = await get_user_from_firebase_uid(db, firebase_uid, email)
    
    if not user.isSuperAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required"
        )
    
    return user
