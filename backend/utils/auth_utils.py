from fastapi import Request, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from db.scheme import User

async def get_user_from_firebase_uid(db: AsyncSession, firebase_uid: str, email: str = None) -> User:
    """
    Get database user from Firebase UID and email.
    This function should be used in routes that need the database user ID.
    """
    result = await db.execute(
        select(User).where(
            or_(
                User.firebase_uid == firebase_uid,
                User.email == email
            ) if email else User.firebase_uid == firebase_uid
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found in database")
    
    return user

async def get_current_user_from_request(request: Request, db: AsyncSession) -> User:
    """
    Get current user from request state and database.
    Use this in routes that need the full user object from database.
    """
    firebase_uid = getattr(request.state, 'user_id', None)
    email = getattr(request.state, 'user_email', None)
    
    if not firebase_uid:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return await get_user_from_firebase_uid(db, firebase_uid, email)

def get_firebase_uid_from_request(request: Request) -> str:
    """
    Get Firebase UID from request state.
    Use this for simple cases where you just need the Firebase UID.
    """
    firebase_uid = getattr(request.state, 'user_id', None)
    
    if not firebase_uid:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return firebase_uid
