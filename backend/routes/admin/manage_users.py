from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from middleware.admin_auth import require_admin
from db.scheme import User
from sqlalchemy import select
from typing import List

router = APIRouter()

@router.get("/users", response_model=List[dict])
async def get_all_users(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all users (Admin and Super Admin only)
    """
    try:
        result = await db.execute(select(User))
        users = result.scalars().all()
        
        return [
            {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "isAdmin": user.isAdmin,
                "isSuperAdmin": user.isSuperAdmin,
                "created_at": user.created_at,
                "last_login": user.last_login
            }
            for user in users
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch users: {str(e)}"
        )

@router.get("/user/{user_id}")
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user by ID (Admin and Super Admin only)
    """
    try:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "isAdmin": user.isAdmin,
            "isSuperAdmin": user.isSuperAdmin,
            "created_at": user.created_at,
            "last_login": user.last_login
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user: {str(e)}"
        )
