from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from db.scheme import User
from middleware.auth import get_current_user
from middleware.admin_auth import require_admin, require_super_admin
from controller.admin.user_management import UserManagementController
from pydantic import BaseModel

router = APIRouter()

class UpdateAdminRoleRequest(BaseModel):
    user_id: int
    is_admin: bool
    is_super_admin: bool

class DeleteUserRequest(BaseModel):
    user_id: int

@router.get("/users-info")
async def get_users_info(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get comprehensive user statistics and user list"""
    return await UserManagementController.get_users_info(db)

@router.get("/admin-users")
async def get_admin_users(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get all admin users excluding current user"""
    return await UserManagementController.get_admin_users(db, current_user.id)

@router.delete("/delete-user")
async def delete_user(
    request: DeleteUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete a user and all related data"""
    return await UserManagementController.delete_user(db, request.user_id)

@router.post("/update-admin-role")
async def update_admin_role(
    request: UpdateAdminRoleRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_super_admin)
):
    """Update admin role for a user (only super admin can do this)"""
    return await UserManagementController.update_admin_role(
        db, 
        request.user_id, 
        request.is_admin, 
        request.is_super_admin,
        current_user
    )
