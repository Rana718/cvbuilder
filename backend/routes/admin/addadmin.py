from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from controller.authcontroller import AuthController
from models.admin_models import SuperAdminRequest, AddAdminRequest, AdminResponse
from middleware.admin_auth import require_super_admin
from db.scheme import User

router = APIRouter()

@router.post("/add-admin", response_model=AdminResponse)
async def add_admin(
    request: AddAdminRequest,
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Add admin role to user (Super admin only)
    Only super admins can add admin roles to other users.
    Normal admins cannot add admin roles - they can only view and manage regular users.
    """
    # Double-check that the requesting user is indeed a super admin
    if not current_user.isSuperAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can modify admin roles"
        )
    
    result = await AuthController.add_admin_by_super_admin(
        user_email=request.user_email,
        make_admin=request.make_admin,
        make_super_admin=request.make_super_admin,
        requesting_user=current_user,
        db=db
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return AdminResponse(**result)

@router.post("/remove-admin", response_model=AdminResponse)
async def remove_admin(
    request: AddAdminRequest,
    current_user: User = Depends(require_super_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Remove admin role from user (Super admin only)
    Only super admins can remove admin roles from other users.
    Set make_admin=False and make_super_admin=False to remove all admin privileges.
    """
    # Double-check that the requesting user is indeed a super admin
    if not current_user.isSuperAdmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only super admins can modify admin roles"
        )
    
    # Force both to False for removal
    result = await AuthController.add_admin_by_super_admin(
        user_email=request.user_email,
        make_admin=False,
        make_super_admin=False,
        requesting_user=current_user,
        db=db
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return AdminResponse(**result)

