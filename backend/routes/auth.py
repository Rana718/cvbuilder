from fastapi import APIRouter, HTTPException, Depends, status, Request
from sqlalchemy.orm import Session
from db.db import get_db
from controller.authcontroller import AuthController
from models.auth_models import AddUserProfileRequest
from models.admin_models import SuperAdminRequest

router = APIRouter()

@router.post("/add-user")
async def firebase_auth(request: AddUserProfileRequest):
    result = await AuthController.AdduserDb(request)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result["error"]
        )
    
    return result["user"]

@router.get("/profile")
async def get_profile(request: Request, db: Session = Depends(get_db)):
    """Get current user profile"""
    firebase_uid = request.state.user_id  
    result = await AuthController.get_user_profile(firebase_uid, db)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result["error"]
        )
    
    return result["user"]

@router.post("/create-super-admin")
async def create_super_admin(
    request: SuperAdminRequest,
    db: Session = Depends(get_db)
):
    """
    Create super admin using secret key
    Authenticated users can become super admin with the correct secret key
    """
    
    result = await AuthController.create_super_admin(
        email=request.email,
        secret_key=request.secret_key,
        db=db
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result


