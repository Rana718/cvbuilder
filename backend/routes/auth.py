from fastapi import APIRouter, HTTPException, Depends, status, Request
from sqlalchemy.orm import Session
from db.db import get_db
from controller.authcontroller import AuthController
from models.auth_models import AddUserProfileRequest

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
