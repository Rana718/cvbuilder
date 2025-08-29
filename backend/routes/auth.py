from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from db.db import get_db
from controller.authcontroller import AuthController
from models.auth_models import SignupRequest, SigninRequest, GoogleAuthRequest,RefreshTokenRequest,AuthResponse,RefreshTokenResponse 

router = APIRouter()

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    result = await AuthController.signup(
        email=request.email,
        password=request.password,
        full_name=request.full_name
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result["response"]

@router.post("/login", response_model=AuthResponse)
async def signin(request: SigninRequest):
    result = await AuthController.signin(
        email=request.email,
        password=request.password
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result["error"]
        )
    
    return result["response"]

@router.post("/google", response_model=AuthResponse)
async def google_auth(request: GoogleAuthRequest):
    result = await AuthController.google_auth(
        google_id=request.google_id,
        email=request.email,
        full_name=request.full_name
    )
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )
    
    return result["response"]

@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """Generate new access token using refresh token"""
    result = await AuthController.refresh_access_token(request.refresh_token)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result["error"]
        )
    
    return RefreshTokenResponse(
        access_token=result["access_token"],
        token_type=result["token_type"]
    )

