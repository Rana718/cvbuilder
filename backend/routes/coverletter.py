from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from middleware.rediscache import redis_cache

from db.db import get_db
from controller.coverletter import CoverLetterController
from models.coverletter_models import (
    CoverLetterCreateRequest,
    CoverLetterResponse,
)

router = APIRouter()

@router.get("/all", response_model=List[CoverLetterResponse])
async def get_cover_letters(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all cover letters for the authenticated user
    """
    
    user_id = request.state.user_id
    return await CoverLetterController.get_user_cover_letters(
        db=db,
        user_id=user_id
    )

@router.post("/", response_model=CoverLetterResponse)
async def create_cover_letter(
    cover_letter_data: CoverLetterCreateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new cover letter
    """
    
    user_id = request.state.user_id
    return await CoverLetterController.create_cover_letter(
        db=db,
        user_id=user_id,
        cover_letter_data=cover_letter_data
    )

@router.put("/{cover_letter_id}", response_model=CoverLetterResponse)
async def update_cover_letter(
    cover_letter_id: int,
    cover_letter_data: CoverLetterCreateRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Update an existing cover letter
    """
    
    user_id = request.state.user_id
    return await CoverLetterController.update_cover_letter(
        db=db,
        user_id=user_id,
        cover_letter_id=cover_letter_id,
        cover_letter_data=cover_letter_data
    )

@router.get("/{cover_letter_id}", response_model=CoverLetterResponse)
@redis_cache.cache_get(expire_minutes=20)
async def get_cover_letter(
    cover_letter_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a specific cover letter by ID
    """
    
    user_id = request.state.user_id
    return await CoverLetterController.get_cover_letter_by_id(
        db=db,
        user_id=user_id,
        cover_letter_id=cover_letter_id
    )

@router.delete("/{cover_letter_id}")
async def delete_cover_letter(
    cover_letter_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a cover letter
    """
    
    user_id = request.state.user_id
    return await CoverLetterController.delete_cover_letter(
        db=db,
        user_id=user_id,
        cover_letter_id=cover_letter_id
    )

@router.post("/{cover_letter_id}/share")
async def make_cover_letter_shareable(
    cover_letter_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Generate a shareable link for a cover letter
    """
    
    user_id = request.state.user_id
    return await CoverLetterController.make_cover_letter_shareable(
        db=db,
        user_id=user_id,
        cover_letter_id=cover_letter_id
    )
