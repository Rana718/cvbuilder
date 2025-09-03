from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from db.db import get_db
from middleware.auth import get_current_user
from controller.coverletter import CoverLetterController
from models.coverletter_models import (
    CoverLetterCreateRequest,
    CoverLetterResponse,
    CoverLetterGenerateResponse
)

router = APIRouter()

@router.post("/generate", response_model=CoverLetterGenerateResponse)
async def generate_cover_letter(
    resume_file: UploadFile = File(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    company_name: str = Form(...),
):
    
    return CoverLetterController.generate_cover_letter_from_file(
        resume_file=resume_file,
        job_title=job_title,
        job_description=job_description,
        company_name=company_name

    )

@router.post("/save", response_model=CoverLetterResponse)
async def create_cover_letter(
    cover_letter: CoverLetterCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    return await CoverLetterController.create_cover_letter(
        db=db,
        user_id=user_id,
        cover_letter_data=cover_letter
    )


@router.post("/share/{cover_letter_id}", response_model=dict)
async def generate_shareable_link(
    cover_letter_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    return await CoverLetterController.generate_shareable_link(
        db=db,
        user_id=user_id,
        cover_letter_id=cover_letter_id
    )


@router.get("/", response_model=List[CoverLetterResponse])
async def get_all_cover_letters(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):    
    user_id = current_user["user_id"]
    return await CoverLetterController.get_user_cover_letters(db=db, user_id=user_id)

@router.get("/{cover_letter_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    cover_letter_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific cover letter by ID
    """
    
    user_id = current_user["user_id"]
    return await CoverLetterController.get_cover_letter_by_id(
        db=db,
        user_id=user_id,
        cover_letter_id=cover_letter_id
    )

@router.delete("/{cover_letter_id}")
async def delete_cover_letter(
    cover_letter_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a cover letter
    """
    
    user_id = current_user["user_id"]
    return await CoverLetterController.delete_cover_letter(
        db=db,
        user_id=user_id,
        cover_letter_id=cover_letter_id
    )
