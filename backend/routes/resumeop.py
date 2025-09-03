from typing import Dict, Optional
from fastapi import APIRouter, Depends, Request, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from db.db import get_db
from controller.resume import ResumeController
from models.cv_models import ResumeCreate, ResumeUpdate, ResumeResponse, ResumeFeedbackResponse
from middleware.rediscache import redis_cache

app = APIRouter()

@app.post("/save", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def save_resume(
    resume_data: ResumeCreate,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Save a new resume for the authenticated user"""
    firebase_uid = request.state.user_id
    result = await ResumeController.create_resume(resume_data, firebase_uid, db)
    await redis_cache.purge_pattern(f"user_{firebase_uid}")
    return result

@app.get("/all", response_model=List[ResumeResponse])
@redis_cache.cache_get(expire_minutes=20)
async def get_all_resumes(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get all resumes for the authenticated user"""
    firebase_uid = request.state.user_id
    return await ResumeController.get_user_resumes(firebase_uid, db)

@app.get("/{resume_id}", response_model=ResumeResponse)
@redis_cache.cache_get(expire_minutes=20)
async def get_resume(
    resume_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific resume by ID for the authenticated user"""
    firebase_uid = request.state.user_id
    return await ResumeController.get_resume_by_id(resume_id, firebase_uid, db)

@app.post("/share/{resume_id}", response_model=Dict[str, str])
async def generate_shareable_link(
    resume_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Generate a shareable link for a specific resume"""
    firebase_uid = request.state.user_id
    result = await ResumeController.generate_shareable_link(resume_id, firebase_uid, db)
    await redis_cache.purge_pattern(f"user_{firebase_uid}")
    return result

@app.put("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: int,
    resume_data: ResumeUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Update a specific resume for the authenticated user"""
    firebase_uid = request.state.user_id
    result = await ResumeController.update_resume(resume_id, resume_data, firebase_uid, db)
    await redis_cache.purge_pattern(f"user_{firebase_uid}")
    return result

@app.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific resume for the authenticated user"""
    firebase_uid = request.state.user_id
    result = await ResumeController.delete_resume(resume_id, firebase_uid, db)
    await redis_cache.purge_pattern(f"user_{firebase_uid}")
    return result


@app.post("/analyze", response_model=ResumeFeedbackResponse)
async def analyze_resume(
    resume_file: UploadFile = File(...),
    job_title: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
):
    """
    Analyze a resume file and provide AI-powered feedback
    """ 
    return ResumeController.analyze_resume(
        resume_file=resume_file,
        job_title=job_title,
        job_description=job_description
    )
