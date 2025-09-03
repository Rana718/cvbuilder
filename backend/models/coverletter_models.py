from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CoverLetterGenerateRequest(BaseModel):
    """Request model for generating cover letter from resume file and job details"""
    job_title: str
    job_description: str

class CoverLetterCreateRequest(BaseModel):
    """Request model for saving a cover letter"""
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    recipient_title: Optional[str] = None
    recipient_company: Optional[str] = None
    body: str
    template_id: int
    resume_id: Optional[int] = None

class CoverLetterResponse(BaseModel):
    """Response model for cover letter"""
    id: int
    user_id: int
    resume_id: Optional[int]
    template_id: int
    name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    recipient_title: Optional[str]
    recipient_company: Optional[str]
    body: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CoverLetterGenerateResponse(BaseModel):
    """Response model for generated cover letter body"""
    body: str
