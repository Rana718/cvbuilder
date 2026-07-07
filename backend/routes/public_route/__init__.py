from fastapi import APIRouter, UploadFile
from fastapi.params import File, Form

from controller.coverletter import CoverLetterController
from . import cv_gen, shared

publicrouter = APIRouter()

publicrouter.include_router(cv_gen.router, prefix="/cv-gen", tags=["CV Generation"])
publicrouter.include_router(shared.sharedrouter, prefix="/shared", tags=["Shared Resources"])



@publicrouter.post("/cover-letter/generate")
async def generate_cover_letter(
    company_name: str = Form(...),
    job_title: str = Form(...),
    job_description: str = Form(...),
    resume_file: UploadFile = File(...)
):
    """
    Generate a cover letter using AI from uploaded resume and job details
    """
    
    return CoverLetterController.generate_cover_letter_from_file(
        resume_file=resume_file,
        job_title=job_title,
        job_description=job_description,
        company_name=company_name
    )