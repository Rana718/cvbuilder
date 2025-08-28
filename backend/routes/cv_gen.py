from fastapi import APIRouter, HTTPException
from controller.cv_generator import CVGenerator
from models.cv_models import (
    WorkExperienceRequest, 
    SkillsRequest, 
    SummaryRequest,
    WorkExperienceResponse,
    SkillsResponse,
    SummaryResponse
)

router = APIRouter()

@router.post("/work-experience", response_model=WorkExperienceResponse)
async def generate_work_experience(request: WorkExperienceRequest):
    """Generate work experience bullet points"""
    result = CVGenerator.generate_work_experience(
        document_id=request.document_id,
        job_title=request.job_title,
        company=request.company,
        location=request.location,
        role=request.role,
        start_date=request.start_date,
        end_date=request.end_date,
        cv_context=request.cv_context or ""
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return WorkExperienceResponse(points=result["points"])

@router.post("/skills", response_model=SkillsResponse)
async def generate_skills(request: SkillsRequest):
    """Generate relevant skills based on CV data and context"""
    result = await CVGenerator.generate_skills(document_id=request.document_id)
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return SkillsResponse(skills=result["skills"])

@router.post("/summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    """Generate professional summary from CV data"""
    result = CVGenerator.generate_summary(
        document_id=request.document_id, 
        cv_data=request.cv_data
    )
    
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return SummaryResponse(summary=result["summary"])
