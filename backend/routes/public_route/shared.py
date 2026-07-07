from fastapi import APIRouter
from controller.coverletter import CoverLetterController
from models.coverletter_models import CoverLetterResponse
from middleware.rediscache import redis_cache
from models.cv_models import ResumeResponse
from sqlalchemy.ext.asyncio import AsyncSession
from controller.resume import ResumeController
from db.db import get_db
from fastapi import Depends


sharedrouter = APIRouter()

@sharedrouter.get("/resume/{shareable_uuid}", response_model=ResumeResponse)
@redis_cache.cache_get(expire_minutes=20)
async def get_shared_resume(
    shareable_uuid: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a shared resume by its shareable UUID"""
    return await ResumeController.get_resume_by_shared_uuid(shareable_uuid, db)

@sharedrouter.get("/cover-letter/{shareable_uuid}", response_model=CoverLetterResponse)
async def get_shared_cover_letter(
    shareable_uuid: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a cover letter by its shareable UUID (public access)
    """
    
    return await CoverLetterController.get_cover_letter_by_shareable_uuid(
        db=db,
        shareable_uuid=shareable_uuid
    )
