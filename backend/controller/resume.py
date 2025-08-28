from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.scheme import Resume, User
from models.cv_models import ResumeCreate, ResumeUpdate, ResumeResponse
from typing import List, Dict


class ResumeController:
    
    @staticmethod
    async def _get_resume_by_id_and_user(resume_id: int, user_id: int, db: AsyncSession) -> Resume:
        query = select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id)
        result = await db.execute(query)
        resume = result.scalar_one_or_none()
        
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found or you don't have permission to access it"
            )
        return resume
    
    @staticmethod
    async def _check_user_exists(user_id: int, db: AsyncSession) -> None:
        result = await db.execute(select(User).where(User.id == user_id))
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
    
    @staticmethod
    def _create_resume_from_data(resume_data: ResumeCreate, user_id: int) -> Resume:
        return Resume(
            user_id=user_id,
            **resume_data.dict()
        )
    
    @staticmethod
    async def create_resume(resume_data: ResumeCreate, user_id: int, db: AsyncSession) -> ResumeResponse:
        try:
            await ResumeController._check_user_exists(user_id, db)
            
            new_resume = ResumeController._create_resume_from_data(resume_data, user_id)
            db.add(new_resume)
            await db.commit()
            await db.refresh(new_resume)
            
            return ResumeResponse.from_orm(new_resume)
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create resume: {str(e)}"
            )
    
    @staticmethod
    async def get_user_resumes(user_id: int, db: AsyncSession) -> List[ResumeResponse]:
        try:
            query = select(Resume).where(Resume.user_id == user_id).order_by(Resume.created_at.desc())
            result = await db.execute(query)
            resumes = result.scalars().all()
            
            return [ResumeResponse.from_orm(resume) for resume in resumes]
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch resumes: {str(e)}"
            )
    
    @staticmethod
    async def get_resume_by_id(resume_id: int, user_id: int, db: AsyncSession) -> ResumeResponse:
        try:
            resume = await ResumeController._get_resume_by_id_and_user(resume_id, user_id, db)
            return ResumeResponse.from_orm(resume)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch resume: {str(e)}"
            )
    
    @staticmethod
    async def update_resume(resume_id: int, resume_data: ResumeUpdate, user_id: int, db: AsyncSession) -> ResumeResponse:
        try:
            resume = await ResumeController._get_resume_by_id_and_user(resume_id, user_id, db)
            
            update_data = resume_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(resume, field, value)
            
            await db.commit()
            await db.refresh(resume)
            
            return ResumeResponse.from_orm(resume)
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update resume: {str(e)}"
            )
    
    @staticmethod
    async def delete_resume(resume_id: int, user_id: int, db: AsyncSession) -> Dict[str, str]:
        try:
            resume = await ResumeController._get_resume_by_id_and_user(resume_id, user_id, db)
            
            await db.delete(resume)
            await db.commit()
            
            return {"message": "Resume deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete resume: {str(e)}"
            )