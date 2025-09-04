from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import tempfile
import os
import uuid

from config.openai import client
from db.scheme import CoverLetter, User
from models.coverletter_models import (
    CoverLetterCreateRequest, 
    CoverLetterResponse, 
    CoverLetterGenerateResponse,
)
from utils.pdftotext import extract_text_from_pdf
from utils.activity_logger import log_user_activity


class CoverLetterController:
    
    @staticmethod
    def generate_cover_letter_from_file(
        resume_file: UploadFile,
        job_title: str,
        job_description: str,
        company_name: str
    ) -> CoverLetterGenerateResponse:
        if not resume_file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        temp_file_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                temp_file.write(resume_file.file.read())
                temp_file_path = temp_file.name
            
            resume_text = extract_text_from_pdf(temp_file_path)
            
            if not resume_text.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from PDF")
            
            cover_letter_body = CoverLetterController._generate_cover_letter_with_ai(
                resume_text, job_title, job_description, company_name
            )
            
            return CoverLetterGenerateResponse(body=cover_letter_body)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating cover letter: {str(e)}")
        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
    
    @staticmethod
    def _generate_cover_letter_with_ai(resume_text: str, job_title: str, job_description: str, company_name) -> str:
        prompt = f"""Based on the following resume content and job details, create a professional cover letter body.

        RESUME CONTENT:
        {resume_text}

        JOB TITLE: {job_title}

        COMPANY NAME: {company_name}

        JOB DESCRIPTION:
        {job_description}

        INSTRUCTIONS:
        - Create a compelling cover letter body that highlights relevant experience from the resume
        - Match the candidate's skills to the job requirements
        - Keep it professional and engaging
        - Length should be 3-4 paragraphs
        - Do not include header, date, recipient address, or closing signature
        - Only return the main body content of the cover letter
        - Start with a strong opening paragraph that mentions the specific position
        - Include specific examples from the resume that relate to the job requirements
        - End with a call to action

        Return only the cover letter body content, nothing else."""
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional career coach and expert cover letter writer."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")
    
    @staticmethod
    async def _get_user_by_firebase_uid(db: AsyncSession, user_id: str) -> User:
        result = await db.execute(select(User).filter(User.firebase_uid == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    
    @staticmethod
    async def create_cover_letter(
        db: AsyncSession, 
        user_id: str, 
        cover_letter_data: CoverLetterCreateRequest
    ) -> CoverLetterResponse:
        try:
            user = await CoverLetterController._get_user_by_firebase_uid(db, user_id)
            
            db_cover_letter = CoverLetter(
                user_id=user.id,
                resume_id=cover_letter_data.resume_id,
                template_id=cover_letter_data.template_id,
                name=cover_letter_data.name,
                email=cover_letter_data.email,
                phone=cover_letter_data.phone,
                address=cover_letter_data.address,
                recipient_title=cover_letter_data.recipient_title,
                recipient_company=cover_letter_data.recipient_company,
                body=cover_letter_data.body
            )
            
            db.add(db_cover_letter)
            await db.commit()
            await db.refresh(db_cover_letter)
            
            return CoverLetterResponse.model_validate(db_cover_letter)
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error saving cover letter: {str(e)}")
    
    @staticmethod
    async def get_user_cover_letters(db: AsyncSession, user_id: str) -> List[CoverLetterResponse]:
        try:
            user = await CoverLetterController._get_user_by_firebase_uid(db, user_id)
            
            result = await db.execute(select(CoverLetter).filter(CoverLetter.user_id == user.id))
            cover_letters = result.scalars().all()
            return [CoverLetterResponse.model_validate(cl) for cl in cover_letters]
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching cover letters: {str(e)}")
    
    @staticmethod
    async def get_cover_letter_by_id(db: AsyncSession, user_id: str, cover_letter_id: int) -> CoverLetterResponse:
        try:
            user = await CoverLetterController._get_user_by_firebase_uid(db, user_id)
            
            result = await db.execute(
                select(CoverLetter).filter(
                    CoverLetter.id == cover_letter_id,
                    CoverLetter.user_id == user.id
                )
            )
            cover_letter = result.scalar_one_or_none()
            
            if not cover_letter:
                raise HTTPException(status_code=404, detail="Cover letter not found")
            
            return CoverLetterResponse.model_validate(cover_letter)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching cover letter: {str(e)}")
    
    @staticmethod
    async def delete_cover_letter(db: AsyncSession, user_id: str, cover_letter_id: int) -> dict:
        try:
            user = await CoverLetterController._get_user_by_firebase_uid(db, user_id)
            
            result = await db.execute(
                select(CoverLetter).filter(
                    CoverLetter.id == cover_letter_id,
                    CoverLetter.user_id == user.id
                )
            )
            cover_letter = result.scalar_one_or_none()
            
            if not cover_letter:
                raise HTTPException(status_code=404, detail="Cover letter not found")
            
            await db.delete(cover_letter)
            await db.commit()
            
            return {"message": "Cover letter deleted successfully"}
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error deleting cover letter: {str(e)}")
    
    @staticmethod
    async def update_cover_letter(
        db: AsyncSession, 
        user_id: str, 
        cover_letter_id: int,
        cover_letter_data: CoverLetterCreateRequest
    ) -> CoverLetterResponse:
        try:
            user = await CoverLetterController._get_user_by_firebase_uid(db, user_id)
            
            result = await db.execute(
                select(CoverLetter).filter(
                    CoverLetter.id == cover_letter_id,
                    CoverLetter.user_id == user.id
                )
            )
            cover_letter = result.scalar_one_or_none()
            
            if not cover_letter:
                raise HTTPException(status_code=404, detail="Cover letter not found")
            
            # Update the cover letter fields
            cover_letter.name = cover_letter_data.name
            cover_letter.email = cover_letter_data.email
            cover_letter.phone = cover_letter_data.phone
            cover_letter.address = cover_letter_data.address
            cover_letter.recipient_title = cover_letter_data.recipient_title
            cover_letter.recipient_company = cover_letter_data.recipient_company
            cover_letter.body = cover_letter_data.body
            cover_letter.template_id = cover_letter_data.template_id
            cover_letter.resume_id = cover_letter_data.resume_id
            
            await db.commit()
            await db.refresh(cover_letter)
            
            return CoverLetterResponse.model_validate(cover_letter)
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error updating cover letter: {str(e)}")
        
    @staticmethod
    async def get_cover_letter_by_shareable_uuid(db: AsyncSession, shareable_uuid: str) -> CoverLetterResponse:
        try:
            result = await db.execute(
                select(CoverLetter).filter(
                    CoverLetter.shareable_uuid == shareable_uuid
                )
            )
            cover_letter = result.scalar_one_or_none()
            
            if not cover_letter:
                raise HTTPException(status_code=404, detail="Cover letter not found")
            
            return CoverLetterResponse.model_validate(cover_letter)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching cover letter: {str(e)}")
        

    @staticmethod
    async def make_cover_letter_shareable(db: AsyncSession, user_id: str, cover_letter_id: int) -> dict:
        try:
            user = await CoverLetterController._get_user_by_firebase_uid(db, user_id)
            
            result = await db.execute(
                select(CoverLetter).filter(
                    CoverLetter.id == cover_letter_id,
                    CoverLetter.user_id == user.id
                )
            )
            cover_letter = result.scalar_one_or_none()
            
            if not cover_letter:
                raise HTTPException(status_code=404, detail="Cover letter not found")
            
            if not cover_letter.shareable_uuid:
                cover_letter.shareable_uuid = str(uuid.uuid4())
                await db.commit()
                await db.refresh(cover_letter)
            
            return {"shareable_link": cover_letter.shareable_uuid}
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail=f"Error fetching cover letter: {str(e)}")