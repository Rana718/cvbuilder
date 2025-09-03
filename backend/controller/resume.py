from fastapi import HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.scheme import Resume, User
from models.cv_models import ResumeCreate, ResumeUpdate, ResumeResponse, ResumeFeedbackResponse
from typing import List, Dict, Optional
import uuid
import tempfile
import os
import json

from config.openai import client, DEFAULT_MODEL
from utils.pdftotext import extract_text_from_pdf



class ResumeController:
    
    @staticmethod
    async def _get_user_by_firebase_uid(firebase_uid: str, db: AsyncSession) -> User:
        result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found. Please complete registration."
            )
        return user
    
    @staticmethod
    async def _get_resume_by_id_and_firebase_uid(resume_id: int, firebase_uid: str, db: AsyncSession) -> Resume:
        user = await ResumeController._get_user_by_firebase_uid(firebase_uid, db)
        
        query = select(Resume).where(Resume.id == resume_id, Resume.user_id == user.id)
        result = await db.execute(query)
        resume = result.scalar_one_or_none()
        
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found or you don't have permission to access it"
            )
        return resume
    
    @staticmethod
    def _create_resume_from_data(resume_data: ResumeCreate, user_id: int) -> Resume:
        return Resume(
            user_id=user_id,
            **resume_data.dict()
        )
    
    @staticmethod
    async def create_resume(resume_data: ResumeCreate, firebase_uid: str, db: AsyncSession) -> ResumeResponse:
        try:
            user = await ResumeController._get_user_by_firebase_uid(firebase_uid, db)
            
            new_resume = ResumeController._create_resume_from_data(resume_data, user.id)
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
    async def get_user_resumes(firebase_uid: str, db: AsyncSession) -> List[ResumeResponse]:
        try:
            user = await ResumeController._get_user_by_firebase_uid(firebase_uid, db)
            
            query = select(Resume).where(Resume.user_id == user.id).order_by(Resume.created_at.desc())
            result = await db.execute(query)
            resumes = result.scalars().all()
            
            return [ResumeResponse.from_orm(resume) for resume in resumes]
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch resumes: {str(e)}"
            )
    
    @staticmethod
    async def get_resume_by_id(resume_id: int, firebase_uid: str, db: AsyncSession) -> ResumeResponse:
        try:
            resume = await ResumeController._get_resume_by_id_and_firebase_uid(resume_id, firebase_uid, db)
            return ResumeResponse.from_orm(resume)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch resume: {str(e)}"
            )
        

    @staticmethod
    async def get_resume_by_shared_uuid(shareable_uuid: str, db: AsyncSession) -> ResumeResponse:
        try:
            query = select(Resume).where(Resume.shareable_uuid == shareable_uuid)
            result = await db.execute(query)
            resume = result.scalar_one_or_none()
            
            if not resume:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Shared resume not found"
                )
            
            return ResumeResponse.from_orm(resume)
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch shared resume: {str(e)}"
            )
        
    @staticmethod
    async def generate_shareable_link(resume_id: int, firebase_uid: str, db: AsyncSession) -> Dict[str, str]:
        try:
            resume = await ResumeController._get_resume_by_id_and_firebase_uid(resume_id, firebase_uid, db)
            
            resume.shareable_uuid = str(uuid.uuid4())
            
            await db.commit()
            await db.refresh(resume)
            
            return {"shareable_uuid": resume.shareable_uuid}
            
        except HTTPException:
            raise
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to make resume shareable: {str(e)}"
            )
    
    @staticmethod
    async def update_resume(resume_id: int, resume_data: ResumeUpdate, firebase_uid: str, db: AsyncSession) -> ResumeResponse:
        try:
            resume = await ResumeController._get_resume_by_id_and_firebase_uid(resume_id, firebase_uid, db)
            
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
    async def delete_resume(resume_id: int, firebase_uid: str, db: AsyncSession) -> Dict[str, str]:
        try:
            resume = await ResumeController._get_resume_by_id_and_firebase_uid(resume_id, firebase_uid, db)
            
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
    
    @staticmethod
    def analyze_resume(
        resume_file: UploadFile,
        job_title: Optional[str] = None,
        job_description: Optional[str] = None
    ) -> ResumeFeedbackResponse:
        """
        Analyze a resume file and provide AI-powered feedback
        
        Args:
            resume_file: PDF file of the resume
            job_title: Optional job title for targeted feedback
            job_description: Optional job description for targeted feedback
            
        Returns:
            ResumeFeedbackResponse with rating, feedback, and recommendations
        """
        
        # Validate file type
        if not resume_file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        try:
            # Save uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
                content = resume_file.file.read()
                temp_file.write(content)
                temp_file_path = temp_file.name
            
            # Extract text from PDF
            resume_text = extract_text_from_pdf(temp_file_path)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
            
            if not resume_text.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from PDF")
            
            # Generate AI feedback
            feedback_result = ResumeController._generate_resume_feedback(
                resume_text, job_title, job_description
            )
            
            return feedback_result
            
        except Exception as e:
            # Clean up temp file if it exists
            if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")
    
    @staticmethod
    def _generate_resume_feedback(
        resume_text: str, 
        job_title: Optional[str] = None, 
        job_description: Optional[str] = None
    ) -> ResumeFeedbackResponse:
        """Generate AI-powered resume feedback using OpenAI"""
        
        # Create context-aware prompt
        if job_title and job_description:
            context = f"""
            TARGET JOB TITLE: {job_title}
            
            TARGET JOB DESCRIPTION:
            {job_description}
            
            Please analyze this resume specifically for the above position and provide targeted feedback.
            """
        elif job_title:
            context = f"""
            TARGET JOB TITLE: {job_title}
            
            Please analyze this resume specifically for this job title and provide targeted feedback.
            """
        else:
            context = "Please provide general feedback on this resume for overall improvement."
        
        prompt = f"""
        {context}
        
        RESUME CONTENT:
        {resume_text}
        
        Please analyze this resume and provide comprehensive feedback. Your response must be in the following JSON format:
        
        {{
            "overall_rating": <number from 1-10>,
            "feedback": "<detailed overall feedback paragraph>",
            "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
            "areas_for_improvement": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
            "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
        }}
        
        ANALYSIS CRITERIA:
        - Overall structure and formatting
        - Content quality and relevance
        - Skills and experience presentation
        - Achievement quantification
        - Professional summary effectiveness
        - ATS (Applicant Tracking System) friendliness
        - Industry-specific requirements (if job details provided)
        
        RATING SCALE:
        - 1-3: Needs significant improvement
        - 4-6: Average, room for improvement
        - 7-8: Good, minor improvements needed
        - 9-10: Excellent, minimal improvements needed
        
        Provide constructive, actionable feedback that helps the candidate improve their resume.
        Return ONLY the JSON response, no additional text.
        """
        
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert resume reviewer and career coach with extensive experience in HR and recruitment. Provide detailed, constructive feedback to help candidates improve their resumes."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1200,
                temperature=0.7
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Parse JSON response
            try:
                feedback_data = json.loads(response_text)
                
                # Validate the response structure
                required_fields = ["overall_rating", "feedback", "strengths", "areas_for_improvement", "recommendations"]
                for field in required_fields:
                    if field not in feedback_data:
                        raise ValueError(f"Missing required field: {field}")
                
                # Ensure rating is within valid range
                rating = int(feedback_data["overall_rating"])
                if rating < 1 or rating > 10:
                    rating = 5  # Default to middle rating if invalid
                
                return ResumeFeedbackResponse(
                    overall_rating=rating,
                    feedback=feedback_data["feedback"],
                    strengths=feedback_data["strengths"][:5],  # Limit to 5 items
                    areas_for_improvement=feedback_data["areas_for_improvement"][:5],
                    recommendations=feedback_data["recommendations"][:5]
                )
                
            except (json.JSONDecodeError, ValueError, KeyError) as e:
                # Fallback response if JSON parsing fails
                return ResumeFeedbackResponse(
                    overall_rating=5,
                    feedback="Unable to generate detailed feedback due to parsing error. Please try again.",
                    strengths=["Resume uploaded successfully"],
                    areas_for_improvement=["Please try uploading again for detailed analysis"],
                    recommendations=["Ensure the PDF contains readable text"]
                )
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI feedback generation failed: {str(e)}")
