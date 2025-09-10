from fastapi import APIRouter, UploadFile, File, HTTPException
from config.openai import client
from utils.pdftotext import extract_text_from_pdf
import tempfile
import os
import json

router = APIRouter()

@router.post("/parse-cv")
async def parse_cv_from_pdf(cv_file: UploadFile = File(...)):
    """Upload PDF CV and extract structured data using AI"""
    
    if not cv_file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files supported")
    
    temp_file_path = None
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = cv_file.file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Extract text from PDF
        cv_text = extract_text_from_pdf(temp_file_path)
        
        if not cv_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # AI prompt for structured extraction
        prompt = f"""
Extract structured data from this CV/Resume text and return ONLY valid JSON matching this exact format:

{{
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "phone number",
    "city": "city",
    "state": "state",
    "country": "country",
    "postal_code": "postal code",
    "job_title": "desired job title or current role",
    "summary": "professional summary",
    "skills": ["skill1", "skill2", "skill3"],
    "experience": [
        {{
            "title": "Job Title",
            "company": "Company Name",
            "duration": "Start Date - End Date",
            "description": "Job description and achievements"
        }}
    ],
    "education": [
        {{
            "degree": "Degree Name",
            "institution": "Institution Name",
            "year": "Year",
            "gpa": "GPA if available"
        }}
    ],
    "certifications": [
        {{
            "name": "Certification Name",
            "issuer": "Issuing Organization",
            "date": "Date",
            "credential_id": "ID if available"
        }}
    ],
    "projects": [
        {{
            "name": "Project Name",
            "description": "Project description",
            "technologies": ["tech1", "tech2"],
            "url": "project url if available"
        }}
    ],
    "languages": [
        {{
            "name": "Language Name",
            "proficiency": "Proficiency Level"
        }}
    ],
    "socail_links": [
        {{
            "label": "LinkedIn",
            "url": "linkedin url",
            "username": "username"
        }}
    ]
}}

CV Text:
{cv_text}

Return ONLY the JSON object, no additional text or formatting.
"""
        
        # Get AI response
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a CV parser that extracts structured data. Return only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.1
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Parse JSON response
        try:
            structured_data = json.loads(response_text)
            return structured_data
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "name": "Could not extract",
                "email": None,
                "phone": None,
                "city": None,
                "state": None,
                "country": None,
                "postal_code": None,
                "job_title": None,
                "summary": cv_text[:500] + "..." if len(cv_text) > 500 else cv_text,
                "skills": [],
                "experience": [],
                "education": [],
                "certifications": [],
                "projects": [],
                "languages": [],
                "socail_links": []
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CV: {str(e)}")
    finally:
        # Clean up temp file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
