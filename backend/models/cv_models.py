from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class WorkExperience(BaseModel):
    title: str
    company: str
    duration: str
    description: Optional[str] = None

class Education(BaseModel):
    degree: str
    institution: str
    year: str
    gpa: Optional[str] = None

class Project(BaseModel):
    name: str
    description: str
    technologies: Optional[List[str]] = None
    url: Optional[str] = None

class Certification(BaseModel):
    name: str
    issuer: str
    date: str
    credential_id: Optional[str] = None

class Language(BaseModel):
    name: str
    proficiency: str

class CVData(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    job_title: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[WorkExperience]] = None
    education: Optional[List[Education]] = None
    certifications: Optional[List[Certification]] = None
    projects: Optional[List[Project]] = None
    languages: Optional[List[Language]] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class WorkExperienceRequest(BaseModel):
    job_title: str
    company: str
    location: str
    role: str
    start_date: str
    end_date: str
class SkillsRequest(BaseModel):
    experience: List[WorkExperience]
class SummaryRequest(BaseModel):
    document_id: int  
    cv_data: CVData

class DirectSummaryRequest(BaseModel):
    name: str
    skills: Optional[List[str]] = None
    experience: Optional[List[WorkExperience]] = None

class WorkExperienceResponse(BaseModel):
    points: List[str]

class SkillsResponse(BaseModel):
    skills: List[str]

class SummaryResponse(BaseModel):
    suggestions: List[str]


# Resume CRUD Models
class ResumeCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    job_title: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[Dict[str, Any]] = None
    experience: Optional[Dict[str, Any]] = None
    education: Optional[Dict[str, Any]] = None
    certifications: Optional[Dict[str, Any]] = None
    projects: Optional[Dict[str, Any]] = None
    languages: Optional[Dict[str, Any]] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    template_id: int
    theme_color: Optional[str] = "blue"


class ResumeUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    job_title: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[Dict[str, Any]] = None
    experience: Optional[Dict[str, Any]] = None
    education: Optional[Dict[str, Any]] = None
    certifications: Optional[Dict[str, Any]] = None
    projects: Optional[Dict[str, Any]] = None
    languages: Optional[Dict[str, Any]] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    template_id: Optional[int] = None
    theme_color: Optional[str] = None


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    name: str
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    job_title: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[Dict[str, Any]] = None
    experience: Optional[Dict[str, Any]] = None
    education: Optional[Dict[str, Any]] = None
    certifications: Optional[Dict[str, Any]] = None
    projects: Optional[Dict[str, Any]] = None
    languages: Optional[Dict[str, Any]] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    template_id: int
    theme_color: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
