import json
import re
from typing import List, Dict, Any
from config.openai import client, DEFAULT_MODEL
from models.cv_models import CVData, DirectSummaryRequest, SkillsRequest, WorkExperience

class CVGenerator:
    
    @staticmethod
    def _extract_json_array(content: str) -> List[str]:
        """Extract JSON array from response, handling various formats"""
        content = content.strip()
        
        # Remove markdown code blocks
        content = re.sub(r'```(?:json)?\n?', '', content)
        
        try:
            # Try direct JSON parsing
            parsed = json.loads(content)
            if isinstance(parsed, list):
                return [str(item).strip() for item in parsed if item]
            elif isinstance(parsed, dict) and 'points' in parsed:
                return [str(item).strip() for item in parsed['points'] if item]
            return [str(parsed)] if parsed else []
        except json.JSONDecodeError:
            pass
        
        # Extract array pattern
        array_match = re.search(r'\[(.*?)\]', content, re.DOTALL)
        if array_match:
            try:
                return json.loads(array_match.group())
            except json.JSONDecodeError:
                # Parse manually
                items = re.findall(r'"([^"]+)"', array_match.group())
                return [item.strip() for item in items if len(item.strip()) > 5]
        
        # Fallback: extract lines
        lines = [line.strip().strip('"-.,') for line in content.split('\n') 
                if line.strip() and not line.strip().startswith(('#', '//', '*'))]
        return [line for line in lines if len(line) > 10][:20]
    
    @staticmethod
    async def generate_work_experience(job_title: str, company: str, location: str, 
                                     role: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Generate specific work experience bullet points"""
        
        prompt = f"""Generate 15 professional bullet points for this work experience:

Job Title: {job_title}
Company: {company}
Role: {role}
Period: {start_date} to {end_date}

Write realistic work responsibilities and achievements for this {job_title} role. Focus on what someone in this position would actually do at {company}. Keep each point 12-18 words and start with action verbs.

Return as JSON array of 15 strings only."""
        
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert CV writer. Generate specific work experience bullet points based on the exact job information provided. Return only JSON array."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=600,
                frequency_penalty=0.2
            )
            
            content = response.choices[0].message.content.strip()
            points = CVGenerator._extract_json_array(content)
            
            # Simple length filter
            filtered_points = [p for p in points if 8 <= len(p.split()) <= 20][:15]
            
            return {"success": True, "points": filtered_points}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def generate_skills(work_experience: SkillsRequest) -> Dict[str, Any]:
        """Generate relevant skills based on work experience"""
        
        # Debug: Check what data we actually have
        if not hasattr(work_experience, 'experience') or not work_experience.experience:
            # Fallback: use any available data from the request
            job_titles = []
            roles = []
        else:
            job_titles = [exp.title for exp in work_experience.experience] if work_experience.experience else []
            roles = [getattr(exp, 'role', '') for exp in work_experience.experience] if work_experience.experience else []
        
        # If no experience data, create a generic prompt
        if not job_titles and not roles:
            prompt = """Generate 12 common professional skills for general business and technical roles:

Mix of technical and soft skills that are valuable across different industries.

Return as JSON array of 12 skill strings."""
        else:
            prompt = f"""Generate 12 relevant skills based on this work experience:

Job Titles: {', '.join(job_titles[:3])}
Role Descriptions: {', '.join(roles[:3])}

List professional skills that match these specific roles. Include both technical skills and soft skills that someone in these positions would need.

Return as JSON array of 12 skill strings."""
        
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "Generate industry-specific skills based on work experience context. Return only JSON array."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=300,
                frequency_penalty=0.4
            )
            
            content = response.choices[0].message.content.strip()
            skills = CVGenerator._extract_json_array(content)
            
            # Filter and validate skills
            filtered_skills = [s for s in skills if 1 <= len(s.split()) <= 4][:12]
            
            # Ensure we always return something
            if not filtered_skills:
                filtered_skills = ["Problem Solving", "Communication", "Leadership", "Project Management", 
                                 "Analytical Thinking", "Teamwork", "Time Management", "Technical Writing",
                                 "Customer Service", "Data Analysis", "Strategic Planning", "Process Improvement"]
            
            return {"success": True, "skills": filtered_skills}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def generate_summary(cv_data: DirectSummaryRequest) -> Dict[str, Any]:
        """Generate professional summary variations"""
        
        # Build focused context
        top_skills = cv_data.skills[:6] if cv_data.skills else []
        recent_experience = cv_data.experience[:2] if cv_data.experience else []
        
        experience_text = " ".join([
            f"{exp.title} at {exp.company}" for exp in recent_experience
        ]) if recent_experience else "Professional experience"
        
        skills_text = ", ".join(top_skills) if top_skills else ""
        
        prompt = f"""Create 3 professional summary variations for this candidate:

Work Experience: {experience_text}
Key Skills: {skills_text}

Write 3 different professional summaries, each 60-80 words. Focus on their specific experience and skills. Make each summary highlight different strengths from their background.

Return as JSON array of 3 summary strings."""
        
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": "Create focused professional summaries based on specific candidate data. Return only JSON array."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=500,
                frequency_penalty=0.3
            )
            
            content = response.choices[0].message.content.strip()
            summaries = CVGenerator._extract_json_array(content)
            
            # Validate word count and quality
            valid_summaries = []
            for summary in summaries:
                word_count = len(summary.split())
                if 50 <= word_count <= 90:  # Slight tolerance
                    valid_summaries.append(summary)
                if len(valid_summaries) >= 3:
                    break
            
            return {"success": True, "summary": valid_summaries[:3]}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def _calculate_duration(start_date: str, end_date: str) -> int:
        """Calculate work duration in years"""
        try:
            # Basic year extraction - can be enhanced with proper date parsing
            start_year = int(re.search(r'\d{4}', start_date).group()) if re.search(r'\d{4}', start_date) else 2020
            end_year = int(re.search(r'\d{4}', end_date).group()) if re.search(r'\d{4}', end_date) else 2024
            return max(1, end_year - start_year)
        except:
            return 2  # Default assumption
    
    @staticmethod
    def _determine_seniority(job_title: str, duration_years: int) -> str:
        """Determine seniority level from job title and duration"""
        title_lower = job_title.lower()
        
        senior_keywords = ['senior', 'lead', 'principal', 'director', 'manager', 'head', 'chief']
        junior_keywords = ['junior', 'entry', 'intern', 'trainee', 'associate', 'assistant']
        
        if any(keyword in title_lower for keyword in senior_keywords) or duration_years >= 5:
            return "Senior Level"
        elif any(keyword in title_lower for keyword in junior_keywords) or duration_years <= 2:
            return "Entry Level"
        else:
            return "Mid Level"
    
    @staticmethod
    def _determine_career_level(job_titles: List[str]) -> str:
        """Determine overall career level"""
        if not job_titles:
            return "Mid Level"
        
        combined_titles = " ".join(job_titles).lower()
        
        if any(word in combined_titles for word in ['director', 'vp', 'chief', 'head', 'principal']):
            return "Executive"
        elif any(word in combined_titles for word in ['senior', 'lead', 'manager']):
            return "Senior"
        elif any(word in combined_titles for word in ['junior', 'entry', 'intern', 'trainee']):
            return "Entry"
        else:
            return "Mid-Level"