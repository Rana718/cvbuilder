import json
import re
from config.openai import client, DEFAULT_MODEL
# from utils.context_manager import context_manager
from models.cv_models import CVData, DirectSummaryRequest, SkillsRequest, WorkExperience

class CVGenerator:
    
    @staticmethod
    def _parse_json_response(content: str):
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            
            lines = [line.strip().strip('"-').strip() 
                    for line in content.split('\n') 
                    if line.strip() and not line.strip().startswith('#')]
            return [p for p in lines if p and len(p) > 10]
    
    @staticmethod
    async def generate_work_experience(job_title: str, company: str, location: str, role: str, start_date: str, end_date: str):
        
        prompt = f"""Generate 20 specific work experience bullet points for:

        Job Title: {job_title}
        Company: {company}
        Location: {location}
        Role/Department: {role}
        Duration: {start_date} to {end_date}

        Make bullet points specifically relevant to "{job_title}" at "{company}".

        Requirements:
        - 10-20 words each
        - According to the job title and experience level
        - Specific achievements with metrics
        - Role-specific responsibilities
        - Industry context consideration
        - Use action verbs

        Return as JSON array of strings."""
        
        try:
            messages = [
                {"role": "system", "content": "You are a professional CV expert. Generate specific work experience bullet points."},
                {"role": "user", "content": prompt}
            ]
            
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
                temperature=0.6,
                max_tokens=400,
            )
            
            content = response.choices[0].message.content.strip()
            points = CVGenerator._parse_json_response(content)
            
            return {"success": True, "points": points}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def generate_skills(work_experience: SkillsRequest):
        try:
            
            prompt = f"""Based on our previous conversation about work experience, generate 15-20 highly relevant professional skills.
            Analyze the job titles, companies, and responsibilities mentioned and generate skills that are:
            - DIRECTLY relevant to those specific roles and industries
            - Both technical and soft skills matching the experience level
            - Specific to the career path discussed, not generic
            - Appropriate for the industry and seniority level
            - Work Experience: ${work_experience}
            Return as JSON array of strings."""
            
            messages = [
                {"role": "system", "content": "You are a professional CV expert. Based on the work experience context, generate highly relevant and specific skills."}
            ] + [{"role": "user", "content": prompt}]
            
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
                temperature=0.6,
                max_tokens=300,
            )
            
            content = response.choices[0].message.content.strip()
            
            try:
                skills = json.loads(content)
            except json.JSONDecodeError:
                json_match = re.search(r'\[.*\]', content, re.DOTALL)
                if json_match:
                    skills = json.loads(json_match.group())
                else:
                    skills = []
                    for line in content.split('\n'):
                        line = line.strip()
                        if line and not line.startswith('[') and not line.startswith(']'):
                            skill = line.strip('",\'').strip()
                            if skill:
                                skills.append(skill)
            
            return {"success": True, "skills": skills}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def generate_summary(cv_data: DirectSummaryRequest):
        try:
            skills_text = ", ".join(cv_data.skills[:8]) if cv_data.skills else ""
            
            work_exp = "".join([
                f"{exp.title} at {exp.company} ({exp.duration}). "
                for exp in cv_data.experience
            ]) if cv_data.experience else ""
            
            prompt = f"""Create 1 professional summary (50-80 words) for this person based on their CV data:
            
            Key Skills: {skills_text}
            Work Experience: {work_exp}

            Requirements:
            - Exactly 50-80 words
            - Professional tone
            - Highlight key strengths and achievements
            - Focus on value proposition
            - Write in third person

            Return as a JSON array of strings (each string = one full summary)."""
            
            messages = [
                {"role": "system", "content": "You are a professional CV expert. Generate professional summaries."},
                {"role": "user", "content": prompt}
            ]
            
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
                temperature=0.6,
                max_tokens=600,
            )
            
            content = response.choices[0].message.content.strip()
            
            return {"success": True, "summary": content}
            
        except Exception as e:
            return {"success": False, "error": str(e)}