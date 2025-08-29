import json
import re
from config.openai import client, DEFAULT_MODEL
from utils.context_manager import context_manager
from models.cv_models import CVData

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
    def generate_work_experience(document_id: int, job_title: str, company: str, location: str, role: str, start_date: str, end_date: str, cv_context: str = ""):
        context_prompt = f"\nCV Context: {cv_context}" if cv_context else ""
        
        prompt = f"""Generate 20 specific work experience bullet points for:

        Job Title: {job_title}
        Company: {company}
        Location: {location}
        Role/Department: {role}
        Duration: {start_date} to {end_date}{context_prompt}

        Make bullet points specifically relevant to "{job_title}" at "{company}".

        Requirements:
        - 10-20 words each
        - Strong action verbs (Led, Developed, Implemented, Managed)
        - Specific achievements with metrics
        - Role-specific responsibilities
        - Industry context consideration

        Return as JSON array of strings."""
        
        try:
            messages = context_manager.get_openai_messages(document_id)
            messages.append({"role": "user", "content": prompt})
            
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            points = CVGenerator._parse_json_response(content)
            
            work_summary = f"Generated work experience for {job_title} at {company} in {role} department"
            context_manager.add_message(document_id, "user", 
                f"Generate work experience for: {job_title} at {company}, {location}. Role: {role}. Duration: {start_date} to {end_date}")
            context_manager.add_message(document_id, "assistant", work_summary)
            
            return {"success": True, "points": points}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    async def generate_skills(document_id: int):
        try:
            context_messages = context_manager.get_openai_messages(document_id)
            
            if not context_messages:
                prompt = """Generate 15 relevant professional skills for a general professional CV.
                Include both technical and soft skills.
                Return as a JSON array of strings.

                Example format: ["Communication", "Project Management", "Data Analysis", "Leadership", "Problem Solving"]"""
                
                messages = [
                    {"role": "system", "content": "You are a professional CV expert. Generate relevant skills."},
                    {"role": "user", "content": prompt}
                ]
            else:
                prompt = """Based on our previous conversation about work experience, generate 15-20 highly relevant professional skills.

                Analyze the job titles, companies, and responsibilities mentioned and generate skills that are:
                - DIRECTLY relevant to those specific roles and industries
                - Both technical and soft skills matching the experience level
                - Specific to the career path discussed, not generic
                - Appropriate for the industry and seniority level

                Return as JSON array of strings."""
                
                messages = [
                    {"role": "system", "content": "You are a professional CV expert. Based on the work experience context, generate highly relevant and specific skills."}
                ] + context_messages + [{"role": "user", "content": prompt}]
            
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
                temperature=0.7
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
            
            context_manager.add_message(document_id, "user", "Generate relevant skills based on work experience context")
            skills_summary = f"Generated {len(skills)} skills relevant to the professional background"
            context_manager.add_message(document_id, "assistant", skills_summary)
            
            return {"success": True, "skills": skills}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    @staticmethod
    def generate_summary(document_id: int, cv_data: CVData):
        try:
            skills_text = ", ".join(cv_data.skills[:8]) if cv_data.skills else ""
            
            work_exp = "".join([
                f"{exp.title} at {exp.company} ({exp.start_date} to {exp.end_date}). "
                for exp in cv_data.experience
            ]) if cv_data.experience else ""
            
            education = "".join([
                f"{edu.degree} from {edu.institution}. "
                for edu in cv_data.education
            ]) if cv_data.education else ""
            
            context_messages = context_manager.get_openai_messages(document_id)
            
            prompt = f"""Create 3 different professional summaries (50-80 words each) for this person based on their CV data and our previous conversation:

            Name: {cv_data.name}
            Current Role: {cv_data.job_title or ""}
            Key Skills: {skills_text}
            Work Experience: {work_exp}
            Education: {education}

            Requirements for each summary:
            - Exactly 50-80 words
            - Professional tone
            - Highlight key strengths and achievements
            - Focus on value proposition
            - Write in third person
            - Consider previous conversation context for personalization

            Return as a JSON array of strings (each string = one full summary)."""
            
            messages = context_messages + [{"role": "user", "content": prompt}]
            
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=messages,
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            
            try:
                summaries = json.loads(content)
            except json.JSONDecodeError:
                summaries = [s.strip("-• ") for s in content.split("\n") if len(s.strip()) > 20]
            
            context_manager.add_message(document_id, "user", prompt)
            context_manager.add_message(document_id, "assistant", f"Generated {len(summaries)} professional summaries")
            
            return {"success": True, "summaries": summaries}
            
        except Exception as e:
            return {"success": False, "error": str(e)}
