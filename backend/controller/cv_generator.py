import json
from config.openai import client, DEFAULT_MODEL
from models.cv_models import DirectSummaryRequest, SkillsRequest, WorkExperience

SYSTEM_PROMPT = """You are an AI Resume Builder.
Rules:
- Always return a valid JSON array of plain strings.
- No markdown, no code blocks, no explanations.
- Each item must follow the requested format (bullet, skill, or summary).
"""

class CVGenerator:
    
    @staticmethod
    def _safe_parse(content: str):
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return [content.strip()] if content else []

    @staticmethod
    async def generate_work_experience(job_title: str, company: str, location: str, role: str, start_date: str, end_date: str):
        prompt = f"""
        Generate 10-20 specific work experience bullet points for:

        Job Title: {job_title}
        Company: {company}
        Location: {location}
        Role/Department: {role}
        Duration: {start_date} to {end_date}

        Requirements:
        - Each bullet must be 10–20 words
        - Use strong action verbs
        - Include metrics/achievements where possible
        - Role-specific & industry-relevant
        - Return ONLY a JSON array of strings
        """

        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_completion_tokens=800,
            )

            content = response.choices[0].message.content.strip()
            points = CVGenerator._safe_parse(content)
            return {"success": True, "points": points}

        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    async def generate_skills(work_experience: SkillsRequest):
        prompt = f"""
        Based on the following work experience, generate 5-20 highly relevant professional skills.

        Work Experience: {work_experience}

        Requirements:
        - DIRECTLY relevant to these roles and industries
        - Mix of technical and soft skills
        - Appropriate for seniority level
        - Avoid generic filler skills
        - Return ONLY a JSON array of strings
        """

        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=300,
            )

            content = response.choices[0].message.content.strip()
            skills = CVGenerator._safe_parse(content)
            return {"success": True, "skills": skills}

        except Exception as e:
            return {"success": False, "error": str(e)}

    @staticmethod
    async def generate_summary(cv_data: DirectSummaryRequest):
        skills_text = ", ".join(cv_data.skills[:8]) if cv_data.skills else ""
        work_exp = " ".join([
            f"{exp.title} at {exp.company} ({exp.duration})"
            for exp in cv_data.experience
        ]) if cv_data.experience else ""

        prompt = f"""
        Create 2–5 professional summary variations (50–80 words each).

        Skills: {skills_text}
        Work Experience: {work_exp}

        Requirements:
        - Third person
        - Professional tone
        - Highlight strengths, achievements, and value
        - Each summary must be distinct
        - Return ONLY a JSON array of strings
        """

        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=600,
            )

            content = response.choices[0].message.content.strip()
            summaries = CVGenerator._safe_parse(content)

            # Ensure list of strings & limit to 5
            summaries = [s.strip() for s in summaries if isinstance(s, str)]
            return {"success": True, "summary": summaries[:5]}

        except Exception as e:
            return {"success": False, "error": str(e)}
