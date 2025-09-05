import json
import re
from datetime import datetime
from typing import Optional
from config.openai import client, DEFAULT_MODEL
from models.cv_models import DirectSummaryRequest, SkillsRequest, WorkExperience

SYSTEM_PROMPT = """
You are an AI Resume Builder assistant. Your ONLY job is to produce resume-ready content.
Follow these CORE RULES exactly:

1) OUTPUT FORMAT: Always output a single valid JSON array of plain strings only. No markdown, no code blocks, no explanations, no extra text.
2) HONESTY & SCOPE: Do NOT invent or exaggerate scope, percentages, or metrics. NEVER output highly specific percentage improvements unless the user explicitly provided those exact numbers.
3) SENIORITY ADAPTATION:
   - FRESHER / NO EXPERIENCE: Focus on coursework, projects, tools used, learning, and relevant soft skills.
   - INTERNS / SHORT TENURE (< 3 months): Emphasize learning, small contributions, collaboration, and exposure to tools; use verbs like "assisted", "contributed", "supported".
   - JUNIOR (3-24 months): Emphasize growth, ownership of small features, collaboration, and modest results.
   - SENIOR (24+ months): Emphasize leadership, ownership, and measurable impact (still avoid unrealistic metrics).
4) LENGTH & STYLE:
   - Work bullets: 10-20 words each.
   - Skills: short phrases (1-3 words or short noun phrases).
   - Summaries: 50-90 words, professional, third-person.
5) BLACKLIST & BAD EXAMPLES:
   - Do NOT output: "reduced backend load by 90%", "handled 70% user load", "single-handedly rewrote entire platform".
6) ALWAYS RETURN a JSON array and nothing else.
"""

class CVGenerator:
    @staticmethod
    def _safe_parse(content: str):
        """Try JSON first; fallback to cleaned lines."""
        if not content:
            return []
        content = content.strip("\ufeff \n\r\t")
        try:
            parsed = json.loads(content)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
        m = re.search(r"(\[.*\])", content, flags=re.S)
        if m:
            try:
                parsed = json.loads(m.group(1))
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                content = m.group(1)
        lines = []
        for line in content.splitlines():
            line = line.strip()
            if not line:
                continue
            line = re.sub(r"^[\-\*\•\d\.\)\s]+", "", line)
            if line:
                lines.append(line)
        if len(lines) == 1 and len(lines[0].split('. ')) > 1:
            parts = [p.strip().rstrip('.') for p in lines[0].split('. ') if p.strip()]
            return parts
        return lines

    @staticmethod
    def _parse_months_simple(start: Optional[str], end: Optional[str]) -> Optional[int]:
        """
        Simple parser: accepts YYYY, YYYY-MM, YYYY-MM-DD and 'Present'.
        Returns months between start and end or None if unparsable.
        """
        def parse_ymd(s: str) -> Optional[datetime]:
            s = (s or "").strip()
            if not s:
                return None
            if s.lower() in ("present", "now", "current"):
                return datetime.now()
            for fmt in ("%Y-%m-%d", "%Y-%m", "%Y"):
                try:
                    return datetime.strptime(s, fmt)
                except Exception:
                    continue
            return None
        s_dt = parse_ymd(start)
        e_dt = parse_ymd(end)
        if not s_dt or not e_dt:
            return None
        months = (e_dt.year - s_dt.year) * 12 + (e_dt.month - s_dt.month)
        return max(0, months)

    @staticmethod
    def _infer_seniority_from_payload(job_title: str, role: str, start_date: str, end_date: str, experience_count: int = 0) -> str:
        """
        Return one of: 'fresher', 'intern', 'junior', 'senior'.
        Uses simple checks on title/role text and the _parse_months_simple result.
        """
        title_role = f"{(job_title or '')} {(role or '')}".lower()
        if "intern" in title_role or "trainee" in title_role:
            return "intern"
        months = CVGenerator._parse_months_simple(start_date, end_date)
        if months is None:
            return "junior" if experience_count >= 2 else "fresher"
        if months < 3:
            return "intern"
        if months < 24:
            return "junior"
        return "senior"

    # ---------------- Work Experience ----------------
    @staticmethod
    async def generate_work_experience(job_title: str, company: str, location: str, role: str, start_date: str, end_date: str, experience_count: int = 0, seniority_override: Optional[str] = None):
        """
        seniority_override: optional string "fresher"|"intern"|"junior"|"senior" to force tone.
        """
        if seniority_override:
            seniority = seniority_override
        else:
            seniority = CVGenerator._infer_seniority_from_payload(job_title, role, start_date, end_date, experience_count)

        if seniority == "fresher":
            bullet_range = "6-10"
            guidance = "Focus on coursework, projects, tools used, and learning outcomes."
        elif seniority == "intern":
            bullet_range = "6-12"
            guidance = "Emphasize contributions, collaboration, and learning; use verbs like 'assisted', 'contributed', 'supported'."
        elif seniority == "junior":
            bullet_range = "9-15"
            guidance = "Highlight ownership of small features, collaboration, and modest measurable outcomes (if provided)."
        else:
            bullet_range = "9-20"
            guidance = "Emphasize impact, ownership, leadership, and measurable outcomes where reasonable."

        prompt = f"""
Generate {bullet_range} realistic resume bullet points for this role.

Job Title: {job_title}
Company: {company}
Location: {location}
Role/Department: {role}
Duration: {start_date} to {end_date}
Inferred seniority: {seniority}

Rules (follow exactly):
- Tone & scope must match inferred seniority: {guidance}
- DO NOT invent large percentages, impossible scope, or single-handed platform ownership for junior/interim roles.
- Bullets: 8-18 words each, factual, concise, action-first.
- If fresher: mention coursework, projects, libraries, and tools rather than claims of product impact.
- Output must be a single valid JSON array of strings and nothing else.
"""

        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.15,
                max_tokens=600,
            )
            content = response.choices[0].message.content.strip()
            points = CVGenerator._safe_parse(content)

            filtered = []
            for p in points:
                if not isinstance(p, str):
                    continue
                orig = p.strip()
                orig = re.sub(r"\b\d{3,}%\b", "", orig)
                orig = re.sub(r"\b100%?\b", "", orig)
                if seniority in ("fresher", "intern"):
                    orig = re.sub(r"\b(owned|spearheaded|led|managed)\b", "contributed to", orig, flags=re.I)
                orig = re.sub(r"\s{2,}", " ", orig).strip(" -•")
                if orig:
                    filtered.append(orig)
            if not filtered:
                if seniority in ("fresher", "intern"):
                    fallback = [
                        "Assisted with small frontend tasks using React and Tailwind.",
                        "Learned team workflows and participated in code reviews.",
                        "Implemented minor bug fixes and wrote basic tests.",
                        "Worked with senior developers to integrate API endpoints."
                    ]
                else:
                    fallback = [
                        "Contributed to feature development and collaborated across teams.",
                        "Improved code quality through tests and code reviews.",
                        "Worked on API integration and frontend components."
                    ]
                return {"success": True, "points": fallback}
            return {"success": True, "points": filtered}

        except Exception as e:
            return {"success": False, "error": str(e)}

    # ---------------- Skills ----------------
    @staticmethod
    async def generate_skills(work_experience: SkillsRequest, seniority_override: Optional[str] = None):
        txt = str(work_experience).lower() if work_experience else ""
        seniority_hint = "intern" if ("intern" in txt or "1 mo" in txt or "1 month" in txt) else (seniority_override or "mixed")
        prompt = f"""
Based on this work experience, produce 5-15 concise, relevant professional skills.

Work Experience: {work_experience}
Seniority hint: {seniority_hint}

Rules:
- Prioritize concrete skills (e.g., "React", "REST APIs", "Unit testing", "SQL").
- For freshers/interns, include tools, frameworks, and learning-focused skills (e.g., "Git", "React basics", "API integration").
- Avoid vague adjectives like 'hardworking' or 'team player' as primary skills.
- Return ONLY a JSON array of strings.
"""
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=250,
            )
            content = response.choices[0].message.content.strip()
            skills = CVGenerator._safe_parse(content)
            skills = [s for s in skills if s and s.lower() not in ("communication", "teamwork", "hardworking")]
            return {"success": True, "skills": skills}
        except Exception as e:
            return {"success": False, "error": str(e)}

    # ---------------- Summary ----------------
    @staticmethod
    async def generate_summary(cv_data: DirectSummaryRequest, seniority_override: Optional[str] = None):
        skills_text = ", ".join(cv_data.skills[:8]) if cv_data.skills else ""
        work_exp_text = " ".join([f"{exp.title} at {exp.company} ({getattr(exp, 'duration', getattr(exp, 'duration', ''))})" for exp in (cv_data.experience or [])])

        if seniority_override:
            overall_seniority = seniority_override
        else:
            if not cv_data.experience:
                overall_seniority = "fresher"
            elif any("intern" in (exp.title or "").lower() or "intern" in (exp.company or "").lower() for exp in cv_data.experience):
                overall_seniority = "intern"
            else:
                total_months = 0
                count = 0
                for exp in cv_data.experience:
                    months = CVGenerator._parse_months_simple(getattr(exp, "start_date", None), getattr(exp, "end_date", None))
                    if months is not None:
                        total_months += months
                        count += 1
                avg = (total_months / count) if count else 0
                overall_seniority = "senior" if avg >= 24 else ("junior" if avg >= 3 else "intern")

        prompt = f"""
Create 2-4 professional summary variations (50-90 words each).

Skills: {skills_text}
Work Experience: {work_exp_text}
Overall seniority: {overall_seniority}

Rules:
- Third person, professional tone.
- If overall_seniority is 'fresher' or 'intern', emphasize learning, coursework, projects, and eagerness to grow.
- Avoid fabricating major product impact or large % improvements for junior/fresher candidates.
- Each summary must be distinct and realistic.
- Return ONLY a JSON array of strings.
"""
        try:
            response = client.chat.completions.create(
                model=DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=500,
            )
            content = response.choices[0].message.content.strip()
            summaries = CVGenerator._safe_parse(content)
            summaries = [s.strip() for s in summaries if isinstance(s, str)]
            return {"success": True, "summary": summaries[:4]}
        except Exception as e:
            return {"success": False, "error": str(e)}
