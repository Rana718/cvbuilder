from typing import Dict
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class DashboardController:
    @staticmethod
    async def get_dashboard_data(firebase_uid: str, db: AsyncSession) -> Dict:
        """Get all dashboard data including stats, resumes, and subscription info in one call"""
        try:
            user_query = await db.execute(
                text("""
                    SELECT u.*, s.plan, s.status as subscription_status, s.current_period_end
                    FROM users u
                    LEFT JOIN subscriptions s ON u.id = s.user_id
                    WHERE u.firebase_uid = :firebase_uid
                """),
                {"firebase_uid": firebase_uid}
            )
            user_data = user_query.fetchone()
            
            if not user_data:
                return {"error": "User not found"}
            
            resumes_query = await db.execute(
                text("""
                    SELECT id, shareable_uuid, name, email, job_title, template_id, 
                           theme_color, created_at, updated_at
                    FROM resumes 
                    WHERE user_id = :user_id
                    ORDER BY updated_at DESC
                """),
                {"user_id": user_data.id}
            )
            resumes = resumes_query.fetchall()
            
            # Get cover letters count
            cover_letters_query = await db.execute(
                text("SELECT COUNT(*) as count FROM cover_letters WHERE user_id = :user_id"),
                {"user_id": user_data.id}
            )
            cover_letters_count = cover_letters_query.fetchone().count
            
            # Calculate statistics
            total_resumes = len(resumes)
            total_views = 0  # Can be calculated if views column exists
            
            # Weekly activity
            week_ago = datetime.now() - timedelta(days=7)
            weekly_resumes = [r for r in resumes if r.updated_at and r.updated_at >= week_ago]
            weekly_progress = min(100, len(weekly_resumes) * 25)
            
            # Completion rate
            completed_resumes = len([r for r in resumes if r.name and r.job_title])
            completion_rate = (completed_resumes / total_resumes * 100) if total_resumes > 0 else 0
            
            # Premium status
            is_premium = user_data.is_premium or False
            subscription_active = (
                user_data.subscription_status == 'active' if hasattr(user_data, 'subscription_status') 
                else False
            )
            premium_features = 12 if (is_premium or subscription_active) else 3
            
            # Recent activity
            recent_activity = []
            for resume in resumes[:5]:
                recent_activity.append({
                    "id": str(resume.id),
                    "type": "resume",
                    "title": resume.name or f"Resume {resume.id}",
                    "action": "Updated" if resume.updated_at != resume.created_at else "Created",
                    "timestamp": resume.updated_at.isoformat() if resume.updated_at else resume.created_at.isoformat(),
                    "status": "completed"
                })
            
            # Format resumes for frontend
            formatted_resumes = []
            for resume in resumes:
                formatted_resumes.append({
                    "id": resume.id,
                    "shareable_uuid": resume.shareable_uuid,
                    "name": resume.name,
                    "email": resume.email,
                    "job_title": resume.job_title,
                    "template_id": resume.template_id,
                    "theme_color": resume.theme_color,
                    "created_at": resume.created_at.isoformat() if resume.created_at else None,
                    "updated_at": resume.updated_at.isoformat() if resume.updated_at else None
                })
            
            return {
                # Dashboard stats
                "totalResumes": total_resumes,
                "totalCoverLetters": cover_letters_count,
                "totalViews": total_views,
                "weeklyProgress": weekly_progress,
                "completionRate": int(completion_rate),
                "premiumFeatures": premium_features,
                "lastActivity": resumes[0].updated_at.isoformat() if resumes else None,
                "recentActivity": recent_activity,
                "isPremium": is_premium or subscription_active,
                
                # All resumes data (replaces separate /api/resume-op/all call)
                "resumes": formatted_resumes,
                
                # User info
                "user": {
                    "id": user_data.id,
                    "email": user_data.email,
                    "full_name": user_data.full_name,
                    "is_premium": is_premium,
                    "subscription_status": getattr(user_data, 'subscription_status', None),
                    "subscription_plan": getattr(user_data, 'plan', None)
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting dashboard data for user {firebase_uid}: {str(e)}")
            return {
                "error": str(e),
                "totalResumes": 0,
                "totalCoverLetters": 0,
                "totalViews": 0,
                "weeklyProgress": 0,
                "completionRate": 0,
                "premiumFeatures": 0,
                "lastActivity": None,
                "recentActivity": [],
                "resumes": [],
                "isPremium": False
            }
