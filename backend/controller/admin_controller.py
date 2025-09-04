from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc
from db.scheme import User, Resume, CoverLetter, Subscription, ActivityLog
from models.admin_models import AdminStatsResponse, UserAdminResponse, ActivityLogResponse, SubscriptionAnalyticsResponse
from datetime import datetime, timedelta
from typing import List, Optional

class AdminController:
    
    @staticmethod
    async def get_dashboard_stats(db: AsyncSession) -> AdminStatsResponse:
        # Total users
        total_users_result = await db.execute(select(func.count(User.id)))
        total_users = total_users_result.scalar()
        
        # Premium users
        premium_users_result = await db.execute(select(func.count(User.id)).where(User.is_premium == True))
        premium_users = premium_users_result.scalar()
        
        # Total resumes
        total_resumes_result = await db.execute(select(func.count(Resume.id)))
        total_resumes = total_resumes_result.scalar()
        
        # Total cover letters
        total_cover_letters_result = await db.execute(select(func.count(CoverLetter.id)))
        total_cover_letters = total_cover_letters_result.scalar()
        
        # Monthly revenue (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        monthly_revenue_result = await db.execute(
            select(func.count(Subscription.id) * 99).where(
                and_(
                    Subscription.status == "active",
                    Subscription.created_at >= thirty_days_ago
                )
            )
        )
        monthly_revenue = monthly_revenue_result.scalar() or 0
        
        # User growth rate (last 30 days vs previous 30 days)
        sixty_days_ago = datetime.utcnow() - timedelta(days=60)
        last_month_users = await db.execute(
            select(func.count(User.id)).where(User.created_at >= thirty_days_ago)
        )
        prev_month_users = await db.execute(
            select(func.count(User.id)).where(
                and_(User.created_at >= sixty_days_ago, User.created_at < thirty_days_ago)
            )
        )
        
        last_month_count = last_month_users.scalar() or 0
        prev_month_count = prev_month_users.scalar() or 1
        user_growth_rate = ((last_month_count - prev_month_count) / prev_month_count) * 100
        
        # Premium conversion rate
        premium_conversion_rate = (premium_users / total_users * 100) if total_users > 0 else 0
        
        return AdminStatsResponse(
            total_users=total_users,
            premium_users=premium_users,
            total_resumes=total_resumes,
            total_cover_letters=total_cover_letters,
            monthly_revenue=monthly_revenue,
            user_growth_rate=user_growth_rate,
            premium_conversion_rate=premium_conversion_rate
        )
    
    @staticmethod
    async def get_all_users(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[UserAdminResponse]:
        query = select(
            User,
            func.count(Resume.id).label('resumes_count'),
            func.count(CoverLetter.id).label('cover_letters_count'),
            func.coalesce(func.sum(99), 0).label('total_spent')
        ).outerjoin(Resume).outerjoin(CoverLetter).outerjoin(Subscription).group_by(User.id).offset(skip).limit(limit)
        
        result = await db.execute(query)
        users_data = result.all()
        
        users = []
        for user_data in users_data:
            user = user_data[0]
            users.append(UserAdminResponse(
                id=user.id,
                name=user.full_name,
                email=user.email,
                status="Active" if user.last_login and user.last_login > datetime.utcnow() - timedelta(days=30) else "Inactive",
                subscription="Premium" if user.is_premium else "Free",
                resumes_count=user_data[1] or 0,
                cover_letters_count=user_data[2] or 0,
                join_date=user.created_at,
                last_login=user.last_login,
                total_spent=user_data[3] or 0,
                is_premium=user.is_premium,
                firebase_uid=user.firebase_uid
            ))
        
        return users
    
    @staticmethod
    async def get_recent_activities(db: AsyncSession, limit: int = 50) -> List[ActivityLogResponse]:
        query = select(ActivityLog, User.full_name).join(User).order_by(desc(ActivityLog.created_at)).limit(limit)
        result = await db.execute(query)
        activities_data = result.all()
        
        activities = []
        for activity_data in activities_data:
            activity = activity_data[0]
            user_name = activity_data[1]
            activities.append(ActivityLogResponse(
                id=activity.id,
                user_name=user_name,
                action=activity.action,
                timestamp=activity.created_at,
                details=activity.details
            ))
        
        return activities
    
    @staticmethod
    async def get_subscription_analytics(db: AsyncSession) -> SubscriptionAnalyticsResponse:
        # Total subscriptions
        total_subs_result = await db.execute(select(func.count(Subscription.id)))
        total_subscriptions = total_subs_result.scalar()
        
        # Active subscriptions
        active_subs_result = await db.execute(
            select(func.count(Subscription.id)).where(Subscription.status == "active")
        )
        active_subscriptions = active_subs_result.scalar()
        
        # Monthly revenue
        monthly_revenue = active_subscriptions * 99
        
        # Average revenue per user
        total_users_result = await db.execute(select(func.count(User.id)))
        total_users = total_users_result.scalar()
        avg_revenue_per_user = monthly_revenue / total_users if total_users > 0 else 0
        
        # Churn rate (cancelled subscriptions in last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        cancelled_subs_result = await db.execute(
            select(func.count(Subscription.id)).where(
                and_(
                    Subscription.status == "cancelled",
                    Subscription.updated_at >= thirty_days_ago
                )
            )
        )
        cancelled_subscriptions = cancelled_subs_result.scalar()
        churn_rate = (cancelled_subscriptions / active_subscriptions * 100) if active_subscriptions > 0 else 0
        
        return SubscriptionAnalyticsResponse(
            total_subscriptions=total_subscriptions,
            active_subscriptions=active_subscriptions,
            monthly_revenue=monthly_revenue,
            avg_revenue_per_user=avg_revenue_per_user,
            churn_rate=churn_rate
        )
    
    @staticmethod
    async def log_activity(db: AsyncSession, user_id: int, action: str, details: str = None, ip_address: str = None, user_agent: str = None):
        activity = ActivityLog(
            user_id=user_id,
            action=action,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(activity)
        await db.commit()
    
    @staticmethod
    async def update_user_last_login(db: AsyncSession, user_id: int):
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user:
            user.last_login = datetime.utcnow()
            await db.commit()
