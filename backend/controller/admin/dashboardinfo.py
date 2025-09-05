from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract, case
from datetime import datetime, timedelta
from typing import Dict, List, Any
from db.scheme import User, Resume, Subscription, PaymentHistory

class AdminDashboardController:
    
    @staticmethod
    async def get_dashboard_info(db: AsyncSession) -> Dict[str, Any]:
        now = datetime.utcnow()
        current_month = now.month
        current_year = now.year
        
        # Get previous month
        if current_month == 1:
            prev_month = 12
            prev_year = current_year - 1
        else:
            prev_month = current_month - 1
            prev_year = current_year

        # Single query for user metrics
        user_metrics = await db.execute(
            select(
                func.count(User.id).label('total_users'),
                func.sum(
                    case(
                        (and_(
                            extract('month', User.created_at) == current_month,
                            extract('year', User.created_at) == current_year
                        ), 1),
                        else_=0
                    )
                ).label('current_month_users'),
                func.sum(
                    case(
                        (and_(
                            extract('month', User.created_at) == prev_month,
                            extract('year', User.created_at) == prev_year
                        ), 1),
                        else_=0
                    )
                ).label('prev_month_users')
            )
        )
        user_data = user_metrics.first()
        
        # Calculate user growth percentage
        user_growth = 0
        current_month_users = user_data.current_month_users or 0
        prev_month_users = user_data.prev_month_users or 0
        
        if prev_month_users > 0:
            user_growth = round(((current_month_users - prev_month_users) / prev_month_users) * 100, 2)
        elif current_month_users > 0:
            user_growth = 100

        # Single query for subscription metrics
        subscription_metrics = await db.execute(
            select(
                func.count(Subscription.id).label('total_subscriptions'),
                func.sum(case((Subscription.status == 'active', 1), else_=0)).label('active_subscriptions')
            )
        )
        sub_data = subscription_metrics.first()

        # Single query for resume metrics
        resume_metrics = await db.execute(
            select(
                func.count(Resume.id).label('total_resumes'),
                func.sum(
                    case(
                        (and_(
                            extract('month', Resume.created_at) == current_month,
                            extract('year', Resume.created_at) == current_year
                        ), 1),
                        else_=0
                    )
                ).label('current_month_resumes'),
                func.sum(
                    case(
                        (and_(
                            extract('month', Resume.created_at) == prev_month,
                            extract('year', Resume.created_at) == prev_year
                        ), 1),
                        else_=0
                    )
                ).label('prev_month_resumes')
            )
        )
        resume_data = resume_metrics.first()
        
        # Calculate resume growth percentage
        resume_growth = 0
        current_month_resumes = resume_data.current_month_resumes or 0
        prev_month_resumes = resume_data.prev_month_resumes or 0
        
        if prev_month_resumes > 0:
            resume_growth = round(((current_month_resumes - prev_month_resumes) / prev_month_resumes) * 100, 2)
        elif current_month_resumes > 0:
            resume_growth = 100

        # Single query for revenue metrics
        revenue_metrics = await db.execute(
            select(
                func.sum(
                    case(
                        (and_(
                            extract('month', PaymentHistory.payment_date) == current_month,
                            extract('year', PaymentHistory.payment_date) == current_year,
                            PaymentHistory.status == 'captured'
                        ), PaymentHistory.amount),
                        else_=0
                    )
                ).label('current_month_revenue'),
                func.sum(
                    case(
                        (and_(
                            extract('month', PaymentHistory.payment_date) == prev_month,
                            extract('year', PaymentHistory.payment_date) == prev_year,
                            PaymentHistory.status == 'captured'
                        ), PaymentHistory.amount),
                        else_=0
                    )
                ).label('prev_month_revenue')
            )
        )
        revenue_data = revenue_metrics.first()
        
        # Calculate revenue growth percentage
        current_revenue = revenue_data.current_month_revenue or 0
        prev_revenue = revenue_data.prev_month_revenue or 0
        revenue_growth = 0
        if prev_revenue > 0:
            revenue_growth = round(((current_revenue - prev_revenue) / prev_revenue) * 100, 2)
        elif current_revenue > 0:
            revenue_growth = 100

        # Recent 5 users
        recent_users_query = await db.execute(
            select(User.full_name, User.email, User.image_url, User.created_at, User.is_premium)
            .order_by(User.created_at.desc())
            .limit(5)
        )
        recent_users = [
            {
                "name": user.full_name,
                "email": user.email,
                "image_url": user.image_url,
                "registered_date": user.created_at.isoformat(),
                "is_premium": bool(user.is_premium) if user.is_premium is not None else False
            }
            for user in recent_users_query.all()
        ]

        # Recent 5 payments with user info
        recent_payments_query = await db.execute(
            select(
                PaymentHistory.razorpay_payment_id,
                PaymentHistory.amount,
                PaymentHistory.status,
                PaymentHistory.payment_date,
                User.full_name,
                User.email
            )
            .join(User, PaymentHistory.user_id == User.id)
            .order_by(PaymentHistory.created_at.desc())
            .limit(5)
        )
        recent_payments = [
            {
                "payment_id": payment.razorpay_payment_id,
                "user_name": payment.full_name,
                "user_email": payment.email,
                "amount": payment.amount,
                "status": payment.status,
                "payment_date": payment.payment_date.isoformat() if payment.payment_date else None
            }
            for payment in recent_payments_query.all()
        ]

        return {
            "total_users": user_data.total_users or 0,
            "user_growth_percentage": user_growth,
            "total_active_subscriptions": sub_data.active_subscriptions or 0,
            "total_resumes": resume_data.total_resumes or 0,
            "resume_growth_percentage": resume_growth,
            "current_month_revenue": current_revenue,
            "revenue_growth_percentage": revenue_growth,
            "recent_users": recent_users,
            "recent_payments": recent_payments
        }
