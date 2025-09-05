from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract, case, desc
from datetime import datetime, timedelta
from typing import Dict, List, Any
from db.scheme import User, Subscription, PaymentHistory

class PaymentManagementController:
    
    @staticmethod
    async def get_payment_management_data(db: AsyncSession) -> Dict[str, Any]:
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

        # Single optimized query for revenue metrics
        revenue_metrics = await db.execute(
            select(
                # Total revenue (all time)
                func.sum(
                    case((PaymentHistory.status == 'captured', PaymentHistory.amount), else_=0)
                ).label('total_revenue'),
                
                # Current month revenue
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
                
                # Previous month revenue
                func.sum(
                    case(
                        (and_(
                            extract('month', PaymentHistory.payment_date) == prev_month,
                            extract('year', PaymentHistory.payment_date) == prev_year,
                            PaymentHistory.status == 'captured'
                        ), PaymentHistory.amount),
                        else_=0
                    )
                ).label('prev_month_revenue'),
                
                # Current month success count
                func.sum(
                    case(
                        (and_(
                            extract('month', PaymentHistory.payment_date) == current_month,
                            extract('year', PaymentHistory.payment_date) == current_year,
                            PaymentHistory.status == 'captured'
                        ), 1),
                        else_=0
                    )
                ).label('current_month_success'),
                
                # Current month total attempts
                func.sum(
                    case(
                        (and_(
                            extract('month', PaymentHistory.payment_date) == current_month,
                            extract('year', PaymentHistory.payment_date) == current_year
                        ), 1),
                        else_=0
                    )
                ).label('current_month_total'),
                
                # Previous month success count
                func.sum(
                    case(
                        (and_(
                            extract('month', PaymentHistory.payment_date) == prev_month,
                            extract('year', PaymentHistory.payment_date) == prev_year,
                            PaymentHistory.status == 'captured'
                        ), 1),
                        else_=0
                    )
                ).label('prev_month_success'),
                
                # Previous month total attempts
                func.sum(
                    case(
                        (and_(
                            extract('month', PaymentHistory.payment_date) == prev_month,
                            extract('year', PaymentHistory.payment_date) == prev_year
                        ), 1),
                        else_=0
                    )
                ).label('prev_month_total')
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

        # Calculate success rate percentages
        current_success_rate = 0
        prev_success_rate = 0
        
        current_month_total = revenue_data.current_month_total or 0
        current_month_success = revenue_data.current_month_success or 0
        prev_month_total = revenue_data.prev_month_total or 0
        prev_month_success = revenue_data.prev_month_success or 0
        
        if current_month_total > 0:
            current_success_rate = round((current_month_success / current_month_total) * 100, 2)
        
        if prev_month_total > 0:
            prev_success_rate = round((prev_month_success / prev_month_total) * 100, 2)
        
        # Success rate change
        success_rate_change = 0
        if prev_success_rate > 0:
            success_rate_change = round(current_success_rate - prev_success_rate, 2)
        elif current_success_rate > 0:
            success_rate_change = current_success_rate

        # Active subscriptions metrics
        subscription_metrics = await db.execute(
            select(
                func.count(Subscription.id).label('total_subscriptions'),
                func.sum(case((Subscription.status == 'active', 1), else_=0)).label('active_subscriptions'),
                func.sum(
                    case(
                        (and_(
                            extract('month', Subscription.created_at) == current_month,
                            extract('year', Subscription.created_at) == current_year,
                            Subscription.status == 'active'
                        ), 1),
                        else_=0
                    )
                ).label('current_month_active'),
                func.sum(
                    case(
                        (and_(
                            extract('month', Subscription.created_at) == prev_month,
                            extract('year', Subscription.created_at) == prev_year,
                            Subscription.status == 'active'
                        ), 1),
                        else_=0
                    )
                ).label('prev_month_active')
            )
        )
        sub_data = subscription_metrics.first()
        
        # Calculate subscription growth
        current_month_active = sub_data.current_month_active or 0
        prev_month_active = sub_data.prev_month_active or 0
        
        subscription_growth = 0
        if prev_month_active > 0:
            subscription_growth = round(((current_month_active - prev_month_active) / prev_month_active) * 100, 2)
        elif current_month_active > 0:
            subscription_growth = 100

        # Payment method distribution
        payment_methods = await db.execute(
            select(
                PaymentHistory.method,
                func.count(PaymentHistory.id).label('count'),
                func.sum(PaymentHistory.amount).label('total_amount')
            )
            .where(PaymentHistory.status == 'captured')
            .group_by(PaymentHistory.method)
        )
        
        method_data = payment_methods.all()
        total_payments = sum(row.count for row in method_data)
        
        payment_method_distribution = []
        for row in method_data:
            percentage = round((row.count / total_payments) * 100, 2) if total_payments > 0 else 0
            payment_method_distribution.append({
                "method": row.method or "unknown",
                "count": row.count,
                "percentage": percentage,
                "total_amount": row.total_amount or 0
            })

        # All payment transactions with user details
        all_transactions = await db.execute(
            select(
                PaymentHistory.razorpay_payment_id,
                PaymentHistory.amount,
                PaymentHistory.status,
                PaymentHistory.method,
                PaymentHistory.payment_date,
                PaymentHistory.created_at,
                User.full_name,
                User.email,
                User.image_url
            )
            .join(User, PaymentHistory.user_id == User.id)
            .order_by(desc(PaymentHistory.created_at))
            .limit(100)  # Limit for performance
        )
        
        transactions = [
            {
                "transaction_id": tx.razorpay_payment_id,
                "user_name": tx.full_name,
                "user_email": tx.email,
                "user_image": tx.image_url,
                "amount": tx.amount,
                "status": tx.status,
                "method": tx.method,
                "purchase_date": tx.payment_date.isoformat() if tx.payment_date else tx.created_at.isoformat()
            }
            for tx in all_transactions.all()
        ]

        # Recent failed payments (last 20)
        failed_payments = await db.execute(
            select(
                PaymentHistory.razorpay_payment_id,
                PaymentHistory.amount,
                PaymentHistory.payment_date,
                PaymentHistory.created_at,
                User.full_name,
                User.email
            )
            .join(User, PaymentHistory.user_id == User.id)
            .where(PaymentHistory.status.in_(['failed', 'error', 'cancelled']))
            .order_by(desc(PaymentHistory.created_at))
            .limit(20)
        )
        
        recent_failed = [
            {
                "transaction_id": payment.razorpay_payment_id,
                "user_name": payment.full_name,
                "user_email": payment.email,
                "amount": payment.amount,
                "date": payment.payment_date.isoformat() if payment.payment_date else payment.created_at.isoformat()
            }
            for payment in failed_payments.all()
        ]

        return {
            "revenue_metrics": {
                "total_revenue": revenue_data.total_revenue or 0,
                "current_month_revenue": current_revenue,
                "revenue_growth_percentage": revenue_growth
            },
            "subscription_metrics": {
                "active_subscriptions": sub_data.active_subscriptions or 0,
                "subscription_growth_percentage": subscription_growth
            },
            "success_rate_metrics": {
                "current_success_rate": current_success_rate,
                "success_rate_change": success_rate_change
            },
            "payment_method_distribution": payment_method_distribution,
            "payment_transactions": transactions,
            "recent_failed_payments": recent_failed
        }
