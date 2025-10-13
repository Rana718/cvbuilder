from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from db.scheme import User, Subscription, Plan
import logging

logger = logging.getLogger(__name__)

async def verify_and_update_subscription_status(user: User, db: AsyncSession) -> dict:
    """
    Verify user's subscription status and update if expired.
    Returns subscription info with actual status.
    """
    try:
        result = await db.execute(
            select(Subscription, Plan)
            .join(Plan, Subscription.plan_id == Plan.id, isouter=True)
            .where(Subscription.user_id == user.id)
            .order_by(Subscription.created_at.desc())
        )
        subscription_data = result.first()
        
        if not subscription_data:
            if user.is_premium:
                user.is_premium = False
                await db.commit()
            
            return {
                "has_subscription": False,
                "is_premium": False,
                "is_active": False,
                "is_expired": True,
                "plan_name": "Free",
                "plan_slug": "free",
                "downloads_used": 0,
                "download_limit": 0,
                "can_download": False
            }
        
        subscription, plan = subscription_data
        
        is_expired = False
        if subscription.current_period_end:
            is_expired = subscription.current_period_end < datetime.utcnow()
        
        if is_expired and subscription.status == "active":
            subscription.status = "expired"
            user.is_premium = False
            await db.commit()
            logger.info(f"Expired subscription for user {user.id}")
        
        should_be_premium = subscription.status == "active" and not is_expired
        if user.is_premium != should_be_premium:
            user.is_premium = should_be_premium
            await db.commit()
            
            try:
                from config.firebase import set_custom_user_claims
                if user.firebase_uid:
                    set_custom_user_claims(user.firebase_uid, {
                        "premium": "true" if should_be_premium else "false",
                        "dbUser": "true"
                    })
                    logger.info(f"Updated Firebase claims for user {user.id}")
            except Exception as e:
                logger.warning(f"Failed to update Firebase claims: {str(e)}")
        
        download_limit = plan.download_limit if plan else 0
        downloads_used = subscription.downloads_used or 0
        
        can_download = False
        if subscription.status == "active" and not is_expired:
            if download_limit is None:  # Unlimited
                can_download = True
            elif downloads_used < download_limit:
                can_download = True
        
        return {
            "has_subscription": True,
            "is_premium": should_be_premium,
            "is_active": subscription.status == "active" and not is_expired,
            "is_expired": is_expired,
            "plan_name": plan.name if plan else "Unknown",
            "plan_slug": plan.slug if plan else "unknown",
            "plan_id": plan.id if plan else None,
            "downloads_used": downloads_used,
            "download_limit": download_limit,
            "can_download": can_download,
            "remaining_downloads": (download_limit - downloads_used) if download_limit is not None else None,
            "current_period_end": subscription.current_period_end.isoformat() if subscription.current_period_end else None,
            "subscription_status": subscription.status
        }
        
    except Exception as e:
        logger.error(f"Error verifying subscription for user {user.id}: {str(e)}")
        if user.is_premium:
            user.is_premium = False
            await db.commit()
        
        return {
            "has_subscription": False,
            "is_premium": False,
            "is_active": False,
            "is_expired": True,
            "plan_name": "Free",
            "plan_slug": "free",
            "downloads_used": 0,
            "download_limit": 0,
            "can_download": False,
            "error": str(e)
        }


async def check_download_permission(user: User, db: AsyncSession) -> dict:
    """
    Check if user has permission to download and return detailed status.
    """
    subscription_info = await verify_and_update_subscription_status(user, db)
    
    if not subscription_info["can_download"]:
        if subscription_info["is_expired"]:
            return {
                "allowed": False,
                "reason": "subscription_expired",
                "message": "Your subscription has expired. Please renew to continue downloading."
            }
        elif subscription_info["download_limit"] is not None and subscription_info["downloads_used"] >= subscription_info["download_limit"]:
            return {
                "allowed": False,
                "reason": "download_limit_reached",
                "message": f"You have reached your download limit of {subscription_info['download_limit']}. Please upgrade your plan."
            }
        else:
            return {
                "allowed": False,
                "reason": "no_active_subscription",
                "message": "You need an active subscription to download. Please subscribe to a plan."
            }
    
    return {
        "allowed": True,
        "downloads_used": subscription_info["downloads_used"],
        "download_limit": subscription_info["download_limit"],
        "remaining_downloads": subscription_info["remaining_downloads"]
    }


async def increment_download_count(user: User, db: AsyncSession) -> dict:
    """
    Increment download count and check if subscription should be expired.
    Returns updated download info.
    """
    try:
        result = await db.execute(
            select(Subscription, Plan)
            .join(Plan, Subscription.plan_id == Plan.id, isouter=True)
            .where(
                Subscription.user_id == user.id,
                Subscription.status == "active"
            )
            .order_by(Subscription.created_at.desc())
        )
        subscription_data = result.first()
        
        if not subscription_data:
            return {
                "success": False,
                "error": "No active subscription found"
            }
        
        subscription, plan = subscription_data
        
        if subscription.current_period_end and subscription.current_period_end < datetime.utcnow():
            subscription.status = "expired"
            user.is_premium = False
            await db.commit()
            return {
                "success": False,
                "error": "Subscription has expired"
            }
        
        if plan and plan.download_limit is not None:
            if subscription.downloads_used >= plan.download_limit:
                return {
                    "success": False,
                    "error": "Download limit reached"
                }
        
        new_downloads_used = (subscription.downloads_used or 0) + 1
        subscription.downloads_used = new_downloads_used
        
        plan_expired = False
        if plan and plan.download_limit is not None and new_downloads_used >= plan.download_limit:
            subscription.status = "expired"
            user.is_premium = False
            plan_expired = True
            logger.info(f"Subscription expired for user {user.id} - download limit reached")
        
        await db.commit()
        
        remaining = None
        if plan and plan.download_limit is not None:
            remaining = plan.download_limit - new_downloads_used
        
        return {
            "success": True,
            "downloads_used": new_downloads_used,
            "download_limit": plan.download_limit if plan else None,
            "remaining_downloads": remaining,
            "plan_expired": plan_expired
        }
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error incrementing download count for user {user.id}: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
