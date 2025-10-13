from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, update
from db.db import get_db
from db.scheme import User, Subscription, Plan
from middleware.auth import get_current_user
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/download-status")
async def get_download_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's download status and remaining downloads"""
    try:
        # Get user's active subscription
        result = await db.execute(
            select(Subscription, Plan)
            .join(Plan, Subscription.plan_id == Plan.id)
            .where(
                Subscription.user_id == current_user.id,
                Subscription.status == "active"
            )
            .order_by(desc(Subscription.created_at))
        )
        subscription_data = result.first()
        
        if not subscription_data:
            return {
                "can_download": False,
                "downloads_used": 0,
                "download_limit": 0,
                "remaining_downloads": 0,
                "plan_expired": True,
                "message": "No active subscription"
            }
        
        subscription, plan = subscription_data
        
        # Check if subscription is expired
        if subscription.current_period_end and subscription.current_period_end < datetime.utcnow():
            return {
                "can_download": False,
                "downloads_used": subscription.downloads_used,
                "download_limit": plan.download_limit,
                "remaining_downloads": 0,
                "plan_expired": True,
                "message": "Subscription expired"
            }
        
        # Check download limits
        if plan.download_limit is None:  # Unlimited
            return {
                "can_download": True,
                "downloads_used": subscription.downloads_used,
                "download_limit": None,
                "remaining_downloads": None,
                "plan_expired": False,
                "message": "Unlimited downloads"
            }
        
        remaining = plan.download_limit - subscription.downloads_used
        can_download = remaining > 0
        
        return {
            "can_download": can_download,
            "downloads_used": subscription.downloads_used,
            "download_limit": plan.download_limit,
            "remaining_downloads": remaining,
            "plan_expired": False,
            "message": f"{remaining} downloads remaining" if can_download else "Download limit reached"
        }
        
    except Exception as e:
        logger.error(f"Error getting download status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get download status")

@router.post("/track-download")
async def track_download(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Track a download and update usage count"""
    try:
        # Get user's active subscription
        result = await db.execute(
            select(Subscription, Plan)
            .join(Plan, Subscription.plan_id == Plan.id)
            .where(
                Subscription.user_id == current_user.id,
                Subscription.status == "active"
            )
            .order_by(desc(Subscription.created_at))
        )
        subscription_data = result.first()
        
        if not subscription_data:
            raise HTTPException(status_code=403, detail="No active subscription")
        
        subscription, plan = subscription_data
        
        # Check if subscription is expired
        if subscription.current_period_end and subscription.current_period_end < datetime.utcnow():
            raise HTTPException(status_code=403, detail="Subscription expired")
        
        # Check download limits
        if plan.download_limit is not None:
            if subscription.downloads_used >= plan.download_limit:
                raise HTTPException(status_code=403, detail="Download limit reached")
        
        # Increment download count
        await db.execute(
            update(Subscription)
            .where(Subscription.id == subscription.id)
            .values(downloads_used=subscription.downloads_used + 1)
        )
        
        # Check if plan should expire after this download
        new_downloads_used = subscription.downloads_used + 1
        plan_expired = False
        
        if plan.download_limit is not None and new_downloads_used >= plan.download_limit:
            # Mark subscription as expired if download limit reached
            await db.execute(
                update(Subscription)
                .where(Subscription.id == subscription.id)
                .values(status="expired")
            )
            # Update user premium status
            current_user.is_premium = False
            plan_expired = True
        
        await db.commit()
        
        remaining = None if plan.download_limit is None else plan.download_limit - new_downloads_used
        
        return {
            "success": True,
            "downloads_used": new_downloads_used,
            "download_limit": plan.download_limit,
            "remaining_downloads": remaining,
            "plan_expired": plan_expired,
            "message": "Download tracked successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error tracking download: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to track download")
