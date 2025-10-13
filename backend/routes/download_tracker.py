from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from db.scheme import User
from middleware.auth import get_current_user
from utils.subscription_utils import (
    verify_and_update_subscription_status,
    check_download_permission,
    increment_download_count
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/download-status")
async def get_download_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's download status and remaining downloads with automatic expiration check"""
    try:
        subscription_info = await verify_and_update_subscription_status(current_user, db)
        
        return {
            "can_download": subscription_info["can_download"],
            "downloads_used": subscription_info["downloads_used"],
            "download_limit": subscription_info["download_limit"],
            "remaining_downloads": subscription_info["remaining_downloads"],
            "plan_expired": subscription_info["is_expired"],
            "is_active": subscription_info["is_active"],
            "is_premium": subscription_info["is_premium"],
            "plan_name": subscription_info["plan_name"],
            "plan_slug": subscription_info["plan_slug"],
            "current_period_end": subscription_info.get("current_period_end"),
            "message": _get_status_message(subscription_info)
        }
        
    except Exception as e:
        logger.error(f"Error getting download status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get download status")

@router.post("/track-download")
async def track_download(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Track a download and update usage count with automatic limit enforcement"""
    try:
        # Check if user has permission to download
        permission = await check_download_permission(current_user, db)
        
        if not permission["allowed"]:
            raise HTTPException(
                status_code=403, 
                detail=permission["message"]
            )
        
        # Increment download count
        result = await increment_download_count(current_user, db)
        
        if not result["success"]:
            raise HTTPException(status_code=403, detail=result["error"])
        
        return {
            "success": True,
            "downloads_used": result["downloads_used"],
            "download_limit": result["download_limit"],
            "remaining_downloads": result["remaining_downloads"],
            "plan_expired": result["plan_expired"],
            "message": "Download tracked successfully" if not result["plan_expired"] else "Download limit reached - subscription expired"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error tracking download: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to track download")

def _get_status_message(subscription_info: dict) -> str:
    """Generate appropriate status message based on subscription info"""
    if subscription_info["is_expired"]:
        return "Subscription expired - Please renew to continue"
    
    if not subscription_info["is_active"]:
        return "No active subscription"
    
    if subscription_info["download_limit"] is None:
        return "Unlimited downloads available"
    
    remaining = subscription_info["remaining_downloads"]
    if remaining and remaining > 0:
        return f"{remaining} download{'s' if remaining != 1 else ''} remaining"
    else:
        return "Download limit reached"
