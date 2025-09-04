from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from controller.admin_controller import AdminController
from models.admin_models import AdminStatsResponse, UserAdminResponse, ActivityLogResponse, SubscriptionAnalyticsResponse
from typing import List

router = APIRouter()

# Simple admin auth check (you should implement proper admin role checking)
async def verify_admin(request: Request):
    # Add your admin verification logic here
    # For now, just check if user exists
    if not hasattr(request.state, 'user_id'):
        raise HTTPException(status_code=401, detail="Admin access required")
    return True

@router.get("/stats", response_model=AdminStatsResponse)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    return await AdminController.get_dashboard_stats(db)

@router.get("/users", response_model=List[UserAdminResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    return await AdminController.get_all_users(db, skip, limit)

@router.get("/activities", response_model=List[ActivityLogResponse])
async def get_recent_activities(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    return await AdminController.get_recent_activities(db, limit)

@router.get("/subscriptions/analytics", response_model=SubscriptionAnalyticsResponse)
async def get_subscription_analytics(
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_admin)
):
    return await AdminController.get_subscription_analytics(db)
