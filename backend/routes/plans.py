from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.db import get_db
from db.scheme import Plan
from models.plan_models import PlanResponse
from middleware.rediscache import redis_cache
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/plans", response_model=list[PlanResponse])
@redis_cache.cache_get(expire_minutes=1440)  # 24 hours cache
async def get_plans(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get all active plans (cached for 24 hours)"""
    try:
        result = await db.execute(
            select(Plan)
            .where(Plan.is_active == True)
            .order_by(Plan.sort_order, Plan.id)
        )
        plans = result.scalars().all()
        
        return [
            {
                "id": plan.id,
                "name": plan.name,
                "slug": plan.slug,
                "price": plan.price,
                "currency": plan.currency,
                "interval": plan.interval,
                "features": plan.features,
                "is_popular": plan.is_popular,
                "sort_order": plan.sort_order
            }
            for plan in plans
        ]
        
    except Exception as e:
        logger.error(f"Error getting plans: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get plans")

@router.get("/plans/{plan_id}", response_model=PlanResponse)
@redis_cache.cache_get(expire_minutes=1440)  # 24 hours cache
async def get_plan(
    request: Request,
    plan_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """Get single plan by ID (cached for 24 hours)"""
    try:
        result = await db.execute(select(Plan).where(Plan.id == plan_id))
        plan = result.scalar_one_or_none()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return {
            "id": plan.id,
            "name": plan.name,
            "slug": plan.slug,
            "price": plan.price,
            "currency": plan.currency,
            "interval": plan.interval,
            "features": plan.features,
            "is_popular": plan.is_popular,
            "sort_order": plan.sort_order
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting plan {plan_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get plan")
