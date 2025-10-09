from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from db.db import get_db
from db.scheme import Plan, User
from models.plan_models import PlanCreate, PlanUpdate, PlanResponse
from middleware.admin_auth import require_super_admin
from middleware.rediscache import redis_cache
import logging

logger = logging.getLogger(__name__)
planRouter = APIRouter()

@planRouter.get("/", response_model=list[PlanResponse])
async def get_all_plans(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_super_admin)
):
    """Get all plans including inactive (Super Admin only)"""
    try:
        result = await db.execute(
            select(Plan).order_by(Plan.sort_order, Plan.id)
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
                "is_active": plan.is_active,
                "is_popular": plan.is_popular,
                "sort_order": plan.sort_order
            }
            for plan in plans
        ]
        
    except Exception as e:
        logger.error(f"Error getting all plans: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get plans")

@planRouter.post("/", response_model=PlanResponse)
async def create_plan(
    plan_data: PlanCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_super_admin)
):
    """Create new plan (Super Admin only)"""
    try:
        plan = Plan(
            name=plan_data.name,
            slug=plan_data.slug,
            price=plan_data.price,
            currency=plan_data.currency,
            interval=plan_data.interval,
            features=plan_data.features,
            is_active=plan_data.is_active,
            is_popular=plan_data.is_popular,
            sort_order=plan_data.sort_order
        )
        
        db.add(plan)
        await db.commit()
        await db.refresh(plan)
        
        # Clear cache
        await redis_cache.purge_pattern("plan")
        
        return {
            "id": plan.id,
            "name": plan.name,
            "slug": plan.slug,
            "price": plan.price,
            "currency": plan.currency,
            "interval": plan.interval,
            "features": plan.features,
            "is_active": plan.is_active,
            "is_popular": plan.is_popular,
            "sort_order": plan.sort_order
        }
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating plan: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create plan")

@planRouter.put("/{plan_id}", response_model=PlanResponse)
async def update_plan(
    plan_id: int,
    plan_data: PlanUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_super_admin)
):
    """Update plan (Super Admin only)"""
    try:
        result = await db.execute(select(Plan).where(Plan.id == plan_id))
        plan = result.scalar_one_or_none()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        update_data = plan_data.dict(exclude_unset=True)
        if update_data:
            await db.execute(
                update(Plan)
                .where(Plan.id == plan_id)
                .values(**update_data)
            )
            await db.commit()
            await db.refresh(plan)
        
        # Clear cache
        await redis_cache.purge_pattern("plan")
        
        return {
            "id": plan.id,
            "name": plan.name,
            "slug": plan.slug,
            "price": plan.price,
            "currency": plan.currency,
            "interval": plan.interval,
            "features": plan.features,
            "is_active": plan.is_active,
            "is_popular": plan.is_popular,
            "sort_order": plan.sort_order
        }
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating plan {plan_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update plan")

@planRouter.delete("/{plan_id}")
async def delete_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_super_admin)
):
    """Delete plan (Super Admin only)"""
    try:
        result = await db.execute(select(Plan).where(Plan.id == plan_id))
        plan = result.scalar_one_or_none()
        
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        await db.execute(delete(Plan).where(Plan.id == plan_id))
        await db.commit()
        
        # Clear cache
        await redis_cache.purge_pattern("plan")
        
        return {"message": "Plan deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting plan {plan_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete plan")
