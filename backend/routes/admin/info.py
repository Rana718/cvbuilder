from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from controller.admin.dashboardinfo import AdminDashboardController
from middleware.rediscache import redis_cache
from models.admin_models import DashboardInfoResponse

infoRouter = APIRouter()

@infoRouter.get("/dashboard-info", response_model=DashboardInfoResponse)
@redis_cache.cache_get(expire_minutes=5)
async def get_dashboard_info(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive dashboard metrics for admin panel"""
    return await AdminDashboardController.get_dashboard_info(db)
