from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict
from db.db import get_db
from controller.dashboard import DashboardController
from middleware.rediscache import redis_cache
from pydantic import BaseModel

app = APIRouter()

class CacheRequest(BaseModel):
    token: str

@app.get("/data")
@redis_cache.cache_get(expire_minutes=5)  # Cache for 5 minutes
async def get_dashboard_data(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get all dashboard data including stats, resumes, and user info in one call"""
    firebase_uid = request.state.user_id
    return await DashboardController.get_dashboard_data(firebase_uid, db)

@app.post("/refresh-analytics")
async def refresh_analytics_cache(request: CacheRequest):
    """Refresh analytics cache for better performance"""
    DashboardController.clear_cache_data(request.token)
    return {"status": "cache refreshed"}
