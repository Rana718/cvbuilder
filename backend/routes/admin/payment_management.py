from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from db.db import get_db
from controller.admin.payment_management import PaymentManagementController
from middleware.rediscache import redis_cache
from models.admin_models import PaymentManagementResponse

paymentRouter = APIRouter()

@paymentRouter.get("/payment-management", response_model=PaymentManagementResponse)
@redis_cache.cache_get(expire_minutes=10)
async def get_payment_management_data(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get comprehensive payment management data for admin dashboard"""
    return await PaymentManagementController.get_payment_management_data(db)
