from fastapi import APIRouter
from . import info, payment_management, user_management, addadmin

adminRouter = APIRouter()

adminRouter.include_router(info.infoRouter, prefix="/info", tags=["Admin Dashboard"])
adminRouter.include_router(payment_management.paymentRouter, prefix="/payments", tags=["Payment Management"])
adminRouter.include_router(user_management.router, prefix="/users", tags=["User Management"])
adminRouter.include_router(addadmin.router, prefix="/admin-roles", tags=["Admin Role Management"])
