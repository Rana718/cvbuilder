from sqlalchemy.ext.asyncio import AsyncSession
from controller.admin_controller import AdminController
from fastapi import Request

async def log_user_activity(db: AsyncSession, user_id: int, action: str, details: str = None, request: Request = None):
    ip_address = None
    user_agent = None
    
    if request:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")
    
    await AdminController.log_activity(db, user_id, action, details, ip_address, user_agent)
