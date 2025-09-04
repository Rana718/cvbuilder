from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AdminStatsResponse(BaseModel):
    total_users: int
    premium_users: int
    total_resumes: int
    total_cover_letters: int
    monthly_revenue: float
    user_growth_rate: float
    premium_conversion_rate: float

class UserAdminResponse(BaseModel):
    id: int
    name: str
    email: str
    status: str
    subscription: str
    resumes_count: int
    cover_letters_count: int
    join_date: datetime
    last_login: Optional[datetime]
    total_spent: float
    is_premium: bool
    firebase_uid: str

class ActivityLogResponse(BaseModel):
    id: int
    user_name: str
    action: str
    timestamp: datetime
    details: Optional[str]

class SubscriptionAnalyticsResponse(BaseModel):
    total_subscriptions: int
    active_subscriptions: int
    monthly_revenue: float
    avg_revenue_per_user: float
    churn_rate: float
