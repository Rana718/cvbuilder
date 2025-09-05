from pydantic import BaseModel
from typing import Optional, List

class SuperAdminRequest(BaseModel):
    email: str
    secret_key: str

class AddAdminRequest(BaseModel):
    user_email: str
    make_admin: bool = True
    make_super_admin: bool = False
    
class RemoveAdminRequest(BaseModel):
    user_email: str

class AdminResponse(BaseModel):
    success: bool
    message: str
    user: Optional[dict] = None

class RecentUser(BaseModel):
    name: str
    email: str
    image_url: Optional[str]
    registered_date: str
    is_premium: bool

class RecentPayment(BaseModel):
    payment_id: str
    user_name: str
    user_email: str
    amount: int
    status: str
    payment_date: Optional[str]

class DashboardInfoResponse(BaseModel):
    total_users: int
    user_growth_percentage: float
    total_active_subscriptions: int
    total_resumes: int
    resume_growth_percentage: float
    current_month_revenue: int
    revenue_growth_percentage: float
    recent_users: List[RecentUser]
    recent_payments: List[RecentPayment]

# Payment Management Models
class RevenueMetrics(BaseModel):
    total_revenue: int
    current_month_revenue: int
    revenue_growth_percentage: float

class SubscriptionMetrics(BaseModel):
    active_subscriptions: int
    subscription_growth_percentage: float

class SuccessRateMetrics(BaseModel):
    current_success_rate: float
    success_rate_change: float

class PaymentMethodDistribution(BaseModel):
    method: str
    count: int
    percentage: float
    total_amount: int

class PaymentTransaction(BaseModel):
    transaction_id: str
    user_name: str
    user_email: str
    user_image: Optional[str]
    amount: int
    status: str
    method: Optional[str]
    purchase_date: str

class FailedPayment(BaseModel):
    transaction_id: str
    user_name: str
    user_email: str
    amount: int
    date: str

class PaymentManagementResponse(BaseModel):
    revenue_metrics: RevenueMetrics
    subscription_metrics: SubscriptionMetrics
    success_rate_metrics: SuccessRateMetrics
    payment_method_distribution: List[PaymentMethodDistribution]
    payment_transactions: List[PaymentTransaction]
    recent_failed_payments: List[FailedPayment]
