from pydantic import BaseModel
from typing import List, Optional

class PlanBase(BaseModel):
    name: str
    slug: str
    price: int  # Price in rupees
    currency: str = "INR"
    interval: str = "monthly"
    features: List[str]
    download_limit: Optional[int] = None  # NULL = unlimited, number = limit
    is_active: bool = True
    is_popular: bool = False
    sort_order: int = 0

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[int] = None
    currency: Optional[str] = None
    interval: Optional[str] = None
    features: Optional[List[str]] = None
    download_limit: Optional[int] = None
    is_active: Optional[bool] = None
    is_popular: Optional[bool] = None
    sort_order: Optional[int] = None

class PlanResponse(BaseModel):
    id: int
    name: str
    slug: str
    price: int
    currency: str
    interval: str
    features: List[str]
    download_limit: Optional[int] = None
    is_active: Optional[bool] = None
    is_popular: bool
    sort_order: int

    class Config:
        from_attributes = True
