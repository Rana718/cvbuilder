from pydantic import BaseModel, validator
from typing import List, Optional

class PlanBase(BaseModel):
    name: str
    slug: str
    price: int  # Price in rupees
    currency: str = "INR"
    duration_days: int  # Duration in days (minimum 1)
    features: List[str]
    download_limit: Optional[int] = None  # NULL = unlimited, number = limit
    is_active: bool = True
    is_popular: bool = False
    sort_order: int = 0

    @validator('duration_days')
    def validate_duration(cls, v):
        if v < 1:
            raise ValueError('Duration must be at least 1 day')
        return v

class PlanCreate(PlanBase):
    pass

class PlanUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[int] = None
    currency: Optional[str] = None
    duration_days: Optional[int] = None
    features: Optional[List[str]] = None
    download_limit: Optional[int] = None
    is_active: Optional[bool] = None
    is_popular: Optional[bool] = None
    sort_order: Optional[int] = None

    @validator('duration_days')
    def validate_duration(cls, v):
        if v is not None and v < 1:
            raise ValueError('Duration must be at least 1 day')
        return v

class PlanResponse(BaseModel):
    id: int
    name: str
    slug: str
    price: int
    currency: str
    duration_days: int
    interval: Optional[str] = None  # Keep for backward compatibility
    features: List[str]
    download_limit: Optional[int] = None
    is_active: Optional[bool] = None
    is_popular: bool
    sort_order: int

    class Config:
        from_attributes = True
