from pydantic import BaseModel, EmailStr
from typing import Optional

class AddUserProfileRequest(BaseModel):
    full_name: Optional[str]
    image_url: Optional[str]
    email: EmailStr
    firebase_uid: str
    google_id: Optional[str]

