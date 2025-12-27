from pydantic import BaseModel, EmailStr
from typing import Optional


class AdminBase(BaseModel):
    last_name: str
    first_name: str
    patronymic: Optional[str] = None
    email: EmailStr


class AdminCreate(AdminBase):
    password: str


class AdminUpdate(BaseModel):
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    patronymic: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


class AdminResponse(AdminBase):
    admin_id: int

    class Config:
        from_attributes = True
