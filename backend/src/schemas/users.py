from datetime import datetime
from pydantic import BaseModel
from pydantic import EmailStr


class UserBase(BaseModel):
    last_name: str | None = None
    first_name: str
    patronymic: str | None = None
    phone_number: str | None = None
    email: EmailStr
    city_id: int | None = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    user_id: int
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    user_id: int
    email: EmailStr
    first_name: str
    last_name: str | None = None

    class Config:
        from_attributes = True


class UpdateCity(BaseModel):
    city_id: int


class CityResponse(BaseModel):
    city_id: int
    name: str

    class Config:
        from_attributes = True
