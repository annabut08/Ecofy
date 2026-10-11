from pydantic import BaseModel, field_validator
from pydantic import EmailStr


class OrganizationBase(BaseModel):
    name: str
    type: str | None = None
    city: str | None = None
    street: str | None = None
    building: str | None = None
    phone_number: str | None = None


class OrganizationCreate(OrganizationBase):
    email: EmailStr
    edrpou: str
    password: str


class OrganizationUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    city: str | None = None
    street: str | None = None
    building: str | None = None
    phone_number: str | None = None
    email: EmailStr | None = None
    edrpou: str | None = None
    password: str | None = None


class OrganizationResponse(OrganizationBase):
    organization_id: int
    email: EmailStr
    edrpou: str
    status: bool = True

    @field_validator("status", mode="before")
    @classmethod
    def parse_status(cls, v):
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            return v.lower() in ("true", "active", "1")
        return bool(v)

    class Config:
        from_attributes = True
