from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class ContainerSiteBase(BaseModel):
    location_lat: float | None = None
    location_lng: float | None = None
    city_id: int | None = None
    street: str | None = None
    building: str | None = None
    entrance: str | None = None
    description: str | None = None


class ContainerSiteCreate(ContainerSiteBase):
    organization_id: int


class ContainerSiteUpdate(BaseModel):
    location_lat: float | None = None
    location_lng: float | None = None
    city_id: int | None = None
    street: str | None = None
    building: str | None = None
    entrance: str | None = None
    description: str | None = None


class ContainerSiteResponse(ContainerSiteBase):
    container_site_id: int
    organization_id: int

    class Config:
        from_attributes = True


class ContainerStatusResponse(BaseModel):
    container_id: int
    type: str
    capacity: int | None = None
    fill_level: int | None = None
    status: str
    last_update: datetime | None = None

    class Config:
        from_attributes = True
