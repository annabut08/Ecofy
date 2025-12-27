from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PickupCreate(BaseModel):
    scheduled_time: datetime
    container_site_id: int
    vehicle_id: Optional[int] = None


class PickupUpdate(BaseModel):
    completed_time: Optional[datetime] = None
    vehicle_id: Optional[int] = None


class PickupResponse(BaseModel):
    pickup_id: int
    scheduled_time: datetime
    completed_time: Optional[datetime]
    container_site_id: int
    vehicle_id: Optional[int]

    class Config:
        from_attributes = True


class PickupStatisticsResponse(BaseModel):
    total_pickups: int
    completed_pickups: int
