from pydantic import BaseModel
from datetime import datetime


class DeviceBase(BaseModel):
    device_name: str
    serial_number: str
    device_type: str | None = None
    container_id: str | None = None


class DeviceCreate(DeviceBase):
    battery_level: int | None = 100


class DeviceUpdate(BaseModel):
    device_name: str | None = None
    device_type: str | None = None
    container_id: int | None = None
    battery_level: int | None = None
    status: str | None = None


class DeviceResponse(DeviceBase):
    device_id: int
    battery_level: int | None = None
    status: str | None = None
    last_signal: datetime

    class Config:
        from_attributes = True


class DeviceTelemetry(BaseModel):
    serial_number: str
    fill_level: float
    weight: float
    tilted: bool
    battery_level: int | None = None
