from pydantic import BaseModel
from datetime import datetime


class DeviceCreate(BaseModel):
    device_name: str
    serial_number: str
    device_type: str | None = None
    container_id: int | None = None


class DeviceResponse(BaseModel):
    device_id: int
    device_name: str
    serial_number: str
    device_type: str | None
    last_signal: datetime
    battery_level: int | None
    status: str | None

    class Config:
        from_attributes = True
