from pydantic import BaseModel
from datetime import date, datetime, time
from typing import List, Optional


class WasteTransferActDTO(BaseModel):
    city: str
    act_date: date

    sender_name: str
    sender_edrpou: str
    sender_address: str
    sender_phone: str

    receiver_name: str
    receiver_edrpou: str
    receiver_address: str
    receiver_phone: str

    transfer_datetime: datetime
    waste_description: str


class RoutePointDTO(BaseModel):
    container_site_id: int
    address: str
    scheduled_time: time
    completed_time: Optional[time]


class RouteSheetDTO(BaseModel):
    route_date: date

    organization_name: str
    organization_edrpou: str
    organization_phone: str

    vehicle_name: str
    vehicle_number_plate: str

    route_points: List[RoutePointDTO]
