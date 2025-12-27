from http.client import HTTPException
from fastapi import APIRouter, Depends
from requests import Session

from src.api.auth import get_current_user
from src.database import get_db
from src.models.devices import Devices
from src.schemas.devices import DeviceResponse, DeviceCreate


router = APIRouter(
    prefix="/devices",
    tags=["Devices ⚡"]
)


@router.post("/", response_model=DeviceResponse)
def register_device(
    data: DeviceCreate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    _, role = current

    if role not in ("admin", "organization"):
        raise HTTPException(403, "Access denied")

    if db.query(Devices).filter(
        Devices.serial_number == data.serial_number
    ).first():
        raise HTTPException(409, "Device already exists")

    device = Devices(
        device_name=data.device_name,
        serial_number=data.serial_number,
        device_type=data.device_type,
        container_id=data.container_id,
        status="active"
    )

    db.add(device)
    db.commit()
    db.refresh(device)

    return device
