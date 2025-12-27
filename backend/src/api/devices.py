from datetime import datetime
from http.client import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.container_sites import ContainerSite
from src.models.containers import Containers
from src.api.auth import get_current_user
from src.database import get_db
from src.models.devices import Devices
from src.schemas.devices import DeviceResponse, DeviceCreate, DeviceTelemetry


router = APIRouter(
    prefix="/devices",
    tags=["Devices ⚡"]
)


@router.post("/", response_model=DeviceResponse)
def create_device(
    data: DeviceCreate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    entity, role = current

    if role not in ("admin", "organization"):
        raise HTTPException(403, "Access denied")

    exists = db.query(Devices).filter(
        Devices.serial_number == data.serial_number
    ).first()

    if exists:
        raise HTTPException(409, "Device already exists")

    device = Devices(
        device_name=data.device_name,
        serial_number=data.serial_number,
        device_type=data.device_type,
        battery_level=data.battery_level,
        status="inactive",
        container_id=data.container_id
    )

    db.add(device)
    db.commit()
    db.refresh(device)

    return device


@router.get("/", response_model=list[DeviceResponse])
def get_devices(
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    entity, role = current

    if role == "admin":
        return db.query(Devices).all()

    if role == "organization":
        return (
            db.query(Devices)
            .join(Containers)
            .join(ContainerSite)
            .filter(ContainerSite.organization_id == entity.organization_id)
            .all()
        )

    raise HTTPException(403, "Access denied")


@router.post("/telemetry/")
def receive_telemetry(
    data: DeviceTelemetry,
    db: Session = Depends(get_db)
):
    device = db.query(Devices).filter(
        Devices.serial_number == data.serial_number
    ).first()

    if not device:
        raise HTTPException(404, "Device not registered")

    device.last_signal = datetime.utcnow()
    device.battery_level = data.battery_level
    device.status = "active"

    db.commit()

    return {
        "status": "ok",
        "device_id": device.device_id
    }
