from datetime import datetime
from http.client import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.notifications import Notifications
from src.models.container_sites import ContainerSite
from src.models.containers import Containers
from src.api.auth import get_current_user
from src.database import get_db
from src.models.devices import Devices
from src.schemas.devices import DeviceResponse, DeviceCreate, DeviceTelemetry, DeviceTelemetryView


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
        status="active",
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


@router.post("/telemetry")
def receive_telemetry(
    data: DeviceTelemetry,
    db: Session = Depends(get_db)
):
    device = db.query(Devices).filter(
        Devices.serial_number == data.serial_number
    ).first()

    if not device:
        raise HTTPException(404, "Device not registered")

    if not device.container_id:
        raise HTTPException(409, "Device not bound to container")

    container = db.query(Containers).filter(
        Containers.container_id == device.container_id
    ).first()

    fill_level = max(0, min(data.fill_level, 100))
    weight = max(0, data.weight)

    device.last_signal = datetime.utcnow()
    device.battery_level = data.battery_level
    device.status = "active"

    container.fill_level = data.fill_level
    container.weight = data.weight
    container.tilted = data.tilted
    container.last_update = datetime.utcnow()

    if data.fill_level >= 90:
        db.add(Notifications(
            message="Контейнер майже заповнений",
            message_type="WARNING",
            container_site_id=container.container_site_id
        ))

    if data.tilted:
        db.add(Notifications(
            message="Контейнер нахилений",
            message_type="CRITICAL",
            container_site_id=container.container_site_id
        ))

    db.commit()
    return {"status": "ok"}


@router.get(
    "/{device_id}/telemetry",
    response_model=DeviceTelemetryView
)
def get_device_telemetry(
    device_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    entity, role = current

    device = db.query(Devices).filter(
        Devices.device_id == device_id
    ).first()

    if not device:
        raise HTTPException(404, "Device not found")

    container = db.query(Containers).filter(
        Containers.container_id == device.container_id
    ).first()

    # перевірка доступу
    if role == "organization":
        site = db.query(ContainerSite).filter(
            ContainerSite.container_site_id == container.container_site_id
        ).first()

        if site.organization_id != entity.organization_id:
            raise HTTPException(403, "Access denied")

    if role not in ("admin", "organization"):
        raise HTTPException(403, "Access denied")

    return {
        "serial_number": device.serial_number,
        "battery_level": device.battery_level,
        "last_signal": device.last_signal,

        "fill_level": container.fill_level,
        "weight": container.weight,
        "tilted": container.tilted,
        "last_update": container.last_update
    }
