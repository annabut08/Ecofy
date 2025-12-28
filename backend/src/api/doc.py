from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import Date, cast
from sqlalchemy.orm import Session

from src.models.container_sites import ContainerSite
from src.models.pickups import Pickups
from src.models.vehicles import Vehicles
from src.schemas.doc import RoutePointDTO, RouteSheetDTO, WasteTransferActDTO
from src.database import get_db
from src.models import ClientCompanies, Organization
from src.api.auth import get_current_user
from datetime import date, datetime

router = APIRouter(
    prefix="/documents",
    tags=["Documents 📄"]
)


@router.post(
    "/waste-transfer-act",
    response_model=WasteTransferActDTO,
    summary="Generate waste transfer act (without saving)"
)
def generate_waste_transfer_act(
    client_company_id: int,
    organization_id: int,
    city: str,
    act_date: date,
    contract_number: str,
    contract_date: date,
    transfer_datetime: datetime,
    waste_description: str,
    rejection_reason: str | None = None,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    _, role = current
    if role not in ("admin", "organization"):
        raise HTTPException(403, "Access denied")

    client = db.query(ClientCompanies).filter(
        ClientCompanies.client_id == client_company_id
    ).first()

    organization = db.query(Organization).filter(
        Organization.organization_id == organization_id
    ).first()

    if not client:
        raise HTTPException(404, "Client company not found")

    if not organization:
        raise HTTPException(404, "Organization not found")

    sender_address = f"{client.city}, {client.street}, {client.building}"
    receiver_address = f"{organization.city}, {organization.street}, {organization.building}"

    return WasteTransferActDTO(
        city=city,
        act_date=act_date,
        contract_number=contract_number,
        contract_date=contract_date,

        sender_name=client.name,
        sender_edrpou=client.edrpou,
        sender_address=sender_address,
        sender_phone=client.phone_number,

        receiver_name=organization.name,
        receiver_edrpou=organization.edrpou,
        receiver_address=receiver_address,
        receiver_phone=organization.phone_number,

        transfer_datetime=transfer_datetime,
        waste_description=waste_description,
        rejection_reason=rejection_reason
    )


@router.get(
    "/route-sheet",
    response_model=RouteSheetDTO,
    summary="Generate route sheet based on pickups"
)
def generate_route_sheet_from_pickups(
    vehicle_id: int,
    route_date: date,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    _, role = current
    if role not in ("admin", "organization"):
        raise HTTPException(403, "Access denied")

    vehicle = db.query(Vehicles).filter(
        Vehicles.vehicle_id == vehicle_id
    ).first()

    if not vehicle:
        raise HTTPException(404, "Vehicle not found")

    organization = db.query(Organization).filter(
        Organization.organization_id == vehicle.organization_id
    ).first()

    if not organization:
        raise HTTPException(404, "Organization not found")

    pickups = (
        db.query(Pickups)
        .join(ContainerSite)
        .filter(
            Pickups.vehicle_id == vehicle_id,
            cast(Pickups.scheduled_time, Date) == route_date
        )
        .order_by(Pickups.scheduled_time)
        .all()
    )

    if not pickups:
        raise HTTPException(
            404, "No pickups found for this vehicle and date"
        )

    route_points = []
    for p in pickups:
        site = p.containersite
        address = f"{site.city}, {site.street}, {site.building}"

        route_points.append(RoutePointDTO(
            container_site_id=site.container_site_id,
            address=address,
            scheduled_time=p.scheduled_time.time(),
            completed_time=(
                p.completed_time.time()
                if p.completed_time else None
            )
        ))

    return RouteSheetDTO(
        route_date=route_date,

        organization_name=organization.name,
        organization_edrpou=organization.edrpou,
        organization_phone=organization.phone_number,

        vehicle_name=vehicle.vehicle_name,
        vehicle_number_plate=vehicle.number_plate,

        route_points=route_points
    )
