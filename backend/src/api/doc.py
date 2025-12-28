from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.schemas.doc import WasteTransferActDTO
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
