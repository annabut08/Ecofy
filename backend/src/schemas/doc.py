from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class WasteTransferActDTO(BaseModel):
    city: str
    act_date: date
    contract_number: str
    contract_date: date

    # Відправник
    sender_name: str
    sender_edrpou: str
    sender_address: str
    sender_phone: str

    # Отримувач
    receiver_name: str
    receiver_edrpou: str
    receiver_address: str
    receiver_phone: str

    transfer_datetime: datetime
    waste_description: str
    rejection_reason: Optional[str] = None
