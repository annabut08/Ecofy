from pydantic import BaseModel
from datetime import datetime


class TipResponse(BaseModel):
    tip_id: int
    title: str
    content: str | None = None
    category: str | None = None
    image_url: str | None = None
    is_published: bool

    class Config:
        from_attributes = True


class TipCreate(BaseModel):
    title: str
    content: str | None = None
    category: str | None = None
    is_published: bool = True
