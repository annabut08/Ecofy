from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.models.cities import Cities

router = APIRouter(prefix="/cities", tags=["Cities"])


@router.get("/search")
def search_cities(
    query: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(Cities)
        .filter(Cities.name.ilike(f"%{query}%"))
        .limit(10)
        .all()
    )
