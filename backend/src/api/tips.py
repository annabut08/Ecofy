from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database import get_db
from src.models.tips import Tips
from src.schemas.tips import TipResponse

router = APIRouter(prefix="/tips", tags=["Tips"])


@router.get("/", response_model=list[TipResponse])
def get_tips(
    category: str | None = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Tips).filter(Tips.is_published == True)

    if category:
        query = query.filter(Tips.category.ilike(category))

    return query.order_by(Tips.created_at.desc()).all()


@router.get("/categories", response_model=list[str])
def get_categories(db: Session = Depends(get_db)):
    categories = (
        db.query(Tips.category)
        .filter(Tips.is_published == True)
        .filter(Tips.category != None)
        .distinct()
        .all()
    )
    return [c[0] for c in categories]
