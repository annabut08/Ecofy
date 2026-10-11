from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from src.models.tips import Tips
from src.schemas.tips import TipResponse, TipCreate
from src.api.auth import get_current_user

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


@router.post("/", response_model=TipResponse, status_code=201)
def create_tip(
    data: TipCreate,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    _, role = current
    if role != "admin":
        raise HTTPException(403, "Only admin can create tips")

    tip = Tips(**data.dict())
    db.add(tip)
    db.commit()
    db.refresh(tip)
    return tip


@router.delete("/{tip_id}", status_code=204)
def delete_tip(
    tip_id: int,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    _, role = current
    if role != "admin":
        raise HTTPException(403, "Only admin can delete tips")

    tip = db.query(Tips).filter(Tips.tip_id == tip_id).first()
    if not tip:
        raise HTTPException(404, "Tip not found")

    db.delete(tip)
    db.commit()
