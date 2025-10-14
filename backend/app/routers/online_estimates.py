from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from .. import models
from ..schemas import OnlineEstimaesCreate

router = APIRouter(prefix="/online-estimates",tags=["online-estiamtes"])

@router.post("/create/")
def create_estimate(estimate: OnlineEstimaesCreate, db: Session=Depends(get_db)):
    db_estimate = models.OnlineEstimatesForm(
        first_name=estimate.first_name,
        last_name=estimate.last_name,
        email=estimate.email,
        phone=estimate.phone,
        make=estimate.make,
        model=estimate.model,
        year=estimate.year,
        vin=estimate.vin,
        color=estimate.color,
        description=estimate.description
    )
    db.add(db_estimate)
    db.commit()
    db.refresh(db_estimate)
    return{"id": db_estimate.id, "message": "Estimate submitted successfully"}