from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from .. import models
from ..schemas import EstimateOut

router = APIRouter(prefix="/estimates", tags=["estimates"])

@router.get("/history", response_model=List[EstimateOut])
def get_estimate_history(db: Session = Depends(get_db)):
    """Return estimates ordered by most recent date, then creation time."""
    return (
        db.query(models.Estimate)
        .order_by(models.Estimate.date.desc(), models.Estimate.created_at.desc())
        .all()
    )