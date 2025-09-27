from fastapi import APIRouter, Depends, Query
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

@router.get("/search", response_model=List[EstimateOut])
def search_estimates(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    term = f"%{name}%"
    return (
        db.query(models.Estimate)
        .filter(models.Estimate.name.ilike(term))
        .order_by(models.Estimate.date.desc(), models.Estimate.created_at.desc())
        .all()
    )

# data seeder for testing
@router.post("/seed-dev", response_model=int)
def seed_dev(db: Session = Depends(get_db)):
    demo = [
        models.Estimate(name="Front Bumper Repair", description="Replace bumper cover; paint match", date="2025-09-10"),
        models.Estimate(name="Windshield Replace", description="OEM glass, sensor recalibration", date="2025-09-12"),
        models.Estimate(name="Door Dent PDR", description="Paintless dent removal, driver door", date="2025-09-14"),
    ]
    for e in demo:
        db.add(e)
    db.commit()
    return len(demo)