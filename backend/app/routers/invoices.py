from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..db import get_db
from .. import models
from ..schemas import InvoiceOut

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/history", response_model=List[InvoiceOut])  # or List[EstimateOut]
def get_invoice_history(
    name: Optional[str] = Query(None, description="case-insensitive name filter"),
    db: Session = Depends(get_db),
):
    q = db.query(models.Invoice).order_by(
        models.Invoice.date.desc(),
        models.Invoice.created_at.desc()
    )
    if name:
        q = q.filter(models.Invoice.name.ilike(f"%{name}%"))
    return q.all()

# data seeder for testing
@router.post("/seed-dev", response_model=int)
def seed_dev(db: Session = Depends(get_db)):
    demo = [
        models.Invoice(name="Tobey Maguire", description="Replace bumper cover; paint match", date="2025-09-10"),
        models.Invoice(name="Mr. Incredible", description="OEM glass, sensor recalibration", date="2025-09-12"),
        models.Invoice(name="Barry Allen", description="Paintless dent removal, driver door", date="2025-09-14"),
    ]
    for e in demo:
        db.add(e)
    db.commit()
    return len(demo)