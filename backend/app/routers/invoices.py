from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from .. import models
from ..schemas import InvoiceOut

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/history", response_model=List[InvoiceOut])
def get_invoice_history(db: Session = Depends(get_db)):
    """Return invoices ordered by most recent date, then creation time."""
    return (
        db.query(models.Invoice)
        .order_by(models.Invoice.date.desc(), models.Invoice.created_at.desc())
        .all()
    )

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