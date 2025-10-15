from fastapi import APIRouter, Depends, Query
from typing import List, Optional, Literal
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc

from ..db import get_db
from .. import models
from ..schemas import InvoiceOut  # or EstimateOut if you haven't renamed

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get("/history", response_model=List[InvoiceOut])
def get_invoice_history(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Search by customer name"),
    sort: Optional[Literal["name", "date", "description"]] = Query(None),
    order: Optional[Literal["asc", "desc"]] = Query("asc"),
):
    query = db.query(models.Invoice)  # models.Estimate if not renamed

    # optional search by name (case-insensitive)
    if q:
        query = query.filter(models.Invoice.name.ilike(f"%{q}%"))

    # sorting
    if sort in {"name", "date", "description"}:
        col = getattr(models.Invoice, sort)
        query = query.order_by(asc(col) if order == "asc" else desc(col))
    else:
        # default ordering (newest first)
        query = query.order_by(models.Invoice.date.desc(), models.Invoice.created_at.desc())

    return query.all()

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