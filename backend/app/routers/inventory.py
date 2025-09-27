from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db
from .. import models
from ..schemas import InventoryOut, InventoryUpdate

router = APIRouter(prefix="/inventory", tags=["inventory"])

@router.get("/history", response_model=List[InventoryOut])
def get_Inventory_history(db: Session = Depends(get_db)):
    return (
        db.query(models.Inventory)
        .order_by(models.Inventory.name.desc(), models.Inventory.created_at.desc())
        .all()
    )

@router.get("/search", response_model=List[InventoryOut])
def search_inventory(
    name: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    term = f"%{name}%"
    return (
        db.query(models.Inventory)
        .filter(models.Inventory.name.ilike(term))
        .all()
    )

# data seeder for testing
@router.post("/seed-dev", response_model=int)
def seed_dev(db: Session = Depends(get_db)):
    demo = [
        models.Inventory(name="Screws", description="Size 10 philips screws", quantity="200"),
        models.Inventory(name="Wrench", description="adjsutable wrench", quantity="5"),
        models.Inventory(name="Impact Drill", description="Milkwakee impact drill", quantity="2"),
    ]
    for e in demo:
        db.add(e)
    db.commit()
    return len(demo)