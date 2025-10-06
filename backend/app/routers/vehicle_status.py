from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from .. import models
from ..schemas import VehicleStatus

router = APIRouter(prefix="/vehicle-status",tags=["vehicle-status"])

@router.get("/", response_model=List[VehicleStatus])
def get_vehicle_status(db: Session = Depends(get_db)):
    return db.query(models.VehicleStatus).all()