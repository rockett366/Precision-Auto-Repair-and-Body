from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db             
from ..models import UserVehicle
from ..schemas import VehicleCreate, VehicleOut

router = APIRouter(prefix="/user-vehicles", tags=["user_vehicles"])

@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate, db: Session = Depends(get_db)):
    v = UserVehicle(
        user_id=payload.user_id,
        make=payload.make,
        model=payload.model,
        year=int(payload.year),
        vin=payload.vin.upper().strip(),
    )
    db.add(v)
    try:
        db.commit()
        db.refresh(v)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="VIN already exists.")
    return v

@router.get("/by-user/{user_id}", response_model=List[VehicleOut])
def list_vehicles_by_user(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(UserVehicle)
        .filter(UserVehicle.user_id == user_id)
        .order_by(UserVehicle.created_at.desc())
        .all()
    )

@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)): 
    v = db.get(UserVehicle, vehicle_id)
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
    db.delete(v)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
