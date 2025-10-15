from fastapi import APIRouter, Depends, HTTPException, Response, status, Path
from typing import List
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List

from ..db import get_db             
from ..models import UserVehicle
from ..schemas import VehicleCreate, VehicleOut, VehicleUpdate

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

@router.put("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(
    vehicle_id: int = Path(..., gt=0),
    payload: VehicleUpdate = None,
    db: Session = Depends(get_db)
):
    v = db.query(UserVehicle).filter(UserVehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found.")

    # Apply changes only if provided
    if payload.make is not None:
        v.make = payload.make
    if payload.model is not None:
        v.model = payload.model
    if payload.year is not None:
        try:
            v.year = int(payload.year)
        except (TypeError, ValueError):
            raise HTTPException(status_code=400, detail="Year must be an integer.")
    if payload.vin is not None:
        v.vin = payload.vin.strip().upper()

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


# Get all vehicles (for admin use, not linked to user)
@router.get("", response_model=List[VehicleOut])
def list_all_vehicles(db: Session = Depends(get_db)):
    return db.query(UserVehicle).order_by(UserVehicle.id.desc()).all()

# Get a specific vehicle by ID
@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    v = db.query(UserVehicle).filter(UserVehicle.id == vehicle_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
    return v
