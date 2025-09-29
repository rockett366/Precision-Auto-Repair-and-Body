from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas
from ..utils import hash_password, verify_password

router = APIRouter(prefix="/users", tags=["users"])

# Get a user by id
@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Update profile (first/last/phone)
@router.put("/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, payload: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # enforce unique phone
    conflict = db.query(models.User).filter(
        (models.User.phone == payload.phone) & (models.User.id != user_id)
    ).first()
    if conflict:
        raise HTTPException(status_code=409, detail="Phone already in use")

    user.first_name = payload.first_name
    user.last_name = payload.last_name
    user.phone = payload.phone
    db.commit()
    db.refresh(user)
    return user

# Change password
@router.put("/{user_id}/password")
def change_password(user_id: int, payload: schemas.PasswordChange, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated"}
