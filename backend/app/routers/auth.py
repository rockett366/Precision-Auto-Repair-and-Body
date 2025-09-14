from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from .. import models
from ..schemas import SignupRequest, SignupResponse, UserOut, MIN_PASSWORD_LEN
from ..utils import hash_password

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    # Server side check
    if len(payload.password) < MIN_PASSWORD_LEN:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Password must be at least {MIN_PASSWORD_LEN} characters."
        )

    # Unique email/phone check
    email_exists = db.execute(select(models.User).where(models.User.email == payload.email)).scalar_one_or_none()
    if email_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email/phone number already in use."
        )

    phone_exists = db.execute(select(models.User).where(models.User.phone == payload.phone)).scalar_one_or_none()
    if phone_exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email/phone number already in use."
        )

    user = models.User(
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        email=payload.email.lower(),
        phone=payload.phone,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": f"Welcome, {user.first_name}!",
        "user": UserOut.model_validate(user)
    }
