from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from .. import models, schemas
from ..schemas import (SignupRequest, SignupResponse, UserOut, MIN_PASSWORD_LEN, 
ReviewCreate, ReviewOut, LoginRequest, TokenOut)
from ..utils import hash_password, create_access_token, verify_password, decode_token 

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




#-----for review page-----
@router.post("/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db)):
    try:
        models.Review.__table__.create(bind=db.get_bind(), checkfirst=True)
    except Exception:
        pass  # okay if it already exists

    review = models.Review(
        rating=payload.rating,
        content=(payload.content or None),
        needs_followup=(payload.rating <= 3),
    )
    db.add(review)
    try:
        db.commit()
        db.refresh(review)
        return review  # matches schemas.ReviewOut (id, needs_followup)
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to save review")
    
# ----- login + current user -----
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    email = decode_token(token)  # should validate signature & exp and return email (sub)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(subject=user.email)
    return {"access_token": token, "token_type": "bearer"}