from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import select
from ..db import get_db
from .. import models, schemas
from ..schemas import (SignupRequest, SignupResponse, UserOut, MIN_PASSWORD_LEN, 
ReviewCreate, ReviewOut, LoginRequest, TokenOut)
from ..utils import hash_password, create_access_token, verify_password, decode_token 

from ..schemas import SignupRequest, SignupResponse, UserOut, MIN_PASSWORD_LEN, ReviewCreate, ReviewOut
from ..utils import hash_password, verify_password
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

ACCESS_TOKEN_EXPIRE_MINUTES = 60

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

@router.post("/login")
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        subject=user.email,
        ttl_seconds=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        extra_claims={"is_admin": user.is_admin}
    )

    if getattr(user, "is_admin", False):
        response = JSONResponse(
            content={"message": "Admin login successful", "is_admin": True}
        )
        response.set_cookie(
            key="admin_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            path="/"
        )
        return response

    return JSONResponse(
        content={
            "message": "Client login successful",
            "is_admin": False,
            "access_token": access_token
        }
    )

@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return schemas.UserOut.model_validate(current_user)


# ----- Admin Auth-----
@router.post("/admin/login")
def admin_login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email.lower()).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not getattr(user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Access denied. Not an admin user.")

    token = create_access_token(subject=user.email)
    response = JSONResponse(content={
        "message": "Admin login successful",
        "user": schemas.UserOut.model_validate(user).model_dump()
    })
    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,
        secure=False,       # True in production
        samesite="lax",
        path="/"
    )
    return response


@router.get("/admin/me")
def get_admin_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("admin_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    email = decode_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not getattr(user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Access denied")

    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "is_admin": user.is_admin,
    }

@router.post("/logout")
def logout_user(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "User logged out successfully"}

@router.post("/admin/logout")
def logout_admin(response: Response):
    response.delete_cookie(key="admin_token")
    return {"message": "Admin logged out successfully"}