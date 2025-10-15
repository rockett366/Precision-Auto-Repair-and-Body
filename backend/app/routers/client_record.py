from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..db import get_db
from .. import models
from ..schemas import ClientRecordBase

router = APIRouter(prefix="/client-records",tags=["client-records"])

@router.get("/", response_model=List[ClientRecordBase])
def get_client_records(db: Session = Depends(get_db)):
    return db.query(models.ClientRecord).all()
