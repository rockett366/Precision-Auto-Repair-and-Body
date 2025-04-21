from sqlalchemy import Column, String
from fastapi_users.db import SQLAlchemyBaseUserTable
from .base import Base  
from typing import TYPE_CHECKING

class User(SQLAlchemyBaseUserTable, Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    hashed_password = Column(String)
