from sqlalchemy import Column, Integer, String, DateTime, func, UniqueConstraint
from .db import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("email", name="uq_users_email"),
        UniqueConstraint("phone", name="uq_users_phone"),
    )

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name  = Column(String(100), nullable=False)
    email      = Column(String(255), nullable=False, index=True)
    phone      = Column(String(32),  nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
