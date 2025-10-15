from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime, func, UniqueConstraint, ForeignKey
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

    is_admin = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())



class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=False)
    date = Column(String(10), nullable=False)  # store as ISO string "YYYY-MM-DD"
    file_url = Column(String(1000), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)



class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)
    content = Column(String(500), nullable=True)
    needs_followup = Column(Boolean, nullable=False, default=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())



class ClientRecord(Base):
    __tablename__= "client_records"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(Date, nullable=False)



class VehicleStatus(Base):
    __tablename__ = "status"
    
    id = Column(Integer, primary_key=True, index=True)
    # Status Code: 1 = In Service, 2 = Repairing, 3 = Ready for Pickup
    status = Column(Integer, nullable=False)
    make = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    vin = Column(String(20), nullable=False)
    color = Column(String(30), nullable=False)
    design = Column(String(200), nullable=True)
    additional_details = Column(String(200), nullable=True)


class OnlineEstimatesForm(Base):
    __tablename__ = "online_estimates_form"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(32), nullable=False)
    make = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    vin = Column(String(20), nullable=False)
    color = Column(String(30), nullable=False)
    description = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserVehicle(Base):
    __tablename__ = "user_vehicles"
    __table_args__ = (
        UniqueConstraint("user_id", "vin", name="uq_user_vin_per_user"), 
    )
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    make = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    year = Column(Integer, nullable=False)
    vin = Column(String(20), nullable=False)
    created_at = Column(Date, server_default=func.current_date(), nullable=False)
