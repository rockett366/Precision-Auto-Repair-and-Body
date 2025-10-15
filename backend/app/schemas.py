from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from datetime import date
import phonenumbers
from typing import Optional


MIN_PASSWORD_LEN = 8

class SignupRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr
    phone: str
    password: str = Field(min_length=MIN_PASSWORD_LEN)
    confirm_password: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        try:
            if not v.startswith("+"):
                v = "+1" + v
            num = phonenumbers.parse(v, None)
            if not phonenumbers.is_valid_number(num):
                raise ValueError("Invalid phone number")
            return phonenumbers.format_number(num, phonenumbers.PhoneNumberFormat.E164)
        except Exception:
            raise ValueError("Invalid phone number")

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str

    class Config:
        from_attributes = True


class SignupResponse(BaseModel):
    message: str
    user: UserOut


class InvoiceOut(BaseModel):
    id: int
    name: str
    description: str
    date: str = Field(..., description="YYYY-MM-DD")
    file_url: Optional[str] = None

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    content: str = Field() 

    @field_validator("content")
    @classmethod
    def content_min_three(cls, v: str) -> str:
        s = v.strip()
        if len(s) < 3:
            # <<< your custom message
            raise ValueError("Minimum three characters required!")
        return s

class ReviewOut(BaseModel):
    id: int
    needs_followup: bool

    class Config:
        from_attributes = True

class ClientRecordBase(BaseModel):
    vehicle: str
    description: str
    date: date
    
    class Config:
        orm_mode = True
        
class VehicleStatus(BaseModel):
    id: int
    status: int
    make: str
    model: str
    year: int
    vin: str
    color: str
    design: str
    additional_details: str
    
    class Config:
        from_attributes = True


#----Authentication Tokens----
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

#----Update User Profile----

class UserUpdate(BaseModel):
    first_name: str
    last_name: str
    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        try:
            import phonenumbers
            if not v.startswith("+"):
                v = "+1" + v
            num = phonenumbers.parse(v, None)
            if not phonenumbers.is_valid_number(num):
                raise ValueError("Invalid phone number")
            return phonenumbers.format_number(num, phonenumbers.PhoneNumberFormat.E164)
        except Exception:
            raise ValueError("Invalid phone number")

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=MIN_PASSWORD_LEN)

# class PasswordChange(BaseModel):
#     current_password: str
#     new_password: str = Field(min_length=MIN_PASSWORD_LEN)

# NEW: used by POST /users/me/verify-password
class PasswordVerify(BaseModel):
    current_password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class GoogleSignInRequest(BaseModel):
    credential: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"