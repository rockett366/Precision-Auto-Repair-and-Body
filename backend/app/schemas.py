from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
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


class EstimateOut(BaseModel):
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
