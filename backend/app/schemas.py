from pydantic import BaseModel, EmailStr, Field, field_validator
import phonenumbers

MIN_PASSWORD_LEN = 6

class SignupRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name:  str = Field(min_length=1)
    email:      EmailStr
    phone:      str
    password:   str = Field(min_length=MIN_PASSWORD_LEN)
    confirm_password: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        try:
            num = phonenumbers.parse(v, None)
            if not phonenumbers.is_valid_number(num):
                raise ValueError("Invalid phone number")
            return phonenumbers.format_number(num, phonenumbers.PhoneNumberFormat.E164)
        except Exception:
            raise ValueError("Invalid phone number")

    @field_validator("confirm_password")
    @classmethod
    def password_match(cls, v, values):
        pwd = values.get("password")
        if pwd is not None and v != pwd:
            raise ValueError("Passwords do not match.")
        return v

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
