from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone_number: str

class UserUpdate(BaseModel):
    first_name: str | None
    last_name: str | None
    phone_number: str | None

class UserRead(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str