from pydantic import BaseModel, EmailStr, Field
from typing import Union
from typing import Optional
from fastapi_users.schemas import CreateUpdateDictModel
from fastapi_users.schemas import BaseUser, BaseUserCreate, BaseUserUpdate

class UserCreate(BaseUserCreate):
    first_name: str
    last_name: str
    phone_number: str

class UserUpdate(BaseUserUpdate):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None

class UserRead(BaseUser[str]):
    first_name: str
    last_name: str
    phone_number: str
    
    model_config = {
        "from_attributes": True
    }