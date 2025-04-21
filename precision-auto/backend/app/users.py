from fastapi_users import FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend, JWTStrategy, CookieTransport
from fastapi_users.manager import BaseUserManager
from fastapi import Depends, HTTPException
from .models import User
from .schemas import UserCreate, UserUpdate, UserRead
from .database import get_user_db
from .config import settings
import uuid

SECRET_KEY = settings.SECRET_KEY

cookie_transport = CookieTransport(cookie_name="auth", cookie_max_age=3600 * 24 * 7)

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET_KEY, lifetime_seconds=3600 * 24 * 7)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

class UserManager(BaseUserManager[User, str]):
    user_db_model = User
    
    async def on_after_register(self, user: User, request=None):
        print(f"User {user.id} has registered.")
        
    async def create(self, user_create: UserCreate, safe: bool = False, request=None):
        """Create a user in the database."""
        await self.validate_password(user_create.password, user_create)

        existing_user = await self.user_db.get_by_email(user_create.email)
        if existing_user is not None:
            raise HTTPException(
                status_code=400,
                detail="A user with this email already exists.",
            )

        user_dict = user_create.create_update_dict()
        user_dict["id"] = str(uuid.uuid4())
        password = user_dict.pop("password")
        user_dict["hashed_password"] = self.password_helper.hash(password)
        
        created_user = await self.user_db.create(user_dict)
        await self.on_after_register(created_user, request)

        return created_user

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)

fastapi_users = FastAPIUsers[User, str](
    get_user_manager,  
    [auth_backend],  
)