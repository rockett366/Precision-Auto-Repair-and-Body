from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTAuthentication
from .models import User
from .schemas import UserCreate, UserUpdate, UserRead
from .database import get_user_db
from .config import settings

# From .env
SECRET_KEY = (settings.SECRET_KEY)

jwt_authentication = JWTAuthentication(
    secret=SECRET_KEY,
    lifetime_seconds=3600 * 24 * 7,
    tokenUrl="/auth/jwt/login"
)

fastapi_users = FastAPIUsers(
    get_user_db,
    [jwt_authentication],
    User,
    UserCreate,
    UserUpdate,
    UserRead
)