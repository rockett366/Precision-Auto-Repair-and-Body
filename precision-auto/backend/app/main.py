from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .users import fastapi_users
from .config import settings

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(
    fastapi_users.get_auth_router(jwt_authentication),
    prefix="/auth/jwt",
    tags=["auth"]
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"]
)

# Protected profile route
@app.get("/profile")
async def protected_route(user: User = Depends(fastapi_users.current_user())):
    return user