from fastapi import FastAPI, Depends, Request, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from app.users import fastapi_users, auth_backend, get_user_manager, UserManager
from app.schemas import UserRead, UserCreate
from app.models import User
from .config import settings
from .database import engine, Base
import logging
import json
import uuid

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Request logging middleware (DEBUGGING)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    if (request.url.path == "/auth/register" or request.url.path == "/auth/custom-register") and request.method == "POST":
        body = await request.body()
        logger.info(f"Request to {request.url.path}: {body.decode()}")
        request._body = body
    
    response = await call_next(request)
    
    if request.url.path == "/auth/register" or request.url.path == "/auth/custom-register":
        logger.info(f"Response from {request.url.path}: Status {response.status_code}")
        
    return response

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["Content-Type", "Authorization"]
)

# Very basic user registration without using pydantic models (DEBUGGING)
@app.post("/auth/custom-register", status_code=201)
async def custom_register(
    data: dict = Body(...),
    user_manager: UserManager = Depends(get_user_manager)
):
    try:
        logger.info(f"Processing registration data: {data}")
        
        # Extract fields from request body
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("firstname") or data.get("first_name")
        last_name = data.get("lastname") or data.get("last_name")
        phone_number = data.get("phone_number")
        
        # Log the extracted values
        logger.info(f"Extracted values: email={email}, password={'*' * len(password) if password else None}, "
                   f"first_name={first_name}, last_name={last_name}, phone_number={phone_number}")
        
        # Check each field individually
        if not email:
            logger.error("Missing email field")
            raise HTTPException(status_code=400, detail="Missing email field")
        if not password:
            logger.error("Missing password field")
            raise HTTPException(status_code=400, detail="Missing password field")
        if not first_name:
            logger.error("Missing first_name field")
            raise HTTPException(status_code=400, detail="Missing first_name field")
        if not last_name:
            logger.error("Missing last_name field")
            raise HTTPException(status_code=400, detail="Missing last_name field")
        if not phone_number:
            logger.error("Missing phone_number field")
            raise HTTPException(status_code=400, detail="Missing phone_number field")
        
        # Manual validation
        if "@" not in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
            
        if len(password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
        
        # Create user_create object
        user_create = UserCreate(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number
        )
        
        # Check if user already exists
        existing_user = await user_manager.user_db.get_by_email(email)
        if existing_user:
            raise HTTPException(status_code=400, detail="A user with this email already exists")
        
        # Create the user with UUID
        user_dict = {
            "id": str(uuid.uuid4()),
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "phone_number": phone_number,
            "hashed_password": user_manager.password_helper.hash(password),
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
        }
        
        created_user = await user_manager.user_db.create(user_dict)
        logger.info(f"User created successfully: {created_user.id}")
        
        return {"id": created_user.id, "email": created_user.email}
    except HTTPException as he:
        logger.error(f"HTTP error during registration: {he.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during registration: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

# Include auth routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"]
)

# Alternative registration route
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"]
)

# Protected profile route
@app.get("/profile")
async def protected_route(user: User = Depends(fastapi_users.current_user())):
    return user

# Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Debug endpoint
@app.post("/debug")
async def debug_endpoint(data: dict = Body(...)):
    logger.info(f"Debug endpoint received: {data}")
    return {"received": data}

# Create table if it does not exist on startup (50/50 this is correct implimentation)
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)