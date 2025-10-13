from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from . import models
from .routers import auth, users
from .routers import invoices as invoices_router
from .routers import client_record as client_record
from .routers import vehicle_status as vehicle_status

from .routers import s3_online_estimates

# Create tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Precision Auto API")

# Allow your Next.js dev origin / CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}


#----api routers for auth token here----
app.include_router(auth.router, prefix="/api")
app.include_router(invoices_router.router, prefix="/api")
app.include_router(client_record.router, prefix="/api")
app.include_router(vehicle_status.router, prefix="/api")
#client-profile-backend
app.include_router(users.router, prefix="/api")

app.include_router(s3_online_estimates.router, prefix="/api")

