from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from . import models
from .routers import auth
from .routers import estimates as estimates_router
from .routers import inventory as inventory_router


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

app.include_router(auth.router, prefix="/api")
app.include_router(estimates_router.router, prefix="/api")
app.include_router(inventory_router.router, prefix="/api")