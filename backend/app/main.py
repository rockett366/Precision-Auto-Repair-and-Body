from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routers import auth, users
# from .routers import estimates as estimates_router
from .routers import invoices as invoices_router
from .routers import client_record as client_record
from .routers import vehicle_status as vehicle_status
from .routers import landing_page
from .routers import s3_online_estimates
from .routers import online_estimates
from .routers import user_vehicles

from . import models

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
app.include_router(online_estimates.router, prefix="/api")
app.include_router(landing_page.router, prefix="/api")
app.include_router(user_vehicles.router, prefix="/api")

def dump_routes(app):
    print("\n--- ROUTES ---")
    for r in app.router.routes:
        try:
            path = getattr(r, "path", "")
            methods = getattr(r, "methods", set())
            name = getattr(r, "name", "")
            if "/api/user-vehicles" in path:
                print(f"{methods}  {path}  -> {name}")
        except Exception:
            pass
    print("--- END ROUTES ---\n")

dump_routes(app)
