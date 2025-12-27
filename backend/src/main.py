from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.src.api import disposal_requests
from src.api import users, devices, containers, organizations, auth, client_companies, vehicles, container_sites, admin, pickups


app = FastAPI(
    title="Ecofy 🍀 ",
    description="Ecofy — система для управління утилізацією та вивезенням відходів",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "https://ecofy-beta.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(client_companies.router)
app.include_router(organizations.router)
app.include_router(devices.router)
app.include_router(containers.router)
app.include_router(container_sites.router)
app.include_router(vehicles.router)
app.include_router(admin.router)
app.include_router(disposal_requests.router)
app.include_router(pickups.router)


@app.get("/")
def root():
    return {
        "service": "Ecofy API",
        "status": "running",
        "docs": "/docs"
    }
