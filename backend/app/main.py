import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import CORS_ORIGINS
from app.api.routes import router
from app.api.billing import billing_router
from app.api.context_photos import context_router

app = FastAPI(
    title="FoodSocial AI API",
    description="Backend API for FoodSocial AI — Transform food photos into professional social media creatives",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(router)
app.include_router(billing_router)
app.include_router(context_router)

static_dir = Path(__file__).resolve().parent.parent / "static"
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.get("/health")
async def health_check():
    from app.core.config import USE_MOCK, STRIPE_SECRET_KEY
    return {
        "status": "ok",
        "version": "0.2.0",
        "mode": "mock" if USE_MOCK else "gemini",
        "stripe": "configured" if STRIPE_SECRET_KEY else "not_configured",
    }
