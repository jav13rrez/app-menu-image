import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import CORS_ORIGINS
from app.api.routes import router

app = FastAPI(
    title="FoodSocial AI API",
    description="Backend API for FoodSocial AI - Transform food photos into professional social media creatives",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

static_dir = Path(__file__).resolve().parent.parent / "static"
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


@app.get("/health")
async def health_check():
    from app.core.config import USE_MOCK
    return {"status": "ok", "mode": "mock" if USE_MOCK else "gemini"}
