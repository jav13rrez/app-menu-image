import os

API_V1_PREFIX = "/api/v1"

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

GCS_BUCKET = os.getenv("GCS_BUCKET", "foodsocial-assets")

DEFAULT_QUOTA = int(os.getenv("DEFAULT_QUOTA", "50"))

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

USE_MOCK = not bool(GEMINI_API_KEY)
