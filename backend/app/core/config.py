import os

API_V1_PREFIX = "/api/v1"

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

GCS_BUCKET = os.getenv("GCS_BUCKET", "foodsocial-assets")

DEFAULT_QUOTA = int(os.getenv("DEFAULT_QUOTA", "50"))

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")  # Service Role Key para operaciones de servidor
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")  # Para validar JWT de Supabase Auth

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

USE_MOCK = not bool(GEMINI_API_KEY)

# --- Stripe ---
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")

# --- Frontend URL (for Stripe redirects) ---
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# --- Credit costs per action ---
CREDIT_COSTS: dict[str, int] = {
    "generate_image_standard": 2,
    "generate_image_hd": 3,
    "upload_context_photo": 1,
    "context_photo_analysis": 1,
    "regenerate_variation": 2,
}

# --- Context photos ---
MAX_CONTEXT_PHOTOS = 10

# --- Welcome bonus ---
WELCOME_BONUS_CREDITS = 10
