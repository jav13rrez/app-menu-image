from supabase import create_client, Client
from app.core.config import SUPABASE_URL, SUPABASE_KEY

def get_supabase() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL y SUPABASE_KEY deben estar configurados")
    return create_client(SUPABASE_URL, SUPABASE_KEY)
