"""Supabase client singleton for server-side operations."""
from supabase import create_client, Client
from app.core.config import SUPABASE_URL, SUPABASE_KEY

_supabase_client: Client | None = None


def get_supabase() -> Client:
    """Returns a singleton Supabase client using the Service Role Key."""
    global _supabase_client
    if _supabase_client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise RuntimeError(
                "SUPABASE_URL y SUPABASE_KEY deben estar configurados en las variables de entorno."
            )
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client
