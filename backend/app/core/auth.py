from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
from app.core.config import SUPABASE_JWT_SECRET, ALGORITHM
from app.core.supabase_client import get_supabase


security = HTTPBearer(auto_error=False)


class CurrentUser:
    """Represents the authenticated user with real-time credit balance."""

    def __init__(
        self,
        user_id: str,
        tenant_id: str,
        credits_remaining: int,
        stripe_customer_id: Optional[str] = None,
    ):
        self.user_id = user_id
        self.tenant_id = tenant_id
        self.credits_remaining = credits_remaining
        self.stripe_customer_id = stripe_customer_id

    @property
    def can_generate(self) -> bool:
        """Check if user has enough credits for a standard generation."""
        return self.credits_remaining >= 2


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> CurrentUser:
    # Dev mode fallback — no token means local testing
    if not credentials:
        return CurrentUser(
            user_id="dev-user",
            tenant_id="dev-tenant",
            credits_remaining=999,
        )

    token = credentials.credentials
    try:
        if not SUPABASE_JWT_SECRET:
            # Fallback: decode without verification (ONLY for initial testing)
            payload = jwt.get_unverified_payload(token)
        else:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=[ALGORITHM],
                audience="authenticated",
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Token inválido: sin user_id")

        # Fetch real data from Supabase
        supabase = get_supabase()

        profile_resp = (
            supabase.table("profiles")
            .select("tenant_id, stripe_customer_id")
            .eq("id", user_id)
            .maybe_single()
            .execute()
        )

        balance_resp = (
            supabase.table("credit_balances")
            .select("credits_remaining")
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )

        profile = profile_resp.data if profile_resp.data else {}
        balance = balance_resp.data if balance_resp.data else {}

        return CurrentUser(
            user_id=user_id,
            tenant_id=profile.get("tenant_id", "default"),
            credits_remaining=balance.get("credits_remaining", 0),
            stripe_customer_id=profile.get("stripe_customer_id"),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error de autenticación: {str(e)}",
        )
