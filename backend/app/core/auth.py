from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
from app.core.config import SECRET_KEY, ALGORITHM

security = HTTPBearer(auto_error=False)


class CurrentUser:
    def __init__(self, user_id: str, tenant_id: str, quota_remaining: int):
        self.user_id = user_id
        self.tenant_id = tenant_id
        self.quota_remaining = quota_remaining


DEV_USER = CurrentUser(user_id="dev-user", tenant_id="dev-tenant", quota_remaining=999)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> CurrentUser:
    if not credentials:
        return DEV_USER

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub", "")
        tenant_id: str = payload.get("tenant_id", "default")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject",
            )
        return CurrentUser(
            user_id=user_id,
            tenant_id=tenant_id,
            quota_remaining=50,
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
