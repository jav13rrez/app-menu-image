from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional
from app.core.config import SUPABASE_JWT_SECRET, ALGORITHM

security = HTTPBearer(auto_error=False)

class CurrentUser:
    def __init__(self, user_id: str, tenant_id: str, quota_remaining: int):
        self.user_id = user_id
        self.tenant_id = tenant_id
        self.quota_remaining = quota_remaining

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> CurrentUser:
    # Para desarrollo local si no hay token
    if not credentials:
        return CurrentUser(user_id="dev-user", tenant_id="dev-tenant", quota_remaining=999)

    token = credentials.credentials
    try:
        # Supabase usa un JWT secreto que se puede obtener del panel de control
        # Si no está configurado, saltamos la validación estricta para pruebas
        if not SUPABASE_JWT_SECRET:
             # Fallback decodificación sin verificación (SOLO PARA PRUEBAS INICIALES)
             payload = jwt.get_unverified_payload(token)
        else:
            payload = jwt.decode(
                token, 
                SUPABASE_JWT_SECRET, 
                algorithms=[ALGORITHM], 
                audience="authenticated"
            )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        return CurrentUser(
            user_id=user_id,
            tenant_id=payload.get("app_metadata", {}).get("tenant_id", "default"),
            quota_remaining=50 # Esto debería venir de la DB profiles en una versión más avanzada
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error de autenticación: {str(e)}",
        )
