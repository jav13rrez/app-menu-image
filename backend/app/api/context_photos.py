"""Context Photo API — CRUD for saved restaurant background images.

Includes in-memory storage fallback for development (dev user bypass).
"""
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user, CurrentUser
from app.core.config import API_V1_PREFIX, CREDIT_COSTS, MAX_CONTEXT_PHOTOS
from app.core.supabase_client import get_supabase
from app.models.schemas import (
    ContextPhotoListResponse,
    UploadContextPhotoRequest,
    UploadContextPhotoResponse,
    UpdateContextPhotoRequest,
)

context_router = APIRouter(prefix=f"{API_V1_PREFIX}/context-photos", tags=["context-photos"])

# ---------------------------------------------------------------------------
# Dev-user bypass: in-memory store for testing without Supabase
# ---------------------------------------------------------------------------
DEV_USER_ID = "00000000-0000-0000-0000-000000000000"
_dev_photos: list[dict] = []  # In-memory storage for dev user


def _is_dev_user(user: CurrentUser) -> bool:
    return user.user_id == DEV_USER_ID


# ---------------------------------------------------------------------------
# List context photos
# ---------------------------------------------------------------------------

@context_router.get("/", response_model=ContextPhotoListResponse)
async def list_context_photos(user: CurrentUser = Depends(get_current_user)):
    """Returns all saved context photos for the authenticated user."""
    if _is_dev_user(user):
        return ContextPhotoListResponse(
            photos=_dev_photos,
            count=len(_dev_photos),
            max=MAX_CONTEXT_PHOTOS,
        )

    supabase = get_supabase()
    resp = (
        supabase.table("context_photos")
        .select("*")
        .eq("user_id", user.user_id)
        .order("sort_order")
        .execute()
    )
    return ContextPhotoListResponse(
        photos=resp.data or [],
        count=len(resp.data or []),
        max=MAX_CONTEXT_PHOTOS,
    )


# ---------------------------------------------------------------------------
# Upload context photo
# ---------------------------------------------------------------------------

@context_router.post("/", response_model=UploadContextPhotoResponse, status_code=201)
async def upload_context_photo(
    req: UploadContextPhotoRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Upload a new context photo. Costs 2 credits (1 upload + 1 AI analysis)."""
    credit_cost = CREDIT_COSTS["upload_context_photo"] + CREDIT_COSTS["context_photo_analysis"]

    if _is_dev_user(user):
        # ── Dev bypass: skip credits, use in-memory store ──
        if len(_dev_photos) >= MAX_CONTEXT_PHOTOS:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Máximo {MAX_CONTEXT_PHOTOS} espacios alcanzado.",
            )

        ai_description = await _analyze_scene(req.image_url)

        photo = {
            "id": str(uuid.uuid4()),
            "user_id": DEV_USER_ID,
            "image_url": req.image_url,
            "thumbnail_url": req.image_url,
            "ai_description": ai_description,
            "label": req.label or "Mi espacio",
            "sort_order": len(_dev_photos),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        _dev_photos.append(photo)

        return UploadContextPhotoResponse(photo=photo, credits_used=0)

    # ── Normal user: full Supabase flow ──
    supabase = get_supabase()

    # Check limit
    existing_resp = (
        supabase.table("context_photos")
        .select("id", count="exact")
        .eq("user_id", user.user_id)
        .execute()
    )
    current_count = existing_resp.count or 0
    if current_count >= MAX_CONTEXT_PHOTOS:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Máximo {MAX_CONTEXT_PHOTOS} espacios alcanzado. Elimina uno para añadir otro.",
        )

    # Deduct credits
    if user.credits_remaining < credit_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Créditos insuficientes. Necesitas {credit_cost} créditos.",
        )

    try:
        supabase.rpc("consume_credits", {
            "p_user_id": user.user_id,
            "p_amount": credit_cost,
            "p_type": "context_upload",
            "p_description": f"Subida y análisis de foto de contexto: {req.label}",
        }).execute()
    except Exception as e:
        if "INSUFFICIENT_CREDITS" in str(e):
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Créditos insuficientes.",
            )
        raise

    # AI scene analysis
    ai_description = await _analyze_scene(req.image_url)

    # Insert photo record
    photo_resp = (
        supabase.table("context_photos")
        .insert({
            "user_id": user.user_id,
            "image_url": req.image_url,
            "thumbnail_url": req.image_url,
            "ai_description": ai_description,
            "label": req.label or "Mi espacio",
            "sort_order": current_count,
        })
        .execute()
    )

    if not photo_resp.data:
        raise HTTPException(status_code=500, detail="Error al guardar la foto.")

    return UploadContextPhotoResponse(
        photo=photo_resp.data[0],
        credits_used=credit_cost,
    )


# ---------------------------------------------------------------------------
# Update context photo label
# ---------------------------------------------------------------------------

@context_router.patch("/{photo_id}")
async def update_context_photo(
    photo_id: str,
    req: UpdateContextPhotoRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Update the label of a saved context photo. Free — no credits consumed."""
    if _is_dev_user(user):
        for photo in _dev_photos:
            if photo["id"] == photo_id:
                photo["label"] = req.label
                return {"status": "updated", "label": req.label}
        raise HTTPException(status_code=404, detail="Foto no encontrada.")

    supabase = get_supabase()
    resp = (
        supabase.table("context_photos")
        .update({"label": req.label})
        .eq("id", photo_id)
        .eq("user_id", user.user_id)
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Foto no encontrada.")
    return {"status": "updated", "label": req.label}


# ---------------------------------------------------------------------------
# Delete context photo
# ---------------------------------------------------------------------------

@context_router.delete("/{photo_id}")
async def delete_context_photo(
    photo_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    """Delete a saved context photo. Free — no refund for original upload cost."""
    if _is_dev_user(user):
        global _dev_photos
        before = len(_dev_photos)
        _dev_photos = [p for p in _dev_photos if p["id"] != photo_id]
        if len(_dev_photos) == before:
            raise HTTPException(status_code=404, detail="Foto no encontrada.")
        return {"status": "deleted"}

    supabase = get_supabase()
    resp = (
        supabase.table("context_photos")
        .delete()
        .eq("id", photo_id)
        .eq("user_id", user.user_id)
        .execute()
    )
    if not resp.data:
        raise HTTPException(status_code=404, detail="Foto no encontrada.")
    return {"status": "deleted"}


# ---------------------------------------------------------------------------
# AI Scene Analysis
# ---------------------------------------------------------------------------

async def _analyze_scene(image_url: str) -> str:
    """Uses Gemini to describe the restaurant scene/atmosphere.

    Falls back to a placeholder if Gemini is not configured.
    """
    from app.core.config import GEMINI_API_KEY

    if not GEMINI_API_KEY:
        return "Espacio del restaurante (descripción pendiente de análisis IA)"

    try:
        from app.services.gemini import analyze_context_photo
        return await analyze_context_photo(image_url)
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning("Context photo analysis failed: %s", e)
        return "Espacio del restaurante (error en análisis IA)"
