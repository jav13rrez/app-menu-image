"""Context Photo API — CRUD for saved restaurant background images."""
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


@context_router.get("/", response_model=ContextPhotoListResponse)
async def list_context_photos(user: CurrentUser = Depends(get_current_user)):
    """Returns all saved context photos for the authenticated user."""
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


@context_router.post("/", response_model=UploadContextPhotoResponse, status_code=201)
async def upload_context_photo(
    req: UploadContextPhotoRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Upload a new context photo. Costs 2 credits (1 upload + 1 AI analysis)."""
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

    # Deduct credits (upload + analysis)
    credit_cost = CREDIT_COSTS["upload_context_photo"] + CREDIT_COSTS["context_photo_analysis"]
    if user.credits_remaining < credit_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Créditos insuficientes. Necesitas {credit_cost} créditos.",
        )

    try:
        supabase.rpc("consume_credits", {
            "p_user_id": user.user_id,
            "p_amount": credit_cost,
            "p_description": f"Subida y análisis de foto de contexto: {req.label}",
        }).execute()
    except Exception as e:
        if "INSUFFICIENT_CREDITS" in str(e):
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Créditos insuficientes.",
            )
        raise

    # AI scene analysis (uses Gemini — placeholder for now)
    ai_description = await _analyze_scene(req.image_url)

    # Insert photo record
    photo_resp = (
        supabase.table("context_photos")
        .insert({
            "user_id": user.user_id,
            "image_url": req.image_url,
            "thumbnail_url": req.image_url,  # TODO: generate real thumbnail
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


@context_router.patch("/{photo_id}")
async def update_context_photo(
    photo_id: str,
    req: UpdateContextPhotoRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Update the label of a saved context photo. Free — no credits consumed."""
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


@context_router.delete("/{photo_id}")
async def delete_context_photo(
    photo_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    """Delete a saved context photo. Free — no refund for original upload cost."""
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


async def _analyze_scene(image_url: str) -> str:
    """Uses Gemini Pro Vision to describe the restaurant scene.

    Falls back to a placeholder if Gemini is not configured.
    """
    from app.core.config import GEMINI_API_KEY

    if not GEMINI_API_KEY:
        return "Espacio del restaurante (descripción pendiente de análisis IA)"

    try:
        from app.services.gemini import analyze_context_photo
        return await analyze_context_photo(image_url)
    except Exception:
        return "Espacio del restaurante (error en análisis IA)"
