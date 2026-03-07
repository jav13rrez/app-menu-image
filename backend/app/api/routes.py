from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import (
    GenerateRequest,
    GenerateResponse,
    JobResponse,
)
from app.core.auth import get_current_user, CurrentUser
from app.core.config import API_V1_PREFIX, CREDIT_COSTS
from app.core.supabase_client import get_supabase
from app.workers.image_worker import create_job, get_job

router = APIRouter(prefix=API_V1_PREFIX)


@router.post("/generate", response_model=GenerateResponse, status_code=202)
async def generate_image(
    req: GenerateRequest,
    user: CurrentUser = Depends(get_current_user),
):
    credit_cost = CREDIT_COSTS["generate_image_standard"]

    DEV_USER_ID = "00000000-0000-0000-0000-000000000000"
    is_dev_user = user.user_id == DEV_USER_ID

    # Pre-check (real enforcement is in the DB function)
    if not is_dev_user and user.credits_remaining < credit_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Créditos insuficientes. Compra más créditos para continuar.",
        )

    supabase = get_supabase()

    # Atomic credit deduction via Supabase RPC (skip for dev user)
    if not is_dev_user:
        try:
            supabase.rpc("consume_credits", {
                "p_user_id": user.user_id,
                "p_amount": credit_cost,
                "p_description": f"Generación de imagen - estilo {req.style_id}",
            }).execute()
        except Exception as e:
            if "INSUFFICIENT_CREDITS" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_402_PAYMENT_REQUIRED,
                    detail="Créditos insuficientes.",
                )
            raise

    # If context photo selected, fetch its raw image URL for multimodal injection
    context_image_url = None
    if req.context_photo_id:
        if is_dev_user:
            from app.api.context_photos import _dev_photos
            dev_photo = next((p for p in _dev_photos if p["id"] == req.context_photo_id), None)
            if dev_photo:
                context_image_url = dev_photo.get("image_url")
        else:
            ctx_resp = (
                supabase.table("context_photos")
                .select("image_url")
                .eq("id", req.context_photo_id)
                .eq("user_id", user.user_id)
                .maybe_single()
                .execute()
            )
            if ctx_resp.data:
                context_image_url = ctx_resp.data.get("image_url")

    try:
        job_id = create_job(
            user_id=user.user_id,
            style_id=req.style_id,
            narrative=req.narrative,
            aspect_ratio=req.aspect_ratio.value,
            image_url=req.image_url,
            dish_name=req.dish_name,
            business_name=req.business_name,
            location=req.location,
            post_context=req.post_context,
            context_photo_id=req.context_photo_id,
            context_image_url=context_image_url,
        )
    except Exception as e:
        # Refund credits on job creation failure (skip for dev user)
        if not is_dev_user:
            try:
                supabase.rpc("add_purchased_credits", {
                    "p_user_id": user.user_id,
                    "p_amount": credit_cost,
                    "p_stripe_payment_id": f"refund-job-creation-{user.user_id}",
                }).execute()
            except Exception:
                pass  # Log but don't mask original error
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno creando trabajo: {str(e)}",
        )

    return GenerateResponse(
        job_id=job_id,
        status="processing",
        estimated_time_sec=30,
        poll_url=f"{API_V1_PREFIX}/jobs/{job_id}",
    )


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job_status(
    job_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    job = get_job(job_id)
    if not job or job["user_id"] != user.user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trabajo no encontrado",
        )

    return JobResponse(
        status=job["status"],
        result=job["result"],
        error=job["error"],
    )
