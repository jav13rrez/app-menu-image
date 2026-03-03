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

    # Pre-check (real enforcement is in the DB function)
    if user.credits_remaining < credit_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Créditos insuficientes. Compra más créditos para continuar.",
        )

    supabase = get_supabase()

    # Atomic credit deduction via Supabase RPC
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

    # If context photo selected, fetch its AI description for prompt enrichment
    context_description = None
    if req.context_photo_id:
        ctx_resp = (
            supabase.table("context_photos")
            .select("ai_description")
            .eq("id", req.context_photo_id)
            .eq("user_id", user.user_id)
            .maybe_single()
            .execute()
        )
        if ctx_resp.data:
            context_description = ctx_resp.data.get("ai_description")

    try:
        job_id = create_job(
            user_id=user.user_id,
            style_id=req.style_id,
            narrative=req.narrative,
            aspect_ratio=req.aspect_ratio.value,
            image_url=req.image_url,
            business_name=req.business_name,
            location=req.location,
            post_context=req.post_context,
        )
    except Exception as e:
        # Refund credits on job creation failure
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
