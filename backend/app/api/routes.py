from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import (
    GenerateRequest,
    GenerateResponse,
    JobResponse,
)
from app.core.auth import get_current_user, CurrentUser
from app.core.config import API_V1_PREFIX
from app.workers.image_worker import create_job, get_job

router = APIRouter(prefix=API_V1_PREFIX)


@router.post("/generate", response_model=GenerateResponse, status_code=202)
async def generate_image(
    req: GenerateRequest,
    user: CurrentUser = Depends(get_current_user),
):
    if user.quota_remaining <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Créditos insuficientes. Por favor actualiza tu plan.",
        )

    try:
        job_id = create_job(
            user_id=user.user_id,
            style_id=req.style_id,
            narrative=req.narrative,
            aspect_ratio=req.aspect_ratio.value,
            image_url=req.image_url,
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno creando trabajo: {str(e)}",
        )

    return GenerateResponse(
        job_id=job_id,
        status="processing",
        estimated_time_sec=12,
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
