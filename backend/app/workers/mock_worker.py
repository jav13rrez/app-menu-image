import uuid
import asyncio
from typing import Dict
from app.models.schemas import JobStatus, JobResultData

jobs_store: Dict[str, dict] = {}


def create_job(user_id: str, style_id: str, narrative: str, aspect_ratio: str, image_url: str) -> str:
    job_id = f"job_{uuid.uuid4().hex[:12]}"
    jobs_store[job_id] = {
        "status": JobStatus.PROCESSING,
        "user_id": user_id,
        "style_id": style_id,
        "narrative": narrative,
        "aspect_ratio": aspect_ratio,
        "image_url": image_url,
        "result": None,
        "error": None,
    }
    asyncio.get_running_loop().call_later(10.0, _complete_job, job_id)
    return job_id


def _complete_job(job_id: str):
    job = jobs_store.get(job_id)
    if not job:
        return
    job["status"] = JobStatus.COMPLETED
    job["result"] = JobResultData(
        generated_image_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        generated_copy=(
            "Savor the night... Our chef just finished this masterpiece. "
            "Tag someone you'd share this with!"
        ),
        hashtags=["#FineDining", "#Foodie", "#DinnerDate", "#ChefLife", "#FoodPhotography"],
    )


def get_job(job_id: str) -> dict | None:
    return jobs_store.get(job_id)
