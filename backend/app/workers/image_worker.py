import uuid
import asyncio
import logging
from typing import Dict
from pathlib import Path

import httpx

from app.models.schemas import JobStatus, JobResultData
from app.core.config import USE_MOCK
from app.services.gemini import generate_food_image, generate_caption

logger = logging.getLogger(__name__)

STATIC_DIR = Path(__file__).resolve().parent.parent.parent / "static" / "generated"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

jobs_store: Dict[str, dict] = {}


def create_job(
    user_id: str,
    style_id: str,
    narrative: str,
    aspect_ratio: str,
    image_url: str,
) -> str:
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

    if USE_MOCK:
        asyncio.get_running_loop().call_later(5.0, _complete_job_mock, job_id)
    else:
        asyncio.ensure_future(_process_job(job_id))

    return job_id


async def _process_job(job_id: str):
    job = jobs_store.get(job_id)
    if not job:
        return

    try:
        image_bytes = await _download_image(job["image_url"])

        generated_bytes = await generate_food_image(
            image_bytes=image_bytes,
            style_id=job["style_id"],
            narrative=job["narrative"],
            aspect_ratio=job["aspect_ratio"],
        )

        filename = f"{job_id}.png"
        filepath = STATIC_DIR / filename
        with open(filepath, "wb") as f:
            f.write(generated_bytes)

        image_url = f"http://localhost:8000/static/generated/{filename}"

        logger.info("Job %s: generando caption en español", job_id)
        caption_data = await generate_caption(generated_bytes)

        job["status"] = JobStatus.COMPLETED
        job["result"] = JobResultData(
            generated_image_url=image_url,
            generated_copy=caption_data["caption"],
            hashtags=caption_data["hashtags"],
        )
        logger.info("Job %s completado exitosamente", job_id)

    except Exception as e:
        logger.error("Job %s falló: %s", job_id, str(e))
        job["status"] = JobStatus.FAILED
        job["error"] = str(e)


async def _download_image(url: str) -> bytes:
    if url.startswith("data:"):
        import base64
        header, data = url.split(",", 1)
        return base64.b64decode(data)

    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(url, timeout=30.0)
        resp.raise_for_status()
        return resp.content


def _complete_job_mock(job_id: str):
    job = jobs_store.get(job_id)
    if not job:
        return

    job["status"] = JobStatus.COMPLETED
    job["result"] = JobResultData(
        generated_image_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        generated_copy=(
            "Saborea la noche... Nuestro chef acaba de terminar esta obra maestra. "
            "¡Etiqueta a alguien con quien la compartirías!"
        ),
        hashtags=["#AltaCocina", "#Foodie", "#CenaPerfecta", "#VidaDeChef", "#FotografíaGastronómica"],
    )


def get_job(job_id: str) -> dict | None:
    return jobs_store.get(job_id)
