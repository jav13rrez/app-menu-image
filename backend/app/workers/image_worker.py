import uuid
import asyncio
import logging
from pathlib import Path
import httpx

from app.models.schemas import JobStatus, JobResultData
from app.core.config import USE_MOCK, SUPABASE_URL, SUPABASE_KEY
from app.core.database import get_supabase
from app.services.gemini import generate_food_image, generate_caption

logger = logging.getLogger(__name__)

def create_job(
    user_id: str,
    style_id: str,
    narrative: str,
    aspect_ratio: str,
    image_url: str,
    dish_name: str | None = None,
    business_name: str | None = None,
    location: str | None = None,
    post_context: str | None = None,
    context_photo_id: str | None = None,
    context_description: str | None = None,
) -> str:
    # 1. Bypass para usuarios sin login (dev UUID fallback)
    DEV_USER_ID = "00000000-0000-0000-0000-000000000000"
    if user_id == DEV_USER_ID:
        import uuid as _uuid
        job_id = f"job_{_uuid.uuid4().hex[:12]}"
        logger.warning(f"Creando trabajo sin guardar en DB para dev-user: {job_id}")
        if USE_MOCK:
            asyncio.create_task(_process_job_mock(
                job_id,
                dish_name=dish_name,
                business_name=business_name,
                location=location,
                post_context=post_context,
            ))
        else:
            asyncio.create_task(_process_job_no_db(
                job_id, user_id, style_id, narrative, aspect_ratio, image_url,
                dish_name=dish_name,
                business_name=business_name,
                location=location,
                post_context=post_context,
                context_description=context_description,
            ))
        return job_id

    # Crear registro en Supabase
    supabase = get_supabase()
    job_data = {
        "user_id": user_id,
        "status": JobStatus.PROCESSING,
        "style_id": style_id,
        "narrative": narrative,
        "aspect_ratio": aspect_ratio,
        "input_image_url": image_url,
        "business_name": business_name,
        "location": location,
        "post_context": post_context,
    }
    # Add context photo reference if provided
    if context_photo_id:
        job_data["context_photo_id"] = context_photo_id
    
    response = supabase.table("jobs").insert(job_data).execute()
    job_id = response.data[0]["id"]

    if USE_MOCK:
        # En Vercel, asyncio.ensure_future podría ser interrumpido. 
        # Para producción real usaríamos un Webhook o Vercel Background Tasks.
        asyncio.create_task(_process_job_mock(job_id))
    else:
        asyncio.create_task(_process_job(job_id))

    return job_id

async def _process_job(job_id: str):
    supabase = get_supabase()
    
    try:
        # 1. Obtener datos del trabajo
        response = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
        job = response.data
        
        # 2. Descargar imagen original
        image_bytes = await _download_image(job["input_image_url"])

        # 3. Generar con Gemini
        generated_bytes = await generate_food_image(
            image_bytes=image_bytes,
            style_id=job["style_id"],
            narrative=job["narrative"],
            aspect_ratio=job["aspect_ratio"],
            business_name=job.get("business_name"),
            location=job.get("location"),
            post_context=job.get("post_context"),
            context_description=None,  # TODO: fetch from context_photos if context_photo_id present
        )

        # 4. Subir a Supabase Storage (Opcional, por ahora simulamos URL o usamos base64)
        # NOTA: En producción real, subirías `generated_bytes` a un bucket de Supabase
        # y obtendrías una URL pública.
        
        # 5. Generar Copy
        caption_data = await generate_caption(
            image_bytes=generated_bytes,
            business_name=job.get("business_name"),
            location=job.get("location"),
            post_context=job.get("post_context")
        )

        import base64
        base64_image = base64.b64encode(generated_bytes).decode('utf-8')
        image_data_uri = f"data:image/jpeg;base64,{base64_image}"

        # 6. Actualizar Supabase
        result_data = {
            "generated_image_url": image_data_uri,
            "generated_copy": caption_data["caption"],
            "hashtags": caption_data["hashtags"],
            "headline": caption_data.get("headline", "Delicioso"),
            "tagline": caption_data.get("tagline", "Sabor único"),
        }
        
        supabase.table("jobs").update({
            "status": JobStatus.COMPLETED,
            "result_data": result_data
        }).eq("id", job_id).execute()

    except Exception as e:
        logger.error(f"Job {job_id} falló: {str(e)}")
        supabase.table("jobs").update({
            "status": JobStatus.FAILED,
            "error_message": str(e)
        }).eq("id", job_id).execute()

jobs_store = {}

async def _process_job_no_db(
    job_id: str,
    user_id: str,
    style_id: str,
    narrative: str,
    aspect_ratio: str,
    image_url: str,
    dish_name: str | None = None,
    business_name: str | None = None,
    location: str | None = None,
    post_context: str | None = None,
    context_description: str | None = None,
):
    jobs_store[job_id] = {"status": JobStatus.PROCESSING, "user_id": user_id, "result": None, "error": None}
    try:
        image_bytes = await _download_image(image_url)
        generated_bytes = await generate_food_image(
            image_bytes=image_bytes,
            style_id=style_id,
            narrative=narrative,
            aspect_ratio=aspect_ratio,
            dish_name=dish_name,
            business_name=business_name,
            location=location,
            post_context=post_context,
            context_description=context_description,
        )
        caption_data = await generate_caption(
            image_bytes=generated_bytes,
            dish_name=dish_name,
            business_name=business_name,
            location=location,
            post_context=post_context
        )
        
        import base64
        base64_image = base64.b64encode(generated_bytes).decode('utf-8')
        image_data_uri = f"data:image/jpeg;base64,{base64_image}"
        
        jobs_store[job_id]["status"] = JobStatus.COMPLETED
        jobs_store[job_id]["result"] = {
            "generated_image_url": image_data_uri,
            "generated_copy": caption_data["caption"],
            "hashtags": caption_data["hashtags"],
            "headline": caption_data.get("headline", "Delicioso"),
            "tagline": caption_data.get("tagline", "Sabor único"),
        }
    except Exception as e:
        jobs_store[job_id]["status"] = JobStatus.FAILED
        jobs_store[job_id]["error"] = str(e)


async def _process_job_mock(
    job_id: str,
    dish_name: str | None = None,
    business_name: str | None = None,
    location: str | None = None,
    post_context: str | None = None,
):
    DEV_USER_ID = "00000000-0000-0000-0000-000000000000"
    jobs_store[job_id] = {"status": JobStatus.PROCESSING, "user_id": DEV_USER_ID, "result": None, "error": None}
    await asyncio.sleep(5)

    # Build context-aware mock data
    hashtags = ["#AltaCocina", "#Foodie", "#FotografiaGastronomica"]
    headline = "Sabor Artesanal"
    tagline = "Cada bocado cuenta una historia de tradición y pasión culinaria"
    copy = "Saborea la noche... Nuestro chef acaba de terminar esta obra maestra. ¡Etiqueta a alguien con quien la compartirías!"

    if business_name:
        hashtags.append(f"#{business_name.replace(' ', '')}")
        copy = f"{business_name} te presenta una experiencia gastronómica única. {copy}"
    if location:
        hashtags.append(f"#Foodie{location.replace(' ', '')}")
        hashtags.append(f"#{location.replace(' ', '')}")
    if post_context:
        tagline = f"{post_context} — {tagline}"

    result_data = {
        "generated_image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        "generated_copy": copy,
        "hashtags": hashtags,
        "headline": headline,
        "tagline": tagline,
    }

    jobs_store[job_id]["status"] = JobStatus.COMPLETED
    jobs_store[job_id]["result"] = result_data


async def _download_image(url: str) -> bytes:
    if url.startswith("data:"):
        import base64
        header, data = url.split(",", 1)
        return base64.b64decode(data)

    async with httpx.AsyncClient() as http_client:
        resp = await http_client.get(url, timeout=30.0)
        resp.raise_for_status()
        return resp.content

def get_job(job_id: str) -> dict | None:
    if job_id in jobs_store:
        return jobs_store[job_id]
        
    try:
        supabase = get_supabase()
        response = supabase.table("jobs").select("*").eq("id", job_id).maybe_single().execute()
        data = response.data
        if not data:
            return None
        
        return {
            "status": data["status"],
            "user_id": str(data["user_id"]),
            "result": data.get("result_data"),
            "error": data.get("error_message")
        }
    except Exception:
        return None
