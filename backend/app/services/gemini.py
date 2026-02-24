import json
import logging
from io import BytesIO
from PIL import Image
from google import genai
from google.genai import types
from app.core.config import GEMINI_API_KEY
from app.services.prompts import build_prompt

logger = logging.getLogger(__name__)

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

MODEL = "gemini-3-pro-image-preview"


async def generate_food_image(
    image_bytes: bytes,
    style_id: str,
    narrative: str,
    aspect_ratio: str,
) -> bytes:
    if not client:
        raise RuntimeError("API key de Gemini no configurada")

    prompt = build_prompt(style_id, narrative, aspect_ratio)
    img = Image.open(BytesIO(image_bytes))

    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt, img],
        config=types.GenerateContentConfig(
            response_modalities=["Text", "Image"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            return part.inline_data.data

    raise RuntimeError("Gemini no devolvió una imagen")


async def generate_caption(image_bytes: bytes) -> dict:
    if not client:
        raise RuntimeError("API key de Gemini no configurada")

    prompt = (
        "Analiza esta imagen de comida. Genera un caption atractivo y emotivo para redes sociales "
        "y 5-7 hashtags relevantes en español. IMPORTANTE: Responde ÚNICAMENTE en ESPAÑOL. "
        "Devuelve SOLO JSON válido con este formato exacto, sin texto adicional: "
        '{"caption": "tu caption aquí", "hashtags": ["#hashtag1", "#hashtag2"]}'
    )

    img = Image.open(BytesIO(image_bytes))

    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt, img],
        config=types.GenerateContentConfig(
            response_modalities=["Text"],
        ),
    )

    text = response.text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text[3:]
        text = text.rsplit("```", 1)[0]
        text = text.strip()

    try:
        data = json.loads(text)
        return {
            "caption": data.get("caption", ""),
            "hashtags": data.get("hashtags", []),
        }
    except json.JSONDecodeError:
        logger.warning("Error al parsear respuesta de Gemini: %s", text[:200])
        return {
            "caption": text[:500],
            "hashtags": [],
        }
