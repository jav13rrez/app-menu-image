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
        "Analiza esta imagen de comida. Genera:\n"
        "1. Un caption emotivo para redes sociales (2-3 frases)\n"
        "2. 5-7 hashtags relevantes\n"
        "3. Un headline impactante de 2-5 palabras (estilo título grande H2)\n"
        "4. Un tagline descriptivo de 7-15 palabras (frase promocional)\n\n"
        "IMPORTANTE: Responde ÚNICAMENTE en ESPAÑOL.\n"
        "Devuelve SOLO JSON válido con este formato exacto, sin texto adicional:\n"
        '{"caption": "...", "hashtags": ["#..."], "headline": "...", "tagline": "..."}'
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
            "headline": data.get("headline", "Delicioso"),
            "tagline": data.get("tagline", "Un sabor único que despierta los sentidos"),
        }
    except json.JSONDecodeError:
        logger.warning("Error al parsear respuesta de Gemini: %s", text[:200])
        return {
            "caption": text[:500],
            "hashtags": [],
            "headline": "Delicioso",
            "tagline": "Un sabor único que despierta los sentidos",
        }
