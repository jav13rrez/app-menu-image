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

MODEL = "gemini-3.1-flash-image-preview"


async def generate_food_image(
    image_bytes: bytes,
    style_id: str,
    narrative: str,
    aspect_ratio: str,
    business_name: str | None = None,
    location: str | None = None,
    post_context: str | None = None,
    context_description: str | None = None,
) -> bytes:
    if not client:
        raise RuntimeError("API key de Gemini no configurada")

    prompt = build_prompt(
        style_id=style_id,
        narrative=narrative,
        aspect_ratio=aspect_ratio,
        business_name=business_name,
        location=location,
        post_context=post_context,
        context_description=context_description,
    )
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


async def generate_caption(
    image_bytes: bytes,
    business_name: str | None = None,
    location: str | None = None,
    post_context: str | None = None,
) -> dict:
    if not client:
        raise RuntimeError("API key de Gemini no configurada")

    context_prompt = ""
    if business_name or location or post_context:
        context_prompt += "CONTEXTO DEL NEGOCIO Y LA PUBLICACIÓN:\n"
        if business_name:
            context_prompt += f"- Nombre del negocio: {business_name}\n"
        if location:
            context_prompt += f"- Ubicación: {location}\n"
        if post_context:
            context_prompt += f"- Motivo de la publicación: {post_context}\n"
            
        context_prompt += (
            "INSTRUCCIONES ESTRICTAS BASADAS EN EL CONTEXTO:\n"
            "1. Si hay un Nombre del negocio, úsalo de forma natural en el caption, headline o tagline.\n"
            "2. Si hay un Nombre del negocio o Ubicación, incluye hashtags obligatorios "
            "(ej. si se llama 'La Tagliatella' y está en 'Madrid', añade #LaTagliatella #Madrid #FoodieMadrid).\n"
            "3. Adapta el tono y contenido del texto al 'Motivo de la publicación' si se proporciona. Siempre dale un tono persuasivo relacionado con la Gastronomía.\n"
        )

    prompt = (
        "Analiza esta imagen de comida. Genera:\n"
        "1. Un caption emotivo y persuasivo gastronómico para redes sociales (2-3 frases)\n"
        "2. 5-7 hashtags relevantes\n"
        "3. Un headline impactante de 2-5 palabras (estilo título grande H2)\n"
        "4. Un tagline descriptivo de 7-15 palabras (frase promocional)\n\n"
        f"{context_prompt}\n"
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
