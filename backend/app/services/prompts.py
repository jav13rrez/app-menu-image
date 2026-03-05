"""Prompt engineering for food photography generation with Nano Banana 2.

Informed by the Gastronomic Master Alchemist knowledge base:
- Object Consistency Protocol 3-P (structural fidelity clauses)
- 6 curated aesthetic styles (2026 trending)
- 3 context-aware narrative types
- Negative prompting layer for photographic authenticity
- Mobile-first vertical composition grammar
"""

# --------------------------------------------------------------------------
# STYLE TAXONOMY — 6 curated 2026 food photography aesthetics
# Each style: prompt keywords, mood, and technical camera specs.
# --------------------------------------------------------------------------

STYLE_PROMPTS: dict[str, dict[str, str]] = {
    "dark_moody": {
        "keywords": (
            "dramatic chiaroscuro lighting, deep shadows with warm amber rim highlights, "
            "dark textured background (slate, aged wood), palette 'Moon Cherry' "
            "(deep burgundies, charcoal greys, warm browns), high contrast, "
            "specular highlights on sauces and glazes"
        ),
        "mood": "luxury, mystery, intimacy, nocturnal sophistication",
        "camera": "Shot on Hasselblad X2D, 80mm f/1.8, ISO 100, dramatic rim lighting",
    },
    "rustic_wood": {
        "keywords": (
            "rustic wooden table surface with visible grain, natural warm sunlight streaming "
            "through a window, cozy homestyle atmosphere, linen napkins, artisan bread crumbs, "
            "palette 'Golden Terra' (warm ambers, creams, olive tones), "
            "soft depth of field with warmth"
        ),
        "mood": "warmth, comfort, artisan craft, farm-to-table authenticity",
        "camera": "Shot on Canon R5, 50mm f/2.8, natural window light, warm white balance",
    },
    "marble_luxury": {
        "keywords": (
            "clean white Carrara marble surface, elegant soft directional shadows, "
            "luxury fine dining editorial setting, precise geometric plating, "
            "minimal props (single sprig of herbs, thin gold cutlery), "
            "controlled specular reflections, pristine negative space"
        ),
        "mood": "elegance, precision, Michelin-star sophistication, purity",
        "camera": "Shot on Phase One IQ4, 85mm f/4, soft diffused studio light, high-key",
    },
    "vibrant_pop": {
        "keywords": (
            "saturated dopamine colors, bold neon accents, hard direct flash lighting, "
            "extreme color contrast, pop-art inspired composition, "
            "sharp defined shadows, energetic frame, "
            "anti-wellness visual rebellion"
        ),
        "mood": "energy, fun, visual impact, dopamine rush, Gen-Z appeal",
        "camera": "Shot on Canon R5, 100mm Macro f/8, ring flash, hard direct light",
    },
    "retro_analog": {
        "keywords": (
            "35mm film grain emulation, subtle light leaks, warm desaturated colors, "
            "analogue imperfection, asymmetric composition, "
            "vintage Kodak Portra 400 tonality, soft vignette, "
            "anti-AI tactile beauty, nostalgic warmth"
        ),
        "mood": "nostalgia, human touch, warmth, memory, anti-digital comfort",
        "camera": "Shot on Leica M6, Kodak Portra 400 emulation, 50mm f/2, direct flash styling",
    },
    "nordic_minimalist": {
        "keywords": (
            "clean Nordic minimalism, desaturated palette 'Future Dusk', "
            "limestone or light concrete surface, organic textures, "
            "soft diffused natural light, no visual noise, "
            "Scandinavian editorial precision, sustainable aesthetic"
        ),
        "mood": "calm, honesty, sustainability, restrained elegance",
        "camera": "Shot on Leica SL2, 50mm f/5.6, soft window light with bounce card",
    },
}


# --------------------------------------------------------------------------
# NARRATIVE TAXONOMY — Context-aware human touch & motion
#
# These prompts are designed to let the model ANALYZE the dish before acting.
# Each narrative instructs the model to evaluate what's coherent with the food
# and only add the element if it makes gastronomic/visual sense.
# --------------------------------------------------------------------------

NARRATIVE_PROMPTS: dict[str, dict[str, str]] = {
    "none": {
        "action": "",
        "subtext": "",
    },
    "action_pour": {
        "action": (
            "NARRATIVE INSTRUCTION — DYNAMIC POUR / ACTION ELEMENT:\n"
            "First, analyze the dish in the reference image. Identify its key ingredients "
            "and what type of liquid, sauce, powder, or garnish could coherently be poured, "
            "drizzled, or sprinkled onto it.\n"
            "ONLY if there is a gastronomically coherent element to add "
            "(for example: a salsa over pasta, honey over cheese, olive oil over bruschetta, "
            "powdered sugar over a dessert), then depict that element being poured or added "
            "from above, captured mid-air with subtle motion blur conveying dynamism.\n"
            "Whatever element you choose to add must be the SECONDARY focal point after the dish.\n"
            "CRITICAL: If the dish does NOT lend itself to any coherent pour or addition "
            "(e.g., a simple fried egg, sushi, a sandwich), DO NOT force this action. "
            "Instead, simply present the dish beautifully without any added dynamic element."
        ),
        "subtext": "freshness, texture, appetite activation, breaking the screen barrier",
    },
    "chef_hand": {
        "action": (
            "NARRATIVE INSTRUCTION — CHEF'S HAND / ARTISAN TOUCH:\n"
            "First, analyze the dish in the reference image. Identify what final garnish "
            "or finishing touch a skilled chef would logically add to THIS specific dish.\n"
            "ONLY if there is a coherent finishing gesture "
            "(for example: placing a micro-herb with tweezers on a fine dining plate, "
            "cracking pepper over a steak, sprinkling fleur de sel over chocolate), "
            "then depict a chef's hand (real skin texture with natural pores, not plastic) "
            "performing that precise gesture. Freeze the moment of delicate placement.\n"
            "The hand should convey mastery and artisan craft.\n"
            "CRITICAL: If the dish does NOT lend itself to any coherent chef's finishing touch, "
            "DO NOT force this element. Present the dish beautifully without hands."
        ),
        "subtext": "mastery, artisanship, care, made-to-order authenticity",
    },
    "waiter_pov": {
        "action": (
            "NARRATIVE INSTRUCTION — WAITER POV / HOSPITALITY MOMENT:\n"
            "Depict this dish from a waiter's POV or over-the-shoulder angle. "
            "A hand elegantly presents or places the plate toward the viewer with an open palm. "
            "The gesture invites the viewer to be the diner receiving this creation. "
            "Only the hand and forearm should be visible, no face.\n"
            "The hand must have real skin texture — pores, subtle wrinkles, natural tone. "
            "CRITICAL: No plastic or artificial-looking skin."
        ),
        "subtext": "hospitality, immediacy, immersive dining experience",
    },
}


# --------------------------------------------------------------------------
# NEGATIVE PROMPT — Quality control layer
# --------------------------------------------------------------------------

NEGATIVE_INSTRUCTIONS = (
    "CRITICAL PROHIBITIONS: No plastic texture on food, no rubbery appearance, "
    "no over-processed or airbrushed look, no deformed hands or fingers, "
    "no messy or half-eaten plating (unless the original shows it), "
    "no distracting cutlery overlapping the hero dish, no digital artifacts, "
    "no inconsistent lighting directions, no text or watermarks on the image."
)


# --------------------------------------------------------------------------
# STRUCTURAL FIDELITY CLAUSE — Object Consistency Protocol
# --------------------------------------------------------------------------

FIDELITY_CLAUSE = (
    "STRUCTURAL FIDELITY (CRITICAL — NON-NEGOTIABLE): "
    "Preserve the exact structural integrity of the food content from the reference image. "
    "Replicate the precise shape, quantity, arrangement, and distribution of all ingredients. "
    "Do NOT add, remove, alter, or rearrange any food element. "
    "High-fidelity geometric rendering of the original plating composition. "
    "Only modify the environment, lighting, and presentation — never the food itself."
)


# --------------------------------------------------------------------------
# PROMPT BUILDER — Combines all layers into a single generation prompt
# --------------------------------------------------------------------------

def build_prompt(
    style_id: str,
    narrative: str,
    aspect_ratio: str,
    business_name: str | None = None,
    location: str | None = None,
    post_context: str | None = None,
    context_description: str | None = None,
) -> str:
    """Build a complete image generation prompt for Nano Banana 2.

    Follows the Gastronomic Master Alchemist architecture:
    1. Persona + Fidelity Clause (the non-negotiable core)
    2. Style layer (aesthetic + camera)
    3. Narrative layer (human touch + motion — context-aware)
    4. Business context (venue atmosphere, seasonal relevance)
    5. Composition + aspect ratio
    6. Negative instructions (quality control)
    """
    style = STYLE_PROMPTS.get(style_id, STYLE_PROMPTS["dark_moody"])
    narr = NARRATIVE_PROMPTS.get(narrative, NARRATIVE_PROMPTS["none"])

    # --- 1. Persona + Fidelity ---
    prompt = (
        "You are a world-class gastronomic photographer and visual alchemist "
        "specializing in editorial food photography for premium publications. "
        "Transform this food photo into a stunning, professional social media image.\n\n"
        f"{FIDELITY_CLAUSE}\n\n"
    )

    # --- 2. Style Layer ---
    prompt += (
        f"VISUAL STYLE: {style['keywords']}\n"
        f"MOOD: {style['mood']}\n"
        f"TECHNICAL: {style['camera']}\n\n"
    )

    # --- 3. Narrative Layer (context-aware) ---
    if narr["action"]:
        prompt += f"{narr['action']}\n\n"

    # --- 4. Business Context Layer ---
    context_parts: list[str] = []
    if context_description:
        context_parts.append(
            f"VENUE VISUAL CONTEXT: A reference image of the venue/brand identity has been provided. "
            f"It is described as: {context_description}. "
            f"This image may be a photograph, an illustration, a mural, graffiti, artwork, "
            f"or any visual that represents the brand identity. "
            f"Extract its textures, colors, and atmosphere, and subtly integrate them "
            f"into the background and environmental elements of the final image."
        )
    if business_name:
        context_parts.append(
            f"BRAND IDENTITY: This dish belongs to '{business_name}'. "
            f"Subtly reflect the spirit and personality of this establishment."
        )
    if location:
        context_parts.append(
            f"GEOGRAPHIC CONTEXT: Located in {location}. "
            f"Subtly evoke the regional character or ambiance of this area."
        )
    if post_context:
        context_parts.append(
            f"PUBLICATION CONTEXT: This image is for: {post_context}. "
            f"Adapt the visual energy and seasonal cues accordingly."
        )
    if context_parts:
        prompt += "BUSINESS CONTEXT:\n" + "\n".join(context_parts) + "\n\n"

    # --- 5. Composition + Output ---
    prompt += (
        f"COMPOSITION: Target aspect ratio {aspect_ratio}. "
    )
    if aspect_ratio in ("9:16", "4:5", "3:4"):
        prompt += (
            "Vertical mobile-first composition. The dish occupies 80% of the frame width. "
            "Leave 20-30% negative space at top for potential text overlay. "
        )
    elif aspect_ratio in ("16:9", "4:3", "5:4"):
        prompt += (
            "Horizontal editorial composition. The dish occupies 70% of the frame height. "
        )
    else:
        prompt += "Square composition with the dish centered. "

    prompt += (
        "Use shallow depth of field with gradual focus falloff.\n\n"
    )

    # --- 6. Quality Control ---
    prompt += (
        f"{NEGATIVE_INSTRUCTIONS}\n\n"
        "OUTPUT: A single photorealistic, ultra-high-quality food photograph "
        "ready for Instagram or editorial publication. 8K rendering quality, "
        "sharp focus on the hero dish, cinematic color grading."
    )

    return prompt
