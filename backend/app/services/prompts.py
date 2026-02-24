STYLE_PROMPTS = {
    "dark_moody": "dark moody lighting, deep shadows, warm amber highlights, dramatic chiaroscuro",
    "rustic_wood": "rustic wooden table surface, natural warm sunlight streaming in, cozy atmosphere",
    "marble_luxury": "clean white marble surface, elegant soft shadows, luxury fine dining setting",
    "golden_hour": "golden hour sunset lighting, warm soft bokeh background, romantic ambiance",
    "bright_studio": "bright professional studio lighting, clean white background, commercial food photography",
    "moody_candlelight": "intimate candlelit ambiance, deep reds and warm oranges, romantic dinner setting",
}

NARRATIVE_PROMPTS = {
    "none": "",
    "action_pour": "with sauce or dressing being poured mid-air with beautiful motion blur",
    "chef_hand": "with a chef's hand carefully placing a fresh garnish on top",
    "waiter_pov": "from a waiter's perspective, a hand elegantly serving the plate to the viewer",
}


def build_prompt(style_id: str, narrative: str, aspect_ratio: str) -> str:
    style_desc = STYLE_PROMPTS.get(style_id, STYLE_PROMPTS["dark_moody"])
    narrative_desc = NARRATIVE_PROMPTS.get(narrative, "")

    prompt = (
        "You are a world-class food photographer. Transform this food photo into a stunning, "
        "professional social media image. IMPORTANT: Keep the original dish/food exactly as it appears "
        "- do not change, remove, or alter the food itself. Only enhance the environment and presentation.\n\n"
        f"Style: {style_desc}\n"
    )

    if narrative_desc:
        prompt += f"Scene element: {narrative_desc}\n"

    prompt += (
        f"Target aspect ratio: {aspect_ratio}\n"
        "Output a single photorealistic, high-quality food photograph ready for Instagram."
    )

    return prompt
