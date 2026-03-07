Direct Context Photo Injection to Gemini (Multimodal)
Problem
Currently: context photo → Gemini describes it → text description → injected into prompt. The dish generator never "sees" the actual context photo. It only reads a (potentially vague) text description.

New Strategy
Send the context photo as a second PIL.Image directly to Gemini's generate_content():

python
# Before (text only)
contents=[prompt, dish_img]
# After (multimodal — 2 images)
contents=[prompt, dish_img, context_img]
The prompt uses relational instructions referencing both images instead of a text description.

Proposed Changes (4 backend files)
[MODIFY] 

routes.py
When context_photo_id is present, fetch the full image_url (the actual image data URI or URL), not just ai_description
Pass context_image_url (the raw image) to 

create_job()
 instead of context_description
[MODIFY] 

image_worker.py
Replace context_description: str with context_image_url: str | None
Download context image bytes (reuse 

_download_image()
)
Pass context_image_bytes to 

generate_food_image()
[MODIFY] 

gemini.py

generate_food_image()
: accept context_image_bytes: bytes | None
When present: open as PIL.Image, append to contents list
Pass a flag to 

build_prompt()
 indicating context image is present
[MODIFY] 

prompts.py

build_prompt()
: replace context_description param with has_context_image: bool
When True, inject relational prompt block referencing the second image:
VENUE VISUAL CONTEXT — MULTIMODAL REFERENCE:
The second image attached is a reference to the venue's visual identity.
Extract its textures, colors, lighting temperature, atmospheric qualities,
and surface materials. Integrate these elements into the background and
environmental elements of the food photograph. Generate realistic contact
shadows between the dish and the surface. Ensure reflections on cutlery
and sauces match the light sources visible in the context reference.
NOTE

commented:
The one who really needs to adapt in terms of 'Styling & Aesthetics', Lighting, Camera & Technical Specs' is the background image to 'our dish style prompt', remember? We're going to transform a mediocre photograph taken by a waiter or restaurant owner who knows nothing about photography into a 'Michelin Guide cover'

The old 

_analyze_scene()
 and 

analyze_context_photo()
 functions remain intact for future use (e.g., generating alt-text), but are no longer part of the generation pipeline.

Verification
Generate with a context photo selected → verify the dish background reflects the local's atmosphere
Generate without context photo → verify it still works normally (unchanged path)