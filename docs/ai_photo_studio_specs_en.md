# Technical Specifications: AI Photo Studio (Camera Module)

**Component**: `HosteleriaAI-PhotoStudio`
**Version**: 1.0
**Integration**: Google Vertex AI (Imagen 3 / Gemini Pro Vision)

---

## 1. Module Overview

The **AI Photo Studio** is a "Dead Simple" tool within the SaaS that allows restaurant owners to transform amateur photos of their dishes into high-quality marketing images. The goal is not just to "enhance" the photo, but to **recontextualize** it (change lighting and background) while maintaining the fidelity of the real dish.

## 2. User Flow (UX)

The flow consists of 4 linear steps (Wizard):

### Step 1: Capture / Input
*   **Interface**: Large central placeholder with a camera icon.
*   **Actions**:
    *   `Take Photo`: Opens the device's native camera (HTML5 Media Capture).
    *   `Gallery`: Opens the system file picker.
*   **Validation**: Basic quality check (prevent blurry or extremely dark images using a lightweight client library).

### Step 2: Format (Composition)
*   **Aspect Ratio Selector**: Large "Chip" style buttons.
    *   `1:1` (Instagram/Square) - *Default*
    *   `9:16` (Stories/TikTok)
    *   `4:5` (Vertical Feed)
    *   `3:2` (Web Card) - *Optimized for menu cards with text below*
    *   `16:9` (Web Hero Header)
*   **Action**: Simple visual crop if the original image doesn't fit.

### Step 3: Lighting Style
*   **Concept**: The user chooses the "atmosphere".
*   **Interface**: Horizontal carousel of example images (thumbnails).
*   **Logic**: Each thumbnail has an associated `prompt_modifier` metadata.
    *   *Option "Natural Light"* -> Prompt: `"soft natural lighting, window light, morning vibe, high key"`
    *   *Option "Intimate Dinner"* -> Prompt: `"dim candlelight, warm cinematic lighting, bokeh, moody low key"`
    *   *Option "Studio"* -> Prompt: `"professional studio strobe, sharp focus, vibrant colors, neutral background"`
    *   *Option "Golden Hour"* -> Prompt: `"sunset warm lighting, side lighting, lens flare, golden hour"`

### Step 4: Narrative (Storytelling - New Layer 2026)
*   **Concept**: Add a human or action element to provide authenticity ("Tactile Imperfection").
*   **Options**:
    *   **None** (Dish only)
    *   **Chef's Hand (Chef_Hand)**:
        *   *Visual*: Hand with real texture placing an ingredient.
        *   *Prompt Injection*: `"Chef's hand with real texture delicately placing a final ingredient, pinching motion, mastery, craftsmanship, directed authenticity"`
    *   **Waiter's Hand (Waiter_Hand)**:
        *   *Visual*: POV of waiter serving the dish.
        *   *Prompt Injection*: `"Waiter's hand presenting the dish in foreground, open palm, POV shot, hospitality, immediacy, 'this is for you' vibe"`
    *   **Action Pour (Action_Pour)**:
        *   *Visual*: Sauce or liquid falling with slight motion blur.
        *   *Prompt Injection*: `"High speed motion freeze or slight artistic motion blur of sauce/dust falling onto the dish, freshness, texture, appetizing, breaking the screen barrier"`

### Step 5: Context (Background)
*   **Concept**: The user decides *where* the dish is.
*   **Options**:
    1.  **Preset**: High-quality generic backgrounds (rustic wood, marble, slate).
    2.  **"My Restaurant" (Killer Feature)**:
        *   User uploads photos of their own venue (corners, nice empty tables).
        *   These photos are saved in their asset library (`Create Asset` in Google Cloud).
        *   When selected, it acts as a reference image for *inpainting* or background generation.

### Step 6: Generation & Output
*   "Magic" Button (Generate).
*   Animated Loader (e.g., chef cooking).
*   **Preview**: Shows result. "Before / After" slider for WOW effect.
*   **Actions**:
    *   `Save`: Adds to SaaS library.
    *   `Download`: Save to local device.
    *   `Share`: Native Web Share API.

---

## 3. Technical Specifications (Backend & AI)

### 3.1 Image Processing Pipeline

The system will use a **Composition + Generative** architecture to maximize control.

**Suggested Stack:**
*   **Orchestration**: Python (FastAPI/Celery) or Edge Functions (if timeout allows).
*   **AI Provider**: Google Vertex AI.

**Step-by-Step Algorithm:**

1.  **Segmentation (Background Removal)**:
    *   Use a segmentation model to separate the "Dish" (Foreground) from the "dirty" original background.
    *   *Tool*: `rembg` (Python) or Vision API segmentation.
    *   *Output*: RGBA mask of the dish.

2.  **Composition (Scene Assembly)**:
    *   If user chose a "My Restaurant" background:
        *   Scale and position the Dish (Foreground) over the Restaurant photo (Background).
        *   Adjust perspective if possible (basic).
    *   If Aspect Ratio differs: Perform `Outpainting` (generative fill) for edges if the crop cuts too much.

3.  **Generative Harmonization (Img2Img)**:
    *   This is where **Imagen 3** or **Gemini Pro Vision** comes in.
    *   **Input Image**: The raw composition (Cutout Dish pasted over Background).
    *   **Prompt**: Dynamically constructed.
        > `Subject`: "A delicious photography of [Detected Food Name], centered. [Narrative Prompt Injection]"
        > `Lighting`: [Inserted Prompt from Step 3]
        > `Context`: "placed on a table in a restaurant with [Description of User Background]"
        > `Technical`: "8k, professional food photography, highly detailed, appetizing, michelin star plating."
        > `Negative Prompt`: "deformed, blurry, text, watermark, bad composition, ugly food, raw meat, dirty dishes."
    *   **Strength (Denoising Strength)**:
        *   **Low (0.3 - 0.4)**: To maintain exact fidelity of the real dish (we don't want a burger turning into a taco). We only want to integrate lighting and shadows of the dish with the new background.

### 3.2 Data Structure (JSON)

**Example Request to Generation Backend:**

```json
{
  "user_id": "tenant_123",
  "original_image_url": "gs://bucket/raw/input.jpg",
  "aspect_ratio": "3:2",
  "lighting_style_id": "candlelight_01",
  "narrative_id": "action_pour",
  "background_mode": "custom_upload",
  "custom_background_url": "gs://bucket/context/corner_table.jpg",
  "prompt_modifiers": {
    "lighting": "warm candlelight, bokeh, moody",
    "narrative": "High speed motion freeze of sauce pour...",
    "strength": 0.35
  }
}
```

### 3.3 Google API Integration Requirements

*   **Google Cloud Storage**: Separate buckets for `temp-uploads` (24h TTL) and `final-assets`.
*   **Vertex AI Vision**: For the model call.
    *   *Model*: `imagegeneration@006` (Imagen 3) or `gemini-1.5-pro` (if using multimodality to first describe the dish textually then generate).

---

## 4. Developer Considerations

1.  **Latency**: Image generation takes time (5-15 seconds). UI *must* handle optimistic loading states or fun messages ("The chef is plating...").
2.  **Costs**: Each generation has a cost. Implement daily limits per subscription tier (e.g., 20 images/month on Basic plan).
3.  **Security**: Validate uploaded images for NSFW content before sending to Vertex AI (Google Safety Filters usually handle this, but client-side validation helps).
4.  **Fidelity**: Calibrating the `strength` parameter in Img2Img is critical.
    *   Too high = Dish changes (customer complains "that's not my stew").
    *   Too low = Dish looks like a bad Photoshop job pasted on the background.
    *   *Solution*: Advanced "Creativity" slider (hidden by default) or A/B testing to find the "Sweet Spot".
