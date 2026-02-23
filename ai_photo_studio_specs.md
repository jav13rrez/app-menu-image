# Especificaciones Técnicas: AI Photo Studio (Módulo de Cámara)

**Componente**: `HosteleriaAI-PhotoStudio`
**Versión**: 1.0
**Integración**: Google Vertex AI (Imagen 3 / Gemini Pro Vision)

---

## 1. Visión General del Módulo

El **AI Photo Studio** es una herramienta "Dead Simple" dentro del SaaS que permite a los hosteleros transformar fotos amateur de sus platos en imágenes de marketing de alta calidad. El objetivo no es solo "mejorar" la foto, sino **recontextualizarla** (cambiar iluminación y fondo) manteniendo la fidelidad del plato real.

## 2. Flujo de Usuario (UX)

El flujo consta de 4 pasos lineales (Wizard):

### Paso 1: Captura / Input
*   **Interfaz**: Placeholder central grande con icono de cámara.
*   **Acciones**:
    *   `Tomar Foto`: Abre la cámara nativa del dispositivo (HTML5 Media Capture).
    *   `Galería`: Abre el selector de archivos del sistema.
*   **Validación**: Comprobación básica de calidad (evitar imágenes borrosas o demasiado oscuras usando una librería cliente ligera).

### Paso 2: Formato (Composition)
*   **Selector de Aspect Ratio**: Botones grandes tipo "Chips".
    *   `1:1` (Instagram/Square) - *Default*
    *   `9:16` (Stories/TikTok)
    *   `4:5` (Feed Vertical)
    *   `3:2` (Web Card) - *Ideal para menús con texto inferior*
    *   `16:9` (Web Hero Header)
*   **Acción**: Crop visual sencillo si la imagen original no encaja.

### Paso 3: Iluminación (Lighting Style)
*   **Concepto**: El usuario elige la "atmósfera".
*   **Interfaz**: Carrusel horizontal de imágenes de ejemplo (thumbnails).
*   **Lógica**: Cada thumbnail tiene un metadato `prompt_modifier` asociado.
    *   *Opción "Luz Natural"* -> Prompt: `"soft natural lighting, window light, morning vibe, high key"`
    *   *Opción "Cena Intima"* -> Prompt: `"dim candlelight, warm cinematic lighting, bokeh, moody low key"`
    *   *Opción "Estudio"* -> Prompt: `"professional studio strobe, sharp focus, vibrant colors, neutral background"`
    *   *Opción "Golden Hour"* -> Prompt: `"sunset warm lighting, side lighting, lens flare, golden hour"`

### Paso 4: Narrativa (Storytelling - Nueva Capa 2026)
*   **Concepto**: Añadir un elemento humano o de acción para dar autenticidad ("Imperfección Táctil").
*   **Opciones**:
    *   **Ninguna** (Solo el plato)
    *   **Mano de Chef (Chef_Hand)**:
        *   *Visual*: Mano con textura real colocando un ingrediente.
        *   *Prompt Injection*: `"Chef's hand with real texture delicately placing a final ingredient, pinching motion, mastery, craftsmanship, directed authenticity"`
    *   **Mano de Camarero (Waiter_Hand)**:
        *   *Visual*: Punto de vista (POV) de camarero sirviendo.
        *   *Prompt Injection*: `"Waiter's hand presenting the dish in foreground, open palm, POV shot, hospitality, immediacy, 'this is for you' vibe"`
    *   **Acción / Vertido (Action_Pour)**:
        *   *Visual*: Salsa o líquido cayendo con ligero desenfoque de movimiento.
        *   *Prompt Injection*: `"High speed motion freeze or slight artistic motion blur of sauce/dust falling onto the dish, freshness, texture, appetizing, breaking the screen barrier"`

### Paso 5: Contexto (Background)
*   **Concepto**: El usuario decide *dónde* está el plato.
*   **Opciones**:
    1.  **Preset**: Fondos genéricos de alta calidad (madera rústica, mármol, pizarra).
    2.  **"Mi Restaurante" (Killer Feature)**:
        *   El usuario sube fotos de su propio local (rincones, mesas vacías bonitas).
        *   Estas fotos se guardan en su librería de assets (`Create Asset` en Google Cloud).
        *   Al seleccionar una, actúa como imagen de referencia para el *inpainting* o generación de fondo.

### Paso 6: Generación y Salida
*   Botón "Magia" (Generar).
*   Loader animado (ej: chef cocinando).
*   **Preview**: Muestra resultado. Slider "Antes / Después" para efecto WOW.
*   **Acciones**:
    *   `Guardar`: Añade a la librería del SaaS.
    *   `Descargar`: Guarda en dispositivo local.
    *   `Compartir`: Native Web Share API.

---

## 3. Especificaciones Técnicas (Backend & AI)

### 3.1 Pipeline de Procesamiento de Imagen

El sistema utilizará una arquitectura de **Composición + Generativa** para maximizar el control.

**Stack Sugerido:**
*   **Orquestación**: Python (FastAPI/Celery) o Edge Functions (si el timeout lo permite).
*   **AI Provider**: Google Vertex AI.

**Algoritmo Paso a Paso:**

1.  **Segmentación (Background Removal)**:
    *   Usar modelo de segmentación para separar el "Plato" (Foreground) del fondo original "sucio".
    *   *Herramienta*: `rembg` (Python) o Vision API segmentation.
    *   *Output*: Máscara RGBA del plato.

2.  **Composición (Scene Assembly)**:
    *   Si el usuario eligió un fondo de "Mi Restaurante":
        *   Escalar y posicionar el Plato (Foreground) sobre la foto del Restaurante (Background).
        *   Ajustar perspectiva si es posible (básico).
    *   Si es Aspect Ratio diferente: Realizar `Outpainting` (relleno generativo) para los bordes si el crop recorta demasiado.

3.  **Armonización Generativa (Img2Img)**:
    *   Aquí entra **Imagen 3** o **Gemini Pro Vision**.
    *   **Input Image**: La composición cruda (Plato recortado pegado sobre Fondo).
    *   **Prompt**: Construido dinámicamente.
        > `Subject`: "A delicious photography of [Detected Food Name], centered. [Narrative Prompt Injection]"
        > `Lighting`: [Insercción del Prompt del Paso 3]
        > `Context`: "placed on a table in a restaurant with [Description of User Background]"
        > `Technical`: "8k, professional food photography, highly detailed, appetizing, michelin star plating."
        > `Negative Prompt`: "deformed, blurry, text, watermark, bad composition, ugly food, raw meat, dirty dishes."
    *   **Strength (Denoising Strength)**:
        *   **Bajo (0.3 - 0.4)**: Para mantener la fidelidad exacta del plato real (no queremos que una hamburguesa se convierta en un taco). Solo queremos integrar la luz y las sombras del plato con el nuevo fondo.

### 3.2 Estructura de Datos (JSON)

**Ejemplo de Request al Backend de Generación:**

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

### 3.3 Requisitos de Integración Google API

*   **Google Cloud Storage**: Buckets separadas para `temp-uploads` (borrado en 24h) y `final-assets`.
*   **Vertex AI Vision**: Para la llamada al modelo.
    *   *Model*: `imagegeneration@006` (Imagen 3) o `gemini-1.5-pro` (si usamos multimodalidad para primero describir el plato textualmente y luego generar).

---

## 4. Consideraciones para el Desarrollador

1.  **Latencia**: La generación de imagen tarda (5-15 segundos). La UI *debe* manejar estados de carga optimistas o mensajes divertidos ("El chef está emplatando...").
2.  **Costes**: Cada generación tiene un coste. Implementar límites diarios por nivel de suscripción (ej: 20 imágenes/mes en plan Básico).
3.  **Seguridad**: Validar que las imágenes subidas no contengan contenido NSFW antes de enviarlas a Vertex AI (Safety Filters de Google suelen hacerlo, pero validar en cliente ayuda).
4.  **Fidelidad**: Es crítico calibrar el parámetro de `strength` en el Img2Img.
    *   Muy alto = El plato cambia (el cliente se quejará de que "ese no es mi estofado").
    *   Muy bajo = El plato parece un "pegote" de Photoshop mal hecho sobre el fondo.
    *   *Solución*: Un pequeño slider avanzado "Creatividad" (oculto por defecto) o A/B testing para encontrar el "Sweet Spot".

