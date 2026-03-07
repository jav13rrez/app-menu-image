# **Análisis de Arquitectura y Optimización Multimodal del Pipeline de Inyección de Contexto Visual en Sistemas de Generación de Imágenes Culinarias**

La evolución de los modelos de lenguaje de gran tamaño (LLM) hacia motores de razonamiento genuinamente multimodales ha transformado la arquitectura de las aplicaciones de inteligencia artificial generativa. En el contexto de la creación automatizada de contenido visual para el sector gastronómico, la capacidad de anclar las imágenes generadas a una identidad de marca o a la atmósfera física de un establecimiento es un requisito crítico para la viabilidad comercial del producto. El presente informe técnico analiza exhaustivamente el pipeline actual de inyección de contexto visual, identifica sus vulnerabilidades sistémicas y evalúa la viabilidad de una transición hacia un modelo de inyección multimodal directo basado en el ecosistema Gemini 3, específicamente los modelos denominados bajo la nomenclatura "Nano Banana".

## **Desglose Técnico del Pipeline de Contexto Visual Actual**

El flujo de trabajo actual se distribuye a través de una cadena de siete archivos interdependientes que gestionan la transición de una imagen de referencia desde la interfaz del usuario hasta la generación final del activo visual. Esta arquitectura, aunque modular, presenta una dependencia crítica de una representación textual intermedia que actúa como cuello de botella semántico.

### **Interacción en el Frontend y Persistencia de Estado**

El proceso se inicia en la capa de presentación mediante el componente src/components/ContextPhotoPicker.tsx. En este punto, el usuario interactúa con la plataforma para cargar o seleccionar una fotografía que define la "Identidad Visual" del local. La función handleSelect() es la encargada de capturar el identificador único del recurso seleccionado. Este ID se propaga inmediatamente al almacén de estado global definido en src/store/wizard.ts, donde las líneas L24 y L89 gestionan la propiedad selectedContextPhotoId. Este diseño desacoplado permite que la selección del contexto sea persistente a lo largo de los diferentes pasos del asistente de configuración del plato.

Cuando el usuario finaliza la configuración y procede a la generación, el componente src/components/StepLoading.tsx actúa como el orquestador de la petición de red. En su línea L103, construye el cuerpo de la solicitud POST dirigida al endpoint /api/v1/generate, inyectando el context\_photo\_id. Esta estructura de datos es la que permite al backend vincular la solicitud de generación con los activos de marca previamente procesados.

### **Orquestación en el Backend y Recuperación de Metadatos**

Al recibir la petición, el backend inicia el proceso de recuperación en backend/app/api/routes.py. Entre las líneas L50 y L70, el sistema discrimina según el entorno de ejecución. En entornos de desarrollo, se utiliza un objeto local denominado \_dev\_photos importado desde app.api.context\_photos. El sistema realiza una búsqueda mediante un iterador para localizar el objeto cuyo ID coincida con el proporcionado por el frontend:

Python

\# Lógica de búsqueda en routes.py  
from app.api.context\_photos import \_dev\_photos  
dev\_photo \= next((p for p in \_dev\_photos if p\["id"\] \== req.context\_photo\_id), None)  
if dev\_photo:  
    context\_description \= dev\_photo.get("ai\_description")

En entornos de producción, este proceso se delega a una base de datos externa (Supabase). El elemento fundamental aquí es que el backend no recupera la imagen en sí, sino una clave denominada ai\_description. Esta descripción textual es el resultado de un pre-procesamiento realizado en el momento de la carga de la foto original en context\_photos.py. El endpoint POST /api/v1/context-photos/ invoca a la función \_analyze\_scene() (Línea 80), la cual utiliza una llamada previa a Gemini para traducir la atmósfera visual en un bloque de texto descriptivo.

### **Procesamiento Asíncrono e Inyección de Prompts**

Una vez recuperada la descripción, el flujo se traslada a backend/app/workers/image\_worker.py, donde entre las líneas L155 y L163, el parámetro context\_description se pasa a la función de generación. Finalmente, el servicio backend/app/services/gemini.py utiliza esta cadena de texto para alimentar la función build\_prompt() ubicada en backend/app/services/prompts.py.

El sistema inyecta un bloque específico denominado VENUE VISUAL CONTEXT en el prompt final enviado al modelo de generación (L217-227). La instrucción solicita explícitamente al modelo extraer texturas, colores y atmósfera de la descripción proporcionada e integrarlos sutilmente en el fondo y los elementos ambientales de la imagen final.

## **Diagnóstico de Vulnerabilidades y Cuellos de Botella Semánticos**

A pesar de la robustez arquitectónica de la cadena de archivos, el análisis técnico revela dos puntos de falla fundamentales que comprometen la fidelidad del resultado visual.

### **El Riesgo de la Representación Textual Pobre**

El primer punto crítico reside en la función \_analyze\_scene() dentro de context\_photos.py. Esta función depende enteramente de la disponibilidad de una clave de API válida y de la capacidad del modelo para generar una descripción precisa. Se ha detectado que, si la configuración del entorno (.env) es incorrecta o falta la GEMINI\_API\_KEY, el sistema devuelve un marcador de posición genérico: "Espacio del restaurante (descripción pendiente de análisis IA)".

Desde una perspectiva de ingeniería de prompts, enviar este placeholder al modelo de generación equivale a no enviar información alguna. El modelo generador, ante una instrucción tan vaga, recurre a sus pesos de entrenamiento internos, resultando en fondos genéricos que no guardan relación con el local del usuario. Incluso con una clave válida, la traducción de una imagen a texto es una operación de pérdida de información. Conceptos como "luz cálida" o "paredes de ladrillo" pueden ser interpretados de miles de formas distintas, perdiendo la esencia visual específica que define la marca.1

### **La Ausencia de Anclaje Multimodal Directo**

El problema fundamental es que el modelo generador (Gemini o Imagen) no está "viendo" la imagen de contexto; solo está leyendo una interpretación subjetiva de la misma. Actualmente, la arquitectura se comporta como un sistema de *Text-to-Image* puro, donde la referencia visual ha sido aplanada en una secuencia de tokens de texto.

Los modelos modernos del ecosistema Gemini 3 (Nano Banana) han sido diseñados para ser multimodales de forma nativa desde su concepción.3 Esto significa que pueden razonar simultáneamente sobre múltiples entradas de datos, incluyendo texto e imágenes. Al no enviar la imagen real como segunda referencia, el sistema está desaprovechando la capacidad del modelo para realizar una transferencia de estilo o una composición avanzada que respete la geometría y la colorimetría real del local.1

## **Evaluación de la Sugerencia de Cambio: Hacia la Inyección Multimodal**

La sugerencia de modificar gemini.py para enviar la imagen de contexto directamente a Gemini como una segunda imagen de referencia es técnicamente sólida y se alinea con las mejores prácticas actuales en el desarrollo de aplicaciones de IA generativa. Este cambio transformaría el pipeline de un modelo basado en descripciones a un flujo de trabajo de *Image-plus-Image-to-Image*.

### **Ventajas de la Inyección Directa de Referencias Visuales**

La integración de la imagen original en la llamada de generación ofrece beneficios inmediatos en términos de fidelidad y control creativo.

* **Fidelidad Atmosférica**: El modelo puede extraer directamente la paleta de colores, la temperatura de la luz y las texturas de los materiales (madera, mármol, metal) sin la mediación de un lenguaje descriptivo potencialmente impreciso.1  
* **Consistencia de Sujeto y Estilo**: Al utilizar tipos de referencia específicos como REFERENCE\_TYPE\_STYLE, el sistema puede forzar al modelo a que la nueva imagen generada "herede" la estética de la foto del local.7  
* **Reducción de Latencia en el Pre-procesamiento**: Se eliminaría la necesidad de realizar una llamada previa a Gemini solo para "describir" la imagen, simplificando el flujo de trabajo y reduciendo el consumo de tokens de entrada iniciales.

### **Modelos y Capacidades del Ecosistema Nano Banana**

Para implementar este cambio, es crucial seleccionar el modelo adecuado dentro de la familia Gemini 3/Imagen 3\. El ecosistema ofrece diversas variantes optimizadas para diferentes perfiles de rendimiento y costo.

| Modelo ID | Nombre Comercial | Optimización Principal | Características Clave |
| :---- | :---- | :---- | :---- |
| gemini-3.1-flash-image-preview | Nano Banana 2 | Velocidad y Volumen | Soporta hasta 14 imágenes de referencia; alta eficiencia.3 |
| gemini-3-pro-image-preview | Nano Banana Pro | Calidad y Razonamiento | Incluye modo "Thinking"; ideal para instrucciones complejas y texto de alta fidelidad.3 |
| gemini-2.5-flash-image | Nano Banana | Latencia Mínima | Optimizado para tareas de alta frecuencia y baja latencia.3 |

La recomendación técnica es migrar hacia gemini-3.1-flash-image-preview (Nano Banana 2), ya que permite combinar hasta 10 imágenes de objetos y 4 de personajes, proporcionando un margen amplio para inyectar tanto el contexto del local como posibles referencias específicas del plato.1

## **Especificaciones Técnicas para la Nueva Implementación**

La transición hacia un modelo multimodal requiere una re-ingeniería de la capa de servicios y del manejo de datos binarios en el backend. A continuación, se detallan los requisitos técnicos y las fórmulas de procesamiento necesarias.

### **Gestión de Tokens y Resolución de Medios**

La inyección de imágenes en una solicitud multimodal consume tokens de entrada de una manera distinta al texto. Gemini utiliza un sistema de mosaicos para procesar imágenes de alta resolución. Para el cálculo del consumo de tokens, se aplica la siguiente lógica: cualquier imagen con ambas dimensiones menores o iguales a 384 píxeles cuenta como 258 tokens.12 Para imágenes de mayor tamaño, el modelo las divide en mosaicos de ![][image1] píxeles, donde cada mosaico consume otros 258 tokens.12

Se puede optimizar este consumo mediante el parámetro media\_resolution. Para un fondo decorativo o atmosférico, una resolución media o baja es generalmente suficiente para capturar la esencia visual sin disparar el costo de la solicitud.

| Configuración de Resolución | Tokens Aproximados | Caso de Uso Recomendado |
| :---- | :---- | :---- |
| media\_resolution\_low | 258 | Captura de atmósfera y estilo general.10 |
| media\_resolution\_medium | 560 | Equilibrio para comprensión de documentos o detalles moderados.10 |
| media\_resolution\_high | 1120 | Necesario para OCR fino o texturas críticas.10 |

### **Implementación del Tipado de Referencias en la API**

Al enviar múltiples imágenes, la API de Vertex AI permite clasificar cada referencia mediante el enumerado ReferenceType. Esta clasificación es vital para que el modelo entienda qué parte de la imagen de contexto debe priorizar.13

1. **REFERENCE\_TYPE\_STYLE**: Esta es la opción más adecuada para la inyección de contexto visual del local. Indica al modelo que debe utilizar la estética (colores, iluminación, "vibe") de la imagen de referencia para guiar la generación, sin necesariamente copiar los objetos literales de la misma.7  
2. **REFERENCE\_TYPE\_SUBJECT**: Se utilizaría si se desea que un elemento específico del local (como una vajilla de autor o un logotipo físico) aparezca de forma prominente y consistente en el plato generado.13  
3. **REFERENCE\_TYPE\_RAW**: Se utiliza principalmente en casos de edición de imagen sobre imagen (Inpainting/Outpainting), donde la imagen original sirve como lienzo base.13

### **Requisitos del Lado del Cliente y Envío de Binarios**

El frontend debe estar preparado para manejar el envío de datos en formato Base64 o mediante la File API de Gemini. El uso de la File API es preferible para archivos grandes o para imágenes que se reutilizarán en múltiples solicitudes de generación, ya que reduce el tamaño total de la carga útil del mensaje (inlineData está limitado a 20MB por solicitud).16

En React, el componente ContextPhotoPicker puede beneficiarse de bibliotecas como react-multiple-image-input para gestionar la selección y pre-procesamiento de las imágenes antes de su envío al servidor.17 Es imperativo asegurar que las imágenes estén correctamente rotadas y no presenten desenfoques excesivos, ya que esto impacta directamente en la calidad del análisis multimodal del modelo.16

## **Optimización de Prompts Multimodales**

Con la nueva arquitectura, la ingeniería de prompts evoluciona hacia una estructura de "fórmula de relación". En lugar de describir el local, el prompt instruye al modelo sobre cómo interactuar con las imágenes proporcionadas.

### **Fórmulas de Construcción de Prompts**

La documentación de Nano Banana 2 sugiere una estructura narrativa para maximizar la adherencia al contexto visual: \[Imágenes de referencia\] \+ \[Instrucciones de relación\] \+ \[Nuevo escenario\].

Para el caso de uso gastronómico, un prompt optimizado seguiría este patrón: "Utilizando la imagen como guía de estilo visual y atmósfera, genera una fotografía profesional de un plato de \[nombre\_del\_plato\]. Asegúrate de que la iluminación y la textura de la mesa coincidan con el entorno mostrado en. El plato debe estar centrado, con una profundidad de campo suave que desenfoque el fondo inspirado en el local.".1

Es importante notar el uso de marcadores como \`\` o \[referenceId\]. Esta sintaxis vincula explícitamente fragmentos del texto con las partes de imagen adjuntas en el payload de la API, permitiendo un control granular sobre qué imagen influye en qué parte de la escena.13

### **Consideraciones de Física de Interacción y Composición**

Un desafío común en la generación de imágenes con referencias es la falta de "conexión" física entre el sujeto generado (el plato) y el fondo de referencia. Los modelos de la serie 3 de Gemini incluyen capacidades de razonamiento espacial mejoradas que pueden mitigarse mediante instrucciones específicas en el prompt 20:

* **No Hovering**: Instruir al modelo para que genere sombras de contacto realistas entre el plato y la superficie de la mesa extraída del contexto.  
* **Atmósfera Compartida**: Solicitar que los reflejos en los cubiertos o en la salsa del plato reflejen las fuentes de luz visibles en la imagen de contexto del local.  
* **Micro-detalles**: Pedir la inclusión de elementos ambientales menores (como una servilleta o un vaso de agua) que sigan el estilo de la referencia.1

## **Consideraciones de Seguridad y Ética en la Generación**

La implementación de capacidades generativas avanzadas conlleva una responsabilidad técnica en cuanto a la procedencia y el marcado de los activos producidos.

### **Marcas de Agua Digitales con SynthID**

Todas las imágenes generadas mediante los modelos Nano Banana 2 y Nano Banana Pro integran automáticamente la tecnología **SynthID** de Google DeepMind.9 Esta marca de agua es invisible al ojo humano pero persistente a nivel de píxel, lo que permite verificar la autenticidad de la imagen incluso si se realizan recortes o ediciones posteriores. Esta característica es fundamental para cumplir con las normativas de transparencia en la inteligencia artificial y para proteger la integridad de la marca del establecimiento.

### **Filtros de Seguridad y Generación de Personas**

El pipeline debe configurar adecuadamente los parámetros de seguridad para evitar la generación de contenido no deseado. En el sector gastronómico, se suele preferir la ausencia de rostros humanos identificables en los fondos para no distraer del producto principal.

* **person\_generation**: Se recomienda configurar este parámetro en "dont\_allow" para bloquear la inclusión de personas en las imágenes generadas, manteniendo el enfoque exclusivamente en el activo culinario y el entorno.23  
* **safety\_filter\_level**: Un nivel de bloqueo medio-alto ("block\_medium\_and\_above") es el estándar recomendado para aplicaciones comerciales, asegurando que los resultados se mantengan dentro de los valores de marca del cliente.22

## **Hoja de Ruta Sugerida para la Transición Técnica**

Para ejecutar el cambio propuesto de manera exitosa, se recomienda seguir una progresión de fases que minimice el riesgo de regresiones en la calidad del servicio.

### **Fase 1: Auditoría y Refinamiento del Pre-procesamiento (Corto Plazo)**

Antes de eliminar el flujo basado en texto, se debe optimizar la función \_analyze\_scene() en context\_photos.py. Es imperativo que el sistema maneje los errores de API de forma explícita y no mediante cadenas de texto vacías. Se debe ajustar el prompt de análisis para que Gemini extraiga detalles técnicos específicos (temperatura de color en Kelvin, materiales de superficie, tipos de fuentes de luz) que puedan ser más útiles para el generador final que una descripción genérica de la "atmósfera".

### **Fase 2: Implementación de Multimodalidad en Entornos de Desarrollo**

Modificar backend/app/api/routes.py y backend/app/services/gemini.py para permitir el paso opcional de bytes de imagen. El worker debe ser capaz de procesar tanto la descripción textual como el recurso binario. En esta etapa, se debe probar la efectividad de los diferentes ReferenceType (STYLE vs RAW) utilizando un conjunto de pruebas de 50 imágenes de locales reales.

### **Fase 3: Migración a la File API y Almacenamiento Persistente (Producción)**

Dado que las fotos del local son activos semi-estáticos, subirlas a la File API de Gemini ofrece una ventaja de rendimiento significativa. Las imágenes se pueden cargar una vez al día o en el momento de la configuración de la marca y luego referenciarse por su URI en cada solicitud de generación de platos. Esto reduce el ancho de banda necesario para cada llamada a la API y mejora los tiempos de respuesta percibidos por el usuario final.16

### **Fase 4: Despliegue de Prompts Basados en Referencias**

Actualizar prompts.py para inyectar la sintaxis de enlace visual (, ). Se debe realizar una prueba A/B para comparar los resultados de la inyección de texto pura frente a la inyección de imagen real. Las métricas de éxito deben incluir la coherencia del color de fondo con el local real y la reducción de artefactos visuales en la integración plato-entorno.

## **Conclusión y Recomendaciones Finales**

La arquitectura actual del sistema de inyección de contexto visual cumple con los estándares de diseño de software modular, pero flaquea en su capacidad de transferencia de conocimiento visual debido a su excesiva dependencia de la abstracción textual. La limitación identificada en la función \_analyze\_scene()—donde la ausencia de una clave de API anula por completo la capacidad de contextualización del sistema—es un síntoma de un diseño que no aprovecha plenamente las capacidades multimodales nativas de los modelos de última generación.

La transición hacia un modelo de inyección directa de imágenes de referencia, apoyada en el ecosistema Nano Banana 2, es la evolución lógica y necesaria para el producto. Esta estrategia no solo mitigará los fallos actuales derivados de descripciones pobres o genéricas, sino que elevará la calidad estética de los resultados a un nivel de fidelidad fotográfica difícil de alcanzar mediante instrucciones textuales.

Al adoptar la inyección multimodal directa, el sistema ganará en precisión colorimétrica, consistencia de texturas y realismo atmosférico. La recomendación final de ingeniería es proceder con el cambio en gemini.py, integrando el manejo de binarios de imagen y actualizando el motor de prompts para utilizar enlaces explícitos de referencia. Esta transformación técnica posicionará a la plataforma como una herramienta de vanguardia en la creación de activos visuales para la industria gastronómica, garantizando que cada plato generado respire la identidad única de cada establecimiento.

#### **Obras citadas**

1. Ultimate prompting guide for Nano Banana | Google Cloud Blog, fecha de acceso: marzo 7, 2026, [https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana)  
2. How to prompt Gemini 2.5 Flash Image Generation for the best results, fecha de acceso: marzo 7, 2026, [https://developers.googleblog.com/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/](https://developers.googleblog.com/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/)  
3. Nano Banana image generation \- Gemini API | Google AI for Developers, fecha de acceso: marzo 7, 2026, [https://ai.google.dev/gemini-api/docs/image-generation](https://ai.google.dev/gemini-api/docs/image-generation)  
4. Mastering the Gemini 3 API: Architecting Next-Gen Multimodal AI Applications \- DZone, fecha de acceso: marzo 7, 2026, [https://dzone.com/articles/mastering-the-gemini-3-api-architecting-next-gen-ai](https://dzone.com/articles/mastering-the-gemini-3-api-architecting-next-gen-ai)  
5. How to create effective image prompts with Nano Banana \- Google DeepMind, fecha de acceso: marzo 7, 2026, [https://deepmind.google/models/gemini-image/prompt-guide/](https://deepmind.google/models/gemini-image/prompt-guide/)  
6. AI Prompts for Portraits: 20 Google Gemini Cinematic Styles \- 121clicks, fecha de acceso: marzo 7, 2026, [https://121clicks.com/inspirations/google-gemini-ai-photo-prompts/](https://121clicks.com/inspirations/google-gemini-ai-photo-prompts/)  
7. Style customization | Generative AI on Vertex AI \- Google Cloud Documentation, fecha de acceso: marzo 7, 2026, [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/style-customization](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/style-customization)  
8. Package google.cloud.aiplatform.v1.schema.predict.instance | Generative AI on Vertex AI, fecha de acceso: marzo 7, 2026, [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rpc/google.cloud.aiplatform.v1/schema/predict.instance](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rpc/google.cloud.aiplatform.v1/schema/predict.instance)  
9. Gemini 3.1 Flash Image (Nano Banana 2\) \- Google AI Studio, fecha de acceso: marzo 7, 2026, [https://aistudio.google.com/models/gemini-3-1-flash-image](https://aistudio.google.com/models/gemini-3-1-flash-image)  
10. Gemini 3 Developer Guide | Gemini API \- Google AI for Developers, fecha de acceso: marzo 7, 2026, [https://ai.google.dev/gemini-api/docs/gemini-3](https://ai.google.dev/gemini-api/docs/gemini-3)  
11. Learn about supported models | Firebase AI Logic \- Google, fecha de acceso: marzo 7, 2026, [https://firebase.google.com/docs/ai-logic/models](https://firebase.google.com/docs/ai-logic/models)  
12. Understand and count tokens | Gemini API | Google AI for Developers, fecha de acceso: marzo 7, 2026, [https://ai.google.dev/gemini-api/docs/tokens](https://ai.google.dev/gemini-api/docs/tokens)  
13. Customize images | Generative AI on Vertex AI \- Google Cloud Documentation, fecha de acceso: marzo 7, 2026, [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-customization](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api-customization)  
14. ReferenceType | Generative AI on Vertex AI \- Google Cloud Documentation, fecha de acceso: marzo 7, 2026, [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/Shared.Types/ReferenceType](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/reference/rest/Shared.Types/ReferenceType)  
15. Subject customization | Generative AI on Vertex AI \- Google Cloud Documentation, fecha de acceso: marzo 7, 2026, [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/subject-customization](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/subject-customization)  
16. Image understanding | Gemini API \- Google AI for Developers, fecha de acceso: marzo 7, 2026, [https://ai.google.dev/gemini-api/docs/image-understanding](https://ai.google.dev/gemini-api/docs/image-understanding)  
17. codenaz/react-multiple-image-input: A simple react package for easily cropping and uploading multiple images using a fancy component \- GitHub, fecha de acceso: marzo 7, 2026, [https://github.com/codenaz/react-multiple-image-input](https://github.com/codenaz/react-multiple-image-input)  
18. Customize images based on a control using Imagen | Firebase AI Logic, fecha de acceso: marzo 7, 2026, [https://firebase.google.com/docs/ai-logic/edit-images-imagen-controlled-customization](https://firebase.google.com/docs/ai-logic/edit-images-imagen-controlled-customization)  
19. Customize images based on a specified subject using Imagen | Firebase AI Logic, fecha de acceso: marzo 7, 2026, [https://firebase.google.com/docs/ai-logic/edit-images-imagen-subject-customization](https://firebase.google.com/docs/ai-logic/edit-images-imagen-subject-customization)  
20. Best practices for Multi-Subject Pose Transfer and Interaction Physics using Gemini API?, fecha de acceso: marzo 7, 2026, [https://support.google.com/gemini/thread/402772755/best-practices-for-multi-subject-pose-transfer-and-interaction-physics-using-gemini-api?hl=en](https://support.google.com/gemini/thread/402772755/best-practices-for-multi-subject-pose-transfer-and-interaction-physics-using-gemini-api?hl=en)  
21. Nano Banana 2: Combining Pro capabilities with lightning-fast speed, fecha de acceso: marzo 7, 2026, [https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/](https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/)  
22. A developer's guide to Imagen 3 on Vertex AI | Google Cloud Blog, fecha de acceso: marzo 7, 2026, [https://cloud.google.com/blog/products/ai-machine-learning/a-developers-guide-to-imagen-3-on-vertex-ai](https://cloud.google.com/blog/products/ai-machine-learning/a-developers-guide-to-imagen-3-on-vertex-ai)  
23. Generate images using Imagen | Gemini API | Google AI for Developers, fecha de acceso: marzo 7, 2026, [https://ai.google.dev/gemini-api/docs/imagen](https://ai.google.dev/gemini-api/docs/imagen)  
24. Image generation API \- Vertex AI \- Google Cloud Documentation, fecha de acceso: marzo 7, 2026, [https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/model-reference/imagen-api)  
25. Gemini API: File API Quickstart \- Colab \- Google, fecha de acceso: marzo 7, 2026, [https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/File\_API.ipynb](https://colab.research.google.com/github/google-gemini/cookbook/blob/main/quickstarts/File_API.ipynb)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAXCAYAAACYuRhEAAAEbElEQVR4Xu2YW6hVVRSGfymlKAxMu2F4oQuZUdRDFGkYFfpQBAlFSQQ9KKlBRUUhIYVU+hIiiRZ2IwMTI0LoRkhBBAqlqEkpaAg+hAZBDxJdxrfHGq4551p7n92R49P64efsPddYa435z3+MOfeROnTo0KHDSJhvfM8423hpwYuN4+vQHq42rjZuNN5vPCu/rHOND8mvEzfLOC6LGHssN75qvFLNOV2kPGdyu9m41viGcW41liKd8yLjefllx3PGf/vwuPGaKg5BVxh3Gm8yzjR+alxSXQcXGLcZH5Enfb3xG+PTaiY3lnhXzbkE9xknV3EI8rbxY/k8rzXuMt5VXQeYZUt1farxCbkG05KYHt6SPwi1g28aDxufVS0Agv1inF59XyBPjKQDy4wvJN8BTv/BOKMYHyucb9xu/ED5nN4xHpMLA5jX6/KFxgDgKfmcMBegIj+TCxjgvnXGlclY76XrVa9QAKu/Ly9TcLlcROwf4OU4lNgAor6m3H04EyFx5yBMqtgPlONlGtnZvI8SPacYf8C4RvX9VNWfxsWnIlywVfJqA8QckLeIFAiNAU8BoRDi7GSMHrJVuXUflK/Uw/IESZZFKEESxCF49BEmgEPa4lOQLJXRKBl5W3nR+IxGFpLFuLEYo2Q3q3YeWGn8y3ibPDfmVIqPoLj4oPH2aoxnfGG8N4LagKCIwORTMIZAL8udutT4o9x96WaECD/LY3k5wn5bjQ+DG4yfK4//PyK2AZE+Ul45CMbi4shXjBvkZU3VPa76PfylvUV/pZ9+oiF6/hzjl8pXDkTz3qHaWTiI1eKhKWjKv6p+OfdOzCIGIxXzdEUE7LK4Ma065rBDnh8lGtfmGf9Q7jZaSlQa/E2+GfXNh4d9qLwPBkLItJ9EMukuSI/BgcSxc7Pi3Ped8cIqZhgg5tfyTe90RMQQ3yvPG0Tu/xjvTMYp7yNyt+Ja3ssGSinfKncj8/lbPr9WsLv+Lu+DJVg1HnBPMhbJIBZNmX7LcSh2PICw8XISGhY4kQU9pLrxjwackcmPPpiC/v1VdY3cAyEk5DPO2yvfbAHu5IzMfT/Jd/UGWLVSrEAcCwYJya5Mf4xzZwCBOULg6mGAiOyuOJFNAndQ5qMBi1GKFcAc5bVSSGLaKpQFOqH25/Zuil2sxC3Gk8rdWpY2D92vdgdxtmxLqEQqYpQzCzMaMcN19PG2nDiJMKd0vmVps/j0xxJU2i41TZPtYm0qR9mmjbncbBCWXvK88p42RS44izEIiMgp4Ek1e+JoxGRxWeRwVwmOeZRt2ormKd9s+MszpkeAPLdH1dzAeujXM1IwGRy3yfiYcY/8MJ8ef64w7pYLintxIonQmEtxSjAJfn71i+PZLxknlBf6gP5Fj+0nJLjDeFR+BOLdfE6PNvREjj/8VF4hnxNHKU4Vl1QxDbDa2Lz8J0QKRONH/ULjVWqfNPezGMTcrT4/8M8QrpP37rY8A+RHnvep3lRKcOJgfxg07w4dOnTo0GHs8B+JSO4hq3dNqQAAAABJRU5ErkJggg==>