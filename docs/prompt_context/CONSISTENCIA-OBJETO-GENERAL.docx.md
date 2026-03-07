# **Guía Universal de Prompting para la Consistencia de Objeto en LMMs**

## **1\. El Desafío: Fidelidad Estructural vs. Transformación Estilística**

La **Fidelidad Estructural** es la capacidad de la IA de replicar con precisión las características geométricas, dimensionales y los detalles finos de un objeto de referencia (el "objeto héroe") al generar una nueva imagen en un contexto diferente.

* **¿Por qué es clave?** Cuando trabajamos con productos, es fundamental que la IA no incurra en una "pérdida de identidad". Por ejemplo, al cambiar la iluminación de un plato de comida, la distribución y forma de los ingredientes deben permanecer intactas.

### **La Solución de Google: Fusión Multimodal Integrada**

Modelos avanzados como **Gemini 2.5 Flash Image (Nano Banana)** no utilizan algoritmos externos y explícitos como ControlNet Canny. En su lugar, emplean una arquitectura de **Fusión Multimodal** que procesa la imagen de referencia *directamente* junto con el prompt textual.

Este enfoque logra:

1. **Consistencia de Objeto Implícita:** El modelo infiere una representación volumétrica 3D o una "malla geométrica interna" del objeto a partir de la imagen de referencia.  
2. **Control Paramétrico:** El usuario ejerce control sobre esta fidelidad a través del **Nivel de Influencia de la Imagen de Referencia**.

## **2\. Protocolo de Producción Óptima (El Protocolo 3-P)**

Para garantizar la replicación precisa de la estructura de **cualquier objeto** (producto, alimento, indumentaria) en nuevos contextos de estilo, siga estos tres pasos críticos:

### **P1. Preparación del Input (Input Múltiple)**

* **Objetivo:** Maximizar la información geométrica disponible para el LMM.  
* **Acción:** Siempre que sea posible, suministre un conjunto completo de imágenes de referencia del objeto (al menos **dos o tres vistas clave**):  
  * **Vista Lateral/Ángulo Principal:** Para la forma general y las proporciones.  
  * **Vista de Detalle/Textura:** Para capturar acabados, costuras, logotipos, o la textura específica de los materiales/ingredientes.  
  * *(En el caso de fotografía de producto/e-commerce, esto ayuda al modelo a construir un "modelo 3D implícito" más robusto del objeto).*

### **P2. Ajuste del Parámetro de Control (Influencia Alta)**

* **Objetivo:** Bloquear la fidelidad geométrica esencial del producto.  
* **Acción:** Configurar el parámetro de **Influencia de la Imagen de Referencia** al nivel **Alta**.  
  * **Influencia Alta:** El modelo priorizará la estructura, geometría y detalles finos (proporciones, distribución, forma) de la imagen de entrada.  
  * **Influencia Baja:** El modelo priorizará el *prompt* textual, arriesgando una "deriva creativa" (cambios en la forma o el diseño).

### **P3. Prompting Estratégico (Vocabulario de Alta Fidelidad)**

El *prompt* debe actuar como el "plano de renderizado", especificando **qué debe cambiar** (estilo, luz) y **qué debe ser inmutable** (forma, detalle).

#### **A. Instrucción de Fidelidad (La Cláusula Crucial)**

Debe iniciar el *prompt* con una instrucción innegociable de fidelidad estructural:

| Objeto | Cláusula de Fidelidad de Objeto |
| :---- | :---- |
| **Producto General** (Zapatos, Bolso, Mueble) | The generated object MUST be an \*\*exact replica\*\* of the reference image. Maintain precise geometry, intricate stitching/finishing, and all dimensional proportions. |
| **Plato de Comida** (Receta) | \*\*Preserve structural integrity of the food content.\*\* Replicate the exact shape, quantity, and arrangement of the \[ingredientes\]. High-fidelity geometric rendering of the distribution. |

#### 

#### 

#### 

#### 

#### **B. Modificadores Clave (Lenguaje 3D y Fotográfico)**

Utilice un vocabulario que dirija la atención del modelo a los aspectos críticos del producto, como si estuviera hablando con un motor de renderizado 3D:

| Categoría | Modificadores Esenciales para la Estructura | Modificadores para el Estilo y la Transformación |
| :---- | :---- | :---- |
| **Geometría / Forma** | Structural integrity, Exact shape replication, Maintain proportions, Geometric precision, Do not distort the \[detalle crítico\]. | Shallow depth of field (Bokeh), Low-angle shot, Macro focus. |
| **Detalle Fino** | Intricate detail, Precise focusing on \[textura/costuras\], Fine texture rendering, Exact color matching. | Ultra-realistic 8K photograph, Shot on 35mm film, Cinematic. |
| **Transformación** | (Ninguno) | Dramatic directional lighting, Soft, diffused studio light, Moody aesthetic, Clean minimalist background, Change the color of the plate to \[color\]. |

## 

## 

## 

## 

## **3\. Plantilla de Prompt Universal**

Utiliza esta estructura para cualquier tarea de img2img donde la fidelidad del objeto de origen sea obligatoria:

**\[IMAGEN DE REFERENCIA DEL OBJETO HEROE AQUÍ (Input 1)\]**

### **Plantilla de Prompt**

1. **\[Instrucción de Fidelidad Estructural (Ver Sección 3.A)\]:** The generated object MUST be an \*\*exact replica\*\* of the reference image. Maintain precise geometry, intricate detail, and all dimensional proportions.  
2. **\[Estilo y Contexto Deseado\]:** \[Estilo de fotografía: e.g., Editorial, Studio, Cinematic\] photography with a \[Atmósfera: e.g., dramatic, minimalist, vibrant\] mood.  
3. **\[Composición y Ángulo\]:** \[Ángulo: e.g., Medium close-up, Low-angle shot\]. The \[objeto\] is resting on a \[Fondo: e.g., marble pedestal, dark wooden table\].  
4. **\[Iluminación y Renderizado\]:** Lit with \[Tipo de luz: e.g., soft, natural, diffused daylight\] creating \[Sombras: e.g., subtle, strong, deliberate shadows\]. \*\*Technical Specs:\*\* Ultra-realistic 8K output, Geometric precision, Sharp focus on the details.

## **4\. Refinamiento Iterativo**

Si la primera generación no es perfecta, no comience de nuevo. Aproveche la arquitectura del LMM:

* **Uso Iterativo:** Utilice la imagen estructuralmente más fiel generada como el **nuevo punto de partida/imagen de referencia**.  
* **Instrucción de Refinamiento:** Introduzca pequeños cambios en el *prompt* para corregir desviaciones (e.g., *“Slightly increase the contrast,”* o *“Make the background whiter”*) y genere más recursos similares. Este proceso asegura que la estructura se mantenga constante mientras se exploran opciones estéticas.