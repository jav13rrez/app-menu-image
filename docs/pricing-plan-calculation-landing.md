# Pricing SaaS: cálculo de planes por créditos + estructura de landing



## 0) Cambio de modelo: de generaciones a créditos (recomendado)

Para soportar acciones con costos diferentes (p. ej. generar imagen final vs. analizar foto de interior para contexto), el modelo comercial debe pasar de “N generaciones/mes” a **bolsas de créditos/mes**.

### Principio
- Cada acción consume créditos.
- El usuario ve un **contador único de créditos** y una tabla de consumo por acción.
- Puedes seguir mostrando “equivalente aproximado en generaciones” para facilitar comprensión comercial.

### Ejemplo comercial
- “60 generaciones (~120 créditos)” asumiendo 2 créditos por generación base.

## 1) Cómo calcular precio por plan y nº de créditos

## 1.1 Datos base (según capturas)
Tomando tus imágenes de pricing del modelo Gemini 3.1 Flash Image preview:

- **Modo Estándar (aprox 1K)**: costo de imagen ≈ **USD 0.067** por generación.
- **Modo Lote (aprox 1K)**: costo de imagen ≈ **USD 0.034** por generación.

> Nota: en las capturas también aparecen equivalencias para 512, 2K y 4K. Para menú/comida en redes, 1K suele ser buen punto de partida para balance costo/calidad.



## 1.1.1 Matriz de consumo por acción (base operativa)

Define una tabla pública de consumo para máxima transparencia:

- `generate_image_standard` = **2 créditos**
- `generate_image_hd` = **3 créditos**
- `upload_context_photo` (subir foto interior) = **1 crédito**
- `context_photo_analysis` (descripción automática para prompt) = **1 crédito**
- `regenerate_variation` = **2 créditos**

> En tu caso de uso nuevo, subir una imagen del restaurante no debe ser gratis porque implica inferencia adicional (describir escena + enriquecer prompt). La UX debe advertir el costo antes de ejecutar la acción.

---

## 1.2 Fórmula de costo unitario real (COGS)
No uses solo “costo del modelo de imagen”. Usa:

`COGS_gen = C_imagen + C_copy + C_storage + C_infra + C_fallos`

Dónde:
- `C_imagen`: costo del modelo por generación (0.067 estándar / 0.034 lote en 1K).
- `C_copy`: caption + hashtags (Gemini texto), pequeño pero no cero.
- `C_storage`: guardar imagen final y accesos.
- `C_infra`: backend/worker/monitoring por request.
- `C_fallos`: regeneraciones/retries/fallos de usuario (buffer del 5–15%).

### Recomendación práctica (MVP)
Asume 2 escenarios:

1) **Escenario conservador (Estándar):**
- `C_imagen = 0.067`
- `C_copy + storage + infra + fallos ≈ 0.023`
- `COGS_gen ≈ 0.090`

2) **Escenario optimizado (Lote):**
- `C_imagen = 0.034`
- `C_copy + storage + infra + fallos ≈ 0.021`
- `COGS_gen ≈ 0.055`

---

## 1.3 Fórmula para precio de venta
Define un margen bruto objetivo (ej. 70%):

`Precio_por_gen_objetivo = COGS_gen / (1 - Margen_bruto)`

Ejemplo con COGS 0.09 y margen 70%:
- `0.09 / 0.30 = 0.30 USD/gen`

Luego transforma en bundles/planes mensuales con descuento por volumen.



## 1.3.1 Fórmula de precio por crédito

Si un plan se vende por créditos:

- `Costo_credito = Costo_total_mensual_estimado / Créditos_consumidos_estimados`
- `Precio_credito = Costo_credito / (1 - Margen_objetivo)`

Y luego:

- `Créditos_plan = Precio_plan / Precio_credito`

Así desacoplas negocio de una sola acción (“generar”) y puedes introducir nuevas capacidades sin romper tu pricing.

---

## 1.4 Propuesta inicial de 3 planes (modelo por créditos)
### Opción A (margen y claridad)
- **Starter**: USD 29/mes, **120 créditos** (~60 generaciones base)
- **Pro**: USD 79/mes, **420 créditos** (~210 generaciones base)
- **Scale**: USD 149/mes, **900 créditos** (~450 generaciones base)

### Opción B (adopción más agresiva)
- **Starter**: USD 19/mes, **70 créditos** (~35 generaciones base)
- **Pro**: USD 59/mes, **320 créditos** (~160 generaciones base)
- **Scale**: USD 129/mes, **800 créditos** (~400 generaciones base)

> Equivalencia sugerida para comunicar: 1 generación estándar = 2 créditos. Mantén una tabla visible de consumo por acción para evitar confusión.


---

## 1.5 Regla para no perder dinero
Antes de publicar precios, valida:

`Ingreso_plan - Costo_total_plan - Fee_stripe - Impuestos - Soporte > 0`

### Plantilla rápida por plan
- `Costo_total_plan = creditos_incluidos * Costo_credito_promedio`
- `Fee_stripe_aprox = precio * 0.039 + 0.30` (ajusta a tu país/cuenta)
- `Margen_bruto_plan = (precio - Costo_total_plan - Fee_stripe) / precio`

Objetivo saludable MVP: **margen bruto > 60%**.

---

## 1.6 Política de excedentes (muy recomendada)
Para evitar fricción cuando un usuario agota créditos:

- Permitir **top-ups** (packs extra), por ejemplo:
  - 50 créditos: USD 19
  - 150 créditos: USD 49
- O activar **pago por uso** sobre el plan (con límite de seguridad mensual).

Esto mejora conversión y reduce churn por bloqueo duro.

---

## 2) Estructura de landing de pricing (lista para construir)

## 2.1 Header de sección pricing
- Título: **“Planes simples para escalar tu contenido de comida”**
- Subtítulo: “Paga por resultados. Cambia o cancela cuando quieras.”
- Toggle mensual/anual (anual con 15–20% descuento)

## 2.2 Tabla de 3 planes (cards)
Cada card debe mostrar:
- Nombre plan
- Precio mensual
- Créditos incluidos
- Equivalencia aproximada en generaciones (transparencia)
- CTA principal

### Plan card sugerido
**Starter**
- 120 créditos/mes (~60 generaciones base)
- 1 marca
- Exportación estándar
- Soporte email
- CTA: “Empezar con Starter”

**Pro (destacado)**
- 420 créditos/mes (~210 generaciones base)
- 3 marcas
- Mejoras de calidad y presets
- Prioridad de cola
- CTA: “Elegir Pro”

**Scale**
- 900 créditos/mes (~450 generaciones base)
- Marcas ilimitadas
- Trabajo en equipo (n usuarios)
- SLA básico
- CTA: “Pasar a Scale”


## 2.2.1 Indicador de transparencia (nuevo bloque clave)

Añade un bloque fijo encima de las cards:

- **“¿Cómo se consumen los créditos?”**
- Generar imagen estándar: 2 créditos
- Subir y analizar foto de interior: 2 créditos (1+1)
- Variación/regeneración: 2 créditos

Incluye mini calculadora:
- “Si haces 40 imágenes + 20 análisis de interior = 120 créditos/mes”.

## 2.3 Bloque “¿Qué consume créditos?”
Texto claro:
- “Generación estándar: 2 créditos.”
- “Generación HD: 3 créditos.”
- “Subida de foto de interior: 1 crédito.”
- “Descripción automática de foto de interior para prompt: 1 crédito.”
- “Variación/regeneración: 2 créditos.”
- “Si falla por error del sistema, se reembolsa automáticamente.”

## 2.4 Bloque de add-ons
- Top-ups (50 / 150 / 500)
- Extra seats equipo
- Pack branding assets

## 2.5 Bloque comparativo (feature matrix)
Filas recomendadas:
- Créditos/mes
- Marcas
- Usuarios del equipo
- Resolución
- Historial de assets
- Prioridad de procesamiento
- Soporte
- API (sí/no)

## 2.6 FAQ de pricing (conversión)
Preguntas clave:
- ¿Qué pasa si consumo todos mis créditos?
- ¿Los créditos se acumulan?
- ¿Puedo cambiar de plan a mitad de mes?
- ¿Cómo funciona la facturación anual?
- ¿Hay reembolso?

## 2.7 Bloque final CTA
- Headline: “Empieza hoy y publica mejores fotos de menú esta semana.”
- CTA primario: “Comenzar prueba” o “Ver demo”
- CTA secundario: “Hablar con ventas” (para plan alto)

---

## 3) Tracking mínimo para optimizar pricing

Eventos recomendados:
- `pricing_viewed`
- `plan_selected`
- `checkout_started`
- `checkout_completed`
- `credits_exhausted`
- `context_image_uploaded`
- `context_image_described`
- `topup_purchased`

KPIs:
- Conversión visita pricing -> checkout
- Conversión checkout -> pago
- ARPU
- % usuarios que agotan créditos antes de fin de ciclo
- Churn de pago mensual

---

## 4) Plan de validación en 30 días

Semana 1:
- Publicar pricing (Opción A)
- Activar Stripe + tracking

Semana 2:
- Revisar COGS real por generación
- Ajustar límites de Starter si margen < objetivo

Semana 3:
- Activar top-ups
- A/B test de copy en CTA del plan Pro

Semana 4:
- Decidir cambio de precios/límites
- Documentar versionado de precios (v1 -> v1.1)

---

## 5) Recomendación final
Empieza con precios que protejan margen y aprende del uso real. En SaaS de IA, el error típico es vender barato sin medir costo efectivo por generación (incluyendo retries e infraestructura). Mejor margen sólido + top-ups, que planes “bonitos” pero deficitarios. Un sistema por créditos te da elasticidad para nuevas acciones (como análisis de fotos de interior) sin rehacer la estructura comercial.