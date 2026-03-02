# TSD-02: Backend API, AI Orchestration & Storage
**Project:** FoodSocial AI
**Module:** Backend Service & ML Pipeline
**Dependency:** None (Can be developed in parallel with TSD-01 using cURL/Postman for testing).

## 1. Tech Stack & Standards
Based on the `backend-security-hardened` and `senior-architect` guidelines:
*   **Framework:** Python 3.11+ using FastAPI. (Ideal for integrating seamlessly with Google Cloud Vertex AI SDKs).
*   **Database & ORM:** PostgreSQL managed via Supabase or NeonDB. Use SQLAlchemy 2.0 or SQLModel (Pydantic-based) for database operations.
*   **Task Queue:** Celery with Redis broker, or Google Cloud Tasks for serverless environments.
*   **Storage:** Google Cloud Storage (GCS). Backend must exclusively deal with signed URLs, never passing raw Base64 image strings through JSON payloads.

## 2. Core Modules & Scope

### 2.1 API & Security Contracts 
All endpoints must be strictly validated.
*   **Input Validation:** Use `Pydantic` schemas for EVERY incoming request (refer to the payload contract in [TSD-00 Section 5]).
*   **Authentication:** Verify JWT token (Supabase Auth) on every endpoint via a FastAPI Dependency (`Depends(get_current_user)`).
*   **Rate Limiting & Tenant Quotas:** Before accepting a generation job, verify the tenant's remaining credit balance in Postgres. If insufficient, return a clean `402 Payment Required`.

### 2.2 The Image Pipeline (The Vertex AI Bridge)
*   **Endpoint `/api/v1/generate` (POST):** 
    1. Validate Request.
    2. Check User Quota.
    3. Push task payload to the asynchronous Worker Queue (Celery).
    4. Return `job_id` and `202 Accepted` immediately.
*   **The Worker (Celery Task):**
    1. Download image from the provided GCS presigned URL into memory.
    2. Trigger Background Removal API (e.g., `rembg` or Google Cloud Vision segmentation).
    3. Construct the dynamic string prompt based on `style_id` and `narrative` (to be refined in TSD-03).
    4. Call Google Vertex AI `imagegeneration@006` (Imagen 3) passing the masked image, the original image for reference (Img2Img parameters), and the prompt.
    5. Save the resulting image to the GCS `final-assets` bucket.
    6. Update the Jobs database table with `status="completed"` and the new URL.

### 2.3 The AI Copywriter Module
*   Trigger a secondary call to Vertex AI (Gemini 1.5 Pro).
*   **Input:** The final generated Image URL + User's language preference.
*   **System Prompt:** `backend-security-hardened` states "Trust no one". Use Pydantic's `instructor` library to force Gemini to return structured JSON containing exactly: `{"caption": "String", "hashtags": ["#ht1", "#ht2"]}`. Do not parse raw regex strings.
*   Save this text metadata to the Postgres asset row.

### 2.4 Error Handling & Logging
*   **No Silent Failures:** If Vertex AI times out, the Celery task must catch the timeout, log the failure with `user_id` context (redacting any PII like emails), and update the job status to `failed` so the frontend UI can gracefully display an error state.
*   **Database Constraints:** Use parameterized queries via the ORM to prevent SQL Injection.

## 3. Parallel Development Guide
The Backend Team must immediately hardcode a mock delayed response for `/api/v1/generate` and `/api/v1/jobs/{job_id}` according to the [TSD-00] contract and deploy it to a staging environment (e.g., Render/Railway/Cloud Run). This allows the TSD-01 Frontend team to connect their Redux/Zustand logic to a real URL while the actual AI logic (Section 2.2) is being coded locally.

## 4. Acceptance Criteria
*   [ ] OpenAPI `/docs` (Swagger) generated automatically by FastAPI matches the TSD-00 JSON contract exactly.
*   [ ] Attempting to access any endpoint without a valid Bearer token returns `401 Unauthorized`.
*   [ ] A job taking > 30 seconds correctly processes in the background without causing a HTTP 504 Gateway Timeout on the initial POST request.
