# TSD-00: Master Architecture & Development Index
**Project:** FoodSocial AI (All-in-One Food Marketing SaaS)
**Status:** DRAFT
**Author:** Lead Architect (AI)

## 1. Executive Summary & Purpose
This document (TSD-00) serves as the master blueprint and index for the technical implementation of FoodSocial AI. It defines the high-level system architecture, sets the foundational UI/UX and engineering standards (applying `ui-ux-pro-max` and `senior-architect` skills), and breaks down the project into modular, **parallelizable Technical Specification Documents (TSDs)**.

By defining strict API contracts and modular boundaries upfront, multiple developer pods can work simultaneously without blocking each other.

---

## 2. Global Architecture Overview
The system follows a modern, decoupled Serverless/Microservices architecture to handle the compute-heavy nature of generative AI while keeping the frontend highly responsive.

*   **Frontend (Client):** React.js / Next.js (depending on SEO needs for public pages) or an SPA (Vite + React) for the logged-in dashboard. Heavy emphasis on client-side state management (Zustand/Redux) to handle the complex creation wizard.
*   **Backend (API Layer):** Node.js (Express/NestJS) or Python (FastAPI). Python is highly recommended due to native ecosystem compatibility with AI/ML tools and Google Cloud Vertex AI SDKs.
*   **AI Orchestration:** Google Cloud Vertex AI (Imagen 3 / Gemini Pro Vision) for generative tasks. Background workers (Celery/Redis or serverless queues) to handle asynchronous image generation.
*   **Database:** PostgreSQL (Supabase/NeonDB) for relational data (users, tenants, asset metadata, billing).
*   **Storage:** Google Cloud Storage (GCS) or AWS S3 for saving raw uploads, temporary masks, and final high-res creatives.

---

## 3. Engineering & Design Standards

### 3.1 UX/UI Standards (via `ui-ux-pro-max`)
To ensure a premium, SaaS-native feel:
*   **Priority 1 (Accessibility & Touch):** Minimum 4.5:1 contrast ratio. Minimum 44x44px touch targets for mobile. Clear focus states.
*   **Priority 2 (Feedback):** Since AI generation takes 10-15 seconds, the UI **must** implement skeleton screens, dynamic loading spinners, and optimistic UI updates. Disable buttons during async operations.
*   **Priority 3 (Visual Style):** Implement "Glassmorphism" or a clean, minimal "Dark Mode" native style. Emphasize the uploaded food photos by keeping the UI chrome dark/neutral. Use SVG icons (Lucide/Heroicons), not emojis.
*   **Priority 4 (Performance):** Use WebP for rendering generated images.

### 3.2 Architectural Standards (via `senior-architect`)
*   **Separation of Concerns:** The Frontend knows *nothing* about how Vertex AI works. It only knows how to submit a job and listen for a webhook or poll for a result.
*   **Security:** Never expose AI API keys to the client. All image generation requests must map through the Backend, where rate limits, tenant quotas, and input sanitization (NSFW checks) occur.
*   **Scalability:** Image processing is blocking. The backend must use an asynchronous worker queue (e.g., Cloud Tasks, BullMQ, Celery).

---

## 4. Development Stages & Parallelization Strategy

To optimize time-to-market, the development has been partitioned into autonomous modules. **TSD-01 and TSD-02 can be developed 100% in parallel** as long as the API JSON contracts defined in TSD-00 (Section 5) are respected.

### 📄 TSD-01: Frontend, UI/UX, & Canvas Editor
*   **Focus:** The UI Wizard, state management, Canvas rendering, and social media integrations.
*   **Scope:**
    *   Image upload component (Dropzone + Client-side validation).
    *   Wizard Flow (Steps 1 to 6).
    *   Canvas/Fabric.js implementation for text overlay and branding auto-resizing.
    *   Mocking API calls to backend to simulate 10-second wait times.
*   **Team:** Frontend / UI Engineers.
*   **Dependency:** None (uses Mock JSON APIs).

### 📄 TSD-02: Backend API, AI Orchestration & Storage
*   **Focus:** Exposing the REST API, talking to Google Vertex AI, managing Cloud Storage, and handling asset metadata in the database.
*   **Scope:**
    *   Authentication & Tenant Quota system (Supabase Auth / JWT).
    *   AWS S3 / GCS presigned URLs for secure uploads.
    *   Python/Node orchestrator bridging the payload to Google Imagen 3 API.
    *   Asynchronous job queue (polling/webhook endpoints).
*   **Team:** Backend / AI Engineers.
*   **Dependency:** None (Can trigger API via Postman/cURL).

### 📄 TSD-03: AI Pipeline Optimization & Prompt Engineering (Specialized)
*   **Focus:** Fine-tuning the exact Img2Img parameters and prompts to guarantee high-fidelity Michelin-star outputs without altering the original dish.
*   **Scope:**
    *   Algorithm for background removal.
    *   Dynamic prompt generation script (combining lighting + narrative + dish recognition).
    *   Calibration of "denoising strength".
*   **Team:** Prompt Engineers / ML Engineers.
*   **Dependency:** Can be executed simultaneously in a Python notebook environment before porting logic to TSD-02.

### 📄 TSD-04: Social Auth, Webhooks & Final Export
*   **Focus:** The "Publish to Instagram" logic, Meta Graph API integration (OAuth2), and copying text to clipboard.
*   **Dependency:** Requires TSD-01 and TSD-02 to be substantially complete.

---

## 5. The Critical Integration Contract
For parallelism to work, the Backend and Frontend teams MUST agree on the following API structure for the core generation task:

**POST `/api/v1/generate`**
*Request (Frontend -> Backend):*
```json
{
  "image_url": "https://storage.bucket/temp_upload_123.jpg",
  "style_id": "moody_candlelight",
  "narrative": "chef_hand",
  "aspect_ratio": "1:1"
}
```
*Response (Backend -> Frontend - Async):*
```json
{
  "job_id": "job_9876xyz",
  "status": "processing",
  "estimated_time_sec": 12,
  "poll_url": "/api/v1/jobs/job_9876xyz"
}
```

*Polling Response (GET `/api/v1/jobs/job_9876xyz`):*
```json
{
  "status": "completed",
  "result": {
    "generated_image_url": "https://storage.bucket/final_creative_123.jpg",
    "generated_copy": "Savor the night... ✨ Our chef just finished this masterpiece. Tag someone you'd share this with! #FineDining #Foodie",
    "hashtags": ["#FineDining", "#Foodie", "#DinnerDate"]
  }
}
```

---
*Next Steps: Review this index with the CTO and Lead Devs. Once approved, we will break out TSD-01 and TSD-02 into their standalone documents.*
