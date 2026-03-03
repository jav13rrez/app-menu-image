# TSD-04: Backend Quota Enforcement & Credit Gateway
**Project:** FoodSocial AI — SaaS Transformation
**Module:** FastAPI — Auth & Credit Consumption
**Status:** DRAFT v2 — On-Demand Credits (Replicate model)
**Dependency:** TSD-01 (Database Schema), TSD-02 (Stripe populates credits)

---

## 1. Purpose
This TSD specifies the backend changes to enforce the credit-based pay-as-you-go model:
- Read real credit balance from `credit_balances` (replacing the hardcoded `quota_remaining=50`).
- Atomically deduct credits before launching AI jobs.
- Refund credits on generation failures.
- Expose billing API endpoints.
- **Context Photo Library** — CRUD endpoints for saved restaurant photos with AI scene analysis.

---

## 2. Current State — What Must Change

### 2.1 `auth.py` — Hardcoded Quota (line 47)
```python
# ⚠️ CURRENT: Always returns 50 regardless of real usage
return CurrentUser(
    user_id=user_id,
    tenant_id=...,
    quota_remaining=50  # MUST BE REPLACED
)
```

### 2.2 `routes.py` — Quota Check (line 19)
```python
# ✅ CORRECT STRUCTURE — just needs real data
if user.quota_remaining <= 0:
    raise HTTPException(status_code=402, ...)
```

---

## 3. Modifications

### 3.1 `CurrentUser` — Simplified for On-Demand

```python
class CurrentUser:
    def __init__(
        self,
        user_id: str,
        tenant_id: str,
        credits_remaining: int,
        stripe_customer_id: str | None = None,
    ):
        self.user_id = user_id
        self.tenant_id = tenant_id
        self.credits_remaining = credits_remaining
        self.stripe_customer_id = stripe_customer_id

    @property
    def can_generate(self) -> bool:
        return self.credits_remaining >= 2  # minimum for standard generation
```

### 3.2 `get_current_user()` — Query Real Balance

```python
async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> CurrentUser:
    # Dev mode fallback (unchanged)
    if not credentials:
        return CurrentUser(
            user_id="dev-user",
            tenant_id="dev-tenant",
            credits_remaining=999,
        )

    # ... existing JWT decode logic ...

    # NEW: Fetch real balance from Supabase
    profile = supabase.table("profiles").select(
        "tenant_id, stripe_customer_id"
    ).eq("id", user_id).single().execute()

    balance = supabase.table("credit_balances").select(
        "credits_remaining"
    ).eq("user_id", user_id).maybe_single().execute()

    return CurrentUser(
        user_id=user_id,
        tenant_id=profile.data.get("tenant_id", "default") if profile.data else "default",
        credits_remaining=balance.data.get("credits_remaining", 0) if balance.data else 0,
        stripe_customer_id=profile.data.get("stripe_customer_id") if profile.data else None,
    )
```

### 3.3 Credit Cost Configuration

```python
# backend/app/core/config.py
CREDIT_COSTS = {
    "generate_image_standard": 2,
    "generate_image_hd": 3,
    "upload_context_photo": 1,
    "context_photo_analysis": 1,
    "regenerate_variation": 2,
}
```

### 3.4 `routes.py` — Atomic Credit Deduction

```python
@router.post("/generate", response_model=GenerateResponse, status_code=202)
async def generate_image(
    req: GenerateRequest,
    user: CurrentUser = Depends(get_current_user),
):
    credit_cost = CREDIT_COSTS["generate_image_standard"]

    # UX guard (real enforcement is in DB function)
    if user.credits_remaining < credit_cost:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Créditos insuficientes. Compra más créditos para continuar.",
        )

    # Atomic deduction via Supabase RPC
    try:
        supabase.rpc("consume_credits", {
            "p_user_id": user.user_id,
            "p_amount": credit_cost,
            "p_description": f"Generación de imagen - estilo {req.style_id}",
        }).execute()
    except Exception as e:
        if "INSUFFICIENT_CREDITS" in str(e):
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Créditos insuficientes.",
            )
        raise

    # If context photo selected, fetch its AI description for prompt enrichment
    context_description = None
    if req.context_photo_id:
        ctx_photo = supabase.table("context_photos").select(
            "ai_description"
        ).eq("id", req.context_photo_id).eq(
            "user_id", user.user_id  # RLS double-check
        ).single().execute()
        context_description = ctx_photo.data.get("ai_description") if ctx_photo.data else None

    # Job creation (extended with context photo)
    job_id = create_job(
        user_id=user.user_id,
        style_id=req.style_id,
        narrative=req.narrative,
        aspect_ratio=req.aspect_ratio.value,
        image_url=req.image_url,
        business_name=req.business_name,
        location=req.location,
        post_context=req.post_context,
        context_photo_id=req.context_photo_id,          # NEW
        context_description=context_description,         # NEW: feeds into prompt
    )

    return GenerateResponse(
        job_id=job_id,
        status="processing",
        estimated_time_sec=30,
        poll_url=f"{API_V1_PREFIX}/jobs/{job_id}",
    )
```

### 3.5 Credit Refund on Job Failure

```python
# backend/app/workers/image_worker.py — in the failure handler
async def refund_credits_on_failure(user_id: str, job_id: str, amount: int = 2):
    """Refund credits when AI generation fails (system error, not user error)."""
    # Update balance
    supabase.table("credit_balances").update({
        "credits_remaining": supabase.raw(f"credits_remaining + {amount}"),
        "updated_at": "now()"
    }).eq("user_id", user_id).execute()

    # Log refund transaction
    balance = supabase.table("credit_balances").select(
        "credits_remaining"
    ).eq("user_id", user_id).single().execute()

    supabase.table("credit_transactions").insert({
        "user_id": user_id,
        "amount": amount,
        "balance_after": balance.data["credits_remaining"],
        "type": "refund",
        "reference_id": job_id,
        "description": "Reembolso automático por fallo en la generación",
    }).execute()
```

---

## 4. Billing API Routes

### 4.1 File: `backend/app/api/billing.py` (NEW)

```python
billing_router = APIRouter(prefix=f"{API_V1_PREFIX}/billing")

@billing_router.get("/balance")
async def get_balance(user: CurrentUser = Depends(get_current_user)):
    balance = supabase.table("credit_balances").select("*").eq(
        "user_id", user.user_id
    ).maybe_single().execute()

    return {
        "credits_remaining": balance.data["credits_remaining"] if balance.data else 0,
        "total_purchased": balance.data["total_purchased"] if balance.data else 0,
        "total_consumed": balance.data["total_consumed"] if balance.data else 0,
    }

@billing_router.get("/transactions")
async def get_transactions(
    user: CurrentUser = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0,
):
    result = supabase.table("credit_transactions").select("*").eq(
        "user_id", user.user_id
    ).order("created_at", desc=True).range(offset, offset + limit - 1).execute()

    return {
        "transactions": result.data,
        "has_more": len(result.data) == limit,
    }

@billing_router.post("/buy-credits")
async def buy_credits(req: BuyCreditRequest, user: CurrentUser = Depends(get_current_user)):
    # Implementation per TSD-02
    pass

# Stripe webhook (no auth) — per TSD-02
@billing_router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    pass
```

---

## 5. Context Photo API Routes

### 5.1 File: `backend/app/api/context_photos.py` (NEW)

```python
context_router = APIRouter(prefix=f"{API_V1_PREFIX}/context-photos")

MAX_CONTEXT_PHOTOS = 10

@context_router.get("/")
async def list_context_photos(user: CurrentUser = Depends(get_current_user)):
    """Returns all saved context photos for the user."""
    result = supabase.table("context_photos").select("*").eq(
        "user_id", user.user_id
    ).order("sort_order").execute()
    return {"photos": result.data, "count": len(result.data), "max": MAX_CONTEXT_PHOTOS}

@context_router.post("/", status_code=201)
async def upload_context_photo(
    image_url: str,
    label: str = "",
    user: CurrentUser = Depends(get_current_user),
):
    """Upload a new context photo. Costs 2 credits (1 upload + 1 AI analysis)."""
    # Check limit
    existing = supabase.table("context_photos").select(
        "id", count="exact"
    ).eq("user_id", user.user_id).execute()
    if existing.count >= MAX_CONTEXT_PHOTOS:
        raise HTTPException(status_code=409, detail="Máximo 10 espacios alcanzado.")

    # Deduct 2 credits (upload + analysis)
    credit_cost = CREDIT_COSTS["upload_context_photo"] + CREDIT_COSTS["context_photo_analysis"]
    try:
        supabase.rpc("consume_credits", {
            "p_user_id": user.user_id,
            "p_amount": credit_cost,
            "p_description": f"Subida y análisis de foto de contexto: {label or 'Sin nombre'}",
        }).execute()
    except Exception as e:
        if "INSUFFICIENT_CREDITS" in str(e):
            raise HTTPException(status_code=402, detail="Créditos insuficientes (2 necesarios).")
        raise

    # AI scene analysis (Gemini Pro Vision)
    ai_description = await analyze_scene(image_url)

    # Generate thumbnail (resize to 300px width)
    thumbnail_url = await generate_thumbnail(image_url)

    # Insert into DB
    photo = supabase.table("context_photos").insert({
        "user_id": user.user_id,
        "image_url": image_url,
        "thumbnail_url": thumbnail_url,
        "ai_description": ai_description,
        "label": label or "Mi espacio",
        "sort_order": existing.count,
    }).execute()

    return {"photo": photo.data[0], "credits_used": credit_cost}

@context_router.patch("/{photo_id}")
async def update_context_photo(
    photo_id: str,
    label: str,
    user: CurrentUser = Depends(get_current_user),
):
    """Update the label of a saved context photo. Free — no credits."""
    supabase.table("context_photos").update({
        "label": label
    }).eq("id", photo_id).eq("user_id", user.user_id).execute()
    return {"status": "updated"}

@context_router.delete("/{photo_id}")
async def delete_context_photo(
    photo_id: str,
    user: CurrentUser = Depends(get_current_user),
):
    """Delete a saved context photo. Free — no refund."""
    supabase.table("context_photos").delete().eq(
        "id", photo_id
    ).eq("user_id", user.user_id).execute()
    return {"status": "deleted"}
```

### 5.2 AI Scene Analysis Function
```python
async def analyze_scene(image_url: str) -> str:
    """Uses Gemini Pro Vision to describe the restaurant scene."""
    # Prompt: "Describe this restaurant interior in detail for use as
    # a background context in food photography. Focus on ambiance, 
    # lighting, furniture, and decor. Respond in Spanish. Max 2 sentences."
    response = await gemini_vision.generate_content(
        prompt=SCENE_ANALYSIS_PROMPT,
        image_url=image_url,
    )
    return response.text  # e.g., "Mesa de madera rústica junto a ventana..."
```

---

## 6. Sequence Diagram — Generation with Context Photo

```
User          Frontend          Backend (FastAPI)        Supabase DB
 |               |                    |                      |
 |  Select ctx   |                    |                      |
 |  photo + Gen  |                    |                      |
 |──────────────>| POST /generate     |                      |
 |               |  {context_photo_id}|                      |
 |               |───────────────────>| decode JWT           |
 |               |                    |──────────────────────>| SELECT credit_balances
 |               |                    |<──────────────────────| credits: 42
 |               |                    |                      |
 |               |                    | RPC consume_credits  |
 |               |                    |──────────────────────>| UPDATE -2, INSERT tx
 |               |                    |<──────────────────────| balance: 40
 |               |                    |                      |
 |               |                    | fetch ctx photo desc |
 |               |                    |──────────────────────>| SELECT context_photos
 |               |                    |<──────────────────────| ai_description
 |               |                    |                      |
 |               |                    | create_job(+ctx)     |
 |               |                    |──────────────────────>| INSERT jobs
 |               |<───────────────────| 202 {job_id}         |
```

---

## 7. Acceptance Criteria
- [ ] `get_current_user()` reads real `credits_remaining` from DB
- [ ] `consume_credits()` RPC prevents negative balances atomically
- [ ] Race condition: simultaneous requests cannot overdraw balance
- [ ] Failed jobs refund credits automatically
- [ ] `GET /billing/balance` returns correct data
- [ ] `GET /billing/transactions` returns paginated history
- [ ] Dev mode fallback (999 credits) still works for local testing
- [ ] All credit mutations logged in `credit_transactions`
- [ ] `GET /context-photos` returns user's saved photos
- [ ] `POST /context-photos` deducts 2 credits and runs AI analysis
- [ ] `POST /context-photos` enforces max 10 limit with 409 error
- [ ] `PATCH /context-photos/{id}` updates label (free)
- [ ] `DELETE /context-photos/{id}` removes photo (RLS enforced)
- [ ] Generation with `context_photo_id` enriches prompt with `ai_description`
