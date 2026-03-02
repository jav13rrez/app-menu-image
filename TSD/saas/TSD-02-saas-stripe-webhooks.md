# TSD-02: Stripe Integration — One-Time Credit Purchases
**Project:** FoodSocial AI — SaaS Transformation
**Module:** Payment Processing (Backend — FastAPI)
**Status:** DRAFT v2 — On-Demand Credits (Replicate model)
**Dependency:** TSD-01 (Database Schema must be applied first)

---

## 1. Purpose
This TSD specifies the Stripe integration for a **prepaid credit model**. Users buy credit packs via Stripe Checkout (one-time payments). No subscriptions, no recurring billing, no complex webhook lifecycle.

---

## 2. Stripe Product Configuration

### 2.1 Credit Packs (One-Time Prices)
Create in Stripe Dashboard or via API:

| Pack ID | Product Name | Price (EUR) | Credits | Stripe Type |
|---------|-------------|:-----------:|:-------:|-------------|
| `pack_10` | FoodSocial 40 Credits | €10 | 40 | `one_time` |
| `pack_20` | FoodSocial 80 Credits | €20 | 80 | `one_time` |
| `pack_50` | FoodSocial 200 Credits | €50 | 200 | `one_time` |

Store the resulting `price_xxx` IDs in the `credit_packs.stripe_price_id` column.

### 2.2 Custom Amounts (Future Phase)
For custom top-ups, use Stripe's `custom_amount` parameter in Checkout Session with minimum €10 and increments of €5. Calculate credits dynamically: `credits = floor(amount_eur / 0.25)`.

---

## 3. Backend Architecture

### 3.1 New FastAPI Routes

#### `POST /api/v1/billing/buy-credits`
Creates a Stripe Checkout Session for a one-time credit purchase.

```python
# Request
{
  "pack_id": "pack_20"
}

# Response
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_xxx..."
}
```

**Implementation:**
```python
@billing_router.post("/buy-credits")
async def buy_credits(req: BuyCreditRequest, user: CurrentUser = Depends(get_current_user)):
    # 1. Validate pack exists
    pack = await get_credit_pack(req.pack_id)
    if not pack:
        raise HTTPException(status_code=404, detail="Pack no encontrado")
    
    # 2. Get or create Stripe Customer
    stripe_customer_id = await get_or_create_stripe_customer(user)
    
    # 3. Create Checkout Session
    session = stripe.checkout.Session.create(
        mode="payment",
        customer=stripe_customer_id,
        line_items=[{"price": pack["stripe_price_id"], "quantity": 1}],
        success_url=f"{FRONTEND_URL}/dashboard?payment=success",
        cancel_url=f"{FRONTEND_URL}/buy-credits",
        metadata={
            "user_id": user.user_id,
            "pack_id": req.pack_id,
            "credits": str(pack["credits"]),
        },
    )
    
    return {"checkout_url": session.url}
```

#### `GET /api/v1/billing/balance`
Returns current credit balance for the logged-in user.

```python
# Response
{
  "credits_remaining": 62,
  "total_purchased": 120,
  "total_consumed": 58
}
```

#### `GET /api/v1/billing/transactions`
Returns recent credit transactions (paginated).

```python
# Response
{
  "transactions": [
    {"date": "2026-03-02T19:30:00Z", "type": "generation", "amount": -2, "balance": 62, "description": "Generación imagen"},
    {"date": "2026-03-02T18:00:00Z", "type": "purchase", "amount": 80, "balance": 64, "description": "Compra de 80 créditos"},
  ],
  "has_more": false
}
```

---

### 3.2 Webhook Endpoint

#### `POST /api/v1/webhooks/stripe`
**No JWT auth.** Validated via Stripe signature header.

```python
@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    await handle_stripe_event(event)
    return {"status": "ok"}
```

---

## 4. Webhook Event Handlers

### 4.1 Event Matrix (Simplified — No Subscriptions!)

| Stripe Event | Action | DB Operation |
|-------------|--------|-------------|
| `checkout.session.completed` | Grant purchased credits | `add_purchased_credits()` |
| `payment_intent.payment_failed` | Log failure, notify user | Log only |

**That's it.** Only 2 events to handle vs. 6 in the subscription model.

### 4.2 Handler: `checkout.session.completed`
```python
async def handle_checkout_completed(session):
    if session.mode != "payment":
        return  # Ignore if not a one-time payment
    
    user_id = session.metadata["user_id"]
    credits = int(session.metadata["credits"])
    payment_intent_id = session.payment_intent
    
    # Idempotency check: don't double-grant
    existing = await get_transaction_by_reference(payment_intent_id)
    if existing:
        return  # Already processed
    
    # Grant credits atomically
    await add_purchased_credits(
        user_id=user_id,
        amount=credits,
        stripe_payment_id=payment_intent_id,
    )
    
    # Update Stripe customer ID if not set
    await update_profile_stripe_customer(user_id, session.customer)
```

---

## 5. Environment Variables

```env
# Backend only — NEVER in frontend
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Frontend (public — only publishable key)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## 6. Security Checklist
- [ ] Stripe Secret Key in env vars only, never in code
- [ ] Webhook validates `stripe-signature` before any processing
- [ ] Webhook excluded from JWT middleware
- [ ] Idempotency: duplicate `payment_intent` IDs are ignored
- [ ] Credit amounts come from `metadata` set server-side (never from frontend)

---

## 7. Acceptance Criteria
- [ ] User can buy any credit pack via Stripe Checkout
- [ ] Credits appear in balance immediately after successful payment
- [ ] Webhook correctly verifies Stripe signature
- [ ] Duplicate payments don't double-grant credits (idempotency)
- [ ] `GET /billing/balance` returns correct real-time balance
- [ ] `GET /billing/transactions` shows full purchase and usage history
