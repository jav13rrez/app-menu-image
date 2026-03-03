"""Billing API — Credit purchases via Stripe Checkout."""
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from app.core.auth import get_current_user, CurrentUser
from app.core.config import (
    API_V1_PREFIX,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET,
    FRONTEND_URL,
)
from app.core.supabase_client import get_supabase
from app.models.schemas import (
    BuyCreditRequest,
    BuyCreditResponse,
    BalanceResponse,
    TransactionsResponse,
)

billing_router = APIRouter(prefix=f"{API_V1_PREFIX}/billing", tags=["billing"])


@billing_router.get("/balance", response_model=BalanceResponse)
async def get_balance(user: CurrentUser = Depends(get_current_user)):
    """Returns the current credit balance for the authenticated user."""
    supabase = get_supabase()
    resp = (
        supabase.table("credit_balances")
        .select("credits_remaining, total_purchased, total_consumed")
        .eq("user_id", user.user_id)
        .maybe_single()
        .execute()
    )
    data = resp.data if resp.data else {}
    return BalanceResponse(
        credits_remaining=data.get("credits_remaining", 0),
        total_purchased=data.get("total_purchased", 0),
        total_consumed=data.get("total_consumed", 0),
    )


@billing_router.get("/transactions", response_model=TransactionsResponse)
async def get_transactions(
    user: CurrentUser = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0,
):
    """Returns paginated credit transaction history."""
    supabase = get_supabase()
    resp = (
        supabase.table("credit_transactions")
        .select("id, amount, balance_after, type, reference_id, description, created_at")
        .eq("user_id", user.user_id)
        .order("created_at", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    return TransactionsResponse(
        transactions=resp.data or [],
        has_more=len(resp.data or []) == limit,
    )


@billing_router.post("/buy-credits", response_model=BuyCreditResponse)
async def buy_credits(
    req: BuyCreditRequest,
    user: CurrentUser = Depends(get_current_user),
):
    """Creates a Stripe Checkout Session for a one-time credit purchase."""
    if not STRIPE_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Pagos no configurados. Contacta al administrador.",
        )

    stripe.api_key = STRIPE_SECRET_KEY
    supabase = get_supabase()

    # Validate pack exists
    pack_resp = (
        supabase.table("credit_packs")
        .select("*")
        .eq("id", req.pack_id)
        .eq("is_active", True)
        .maybe_single()
        .execute()
    )
    if not pack_resp.data:
        raise HTTPException(status_code=404, detail="Pack de créditos no encontrado.")

    pack = pack_resp.data

    if not pack.get("stripe_price_id"):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Pack no vinculado a Stripe. Contacta al administrador.",
        )

    # Get or create Stripe Customer
    customer_id = user.stripe_customer_id
    if not customer_id:
        customer = stripe.Customer.create(
            metadata={"user_id": user.user_id},
        )
        customer_id = customer.id
        supabase.table("profiles").update(
            {"stripe_customer_id": customer_id}
        ).eq("id", user.user_id).execute()

    # Create Checkout Session
    session = stripe.checkout.Session.create(
        mode="payment",
        customer=customer_id,
        line_items=[{"price": pack["stripe_price_id"], "quantity": 1}],
        success_url=f"{FRONTEND_URL}/dashboard?payment=success",
        cancel_url=f"{FRONTEND_URL}/buy-credits",
        metadata={
            "user_id": user.user_id,
            "pack_id": req.pack_id,
            "credits": str(pack["credits"]),
        },
    )

    return BuyCreditResponse(checkout_url=session.url or "")


@billing_router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    """Handles Stripe webhook events — NO JWT auth, validated via signature."""
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=503, detail="Webhook no configurado.")

    stripe.api_key = STRIPE_SECRET_KEY
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Firma inválida.")

    # Handle events
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        if session.get("mode") == "payment":
            await _handle_payment_completed(session)

    return {"status": "ok"}


async def _handle_payment_completed(session: dict) -> None:
    """Grant credits after successful one-time payment."""
    metadata = session.get("metadata", {})
    user_id = metadata.get("user_id")
    credits = int(metadata.get("credits", 0))
    payment_intent = session.get("payment_intent", "")

    if not user_id or credits <= 0:
        return  # Invalid metadata, ignore

    supabase = get_supabase()

    # Idempotency: check if already processed
    existing = (
        supabase.table("credit_transactions")
        .select("id")
        .eq("reference_id", payment_intent)
        .maybe_single()
        .execute()
    )
    if existing.data:
        return  # Already processed — skip

    # Grant credits
    supabase.rpc("add_purchased_credits", {
        "p_user_id": user_id,
        "p_amount": credits,
        "p_stripe_payment_id": payment_intent,
    }).execute()

    # Ensure Stripe customer ID is saved
    customer_id = session.get("customer")
    if customer_id:
        supabase.table("profiles").update(
            {"stripe_customer_id": customer_id}
        ).eq("id", user_id).execute()
