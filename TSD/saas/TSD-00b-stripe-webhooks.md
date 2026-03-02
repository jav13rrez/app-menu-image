# TSD-00b: Stripe Webhooks Reference (Simplified)
**Project:** FoodSocial AI
**Model:** One-Time Payments Only (No Subscriptions)

---

## Webhook Endpoint
`POST /api/v1/billing/webhooks/stripe` — No JWT auth, validated via Stripe signature.

## Events to Handle (Only 2!)

| Stripe Event | Action | DB Operation |
|-------------|--------|-------------|
| `checkout.session.completed` | Grant purchased credits | `add_purchased_credits()` RPC |
| `payment_intent.payment_failed` | Log failure | Log only, no credit change |

## Security
1. Validate `stripe-signature` with `STRIPE_WEBHOOK_SECRET`
2. Check idempotency (don't double-grant on replay)
3. Credit amounts from server-side `metadata`, never from frontend

## Full Spec
→ [TSD-02: Stripe Integration](./TSD-02-saas-stripe-webhooks.md)