# TSD-00a: SaaS Billing Model Reference
**Project:** FoodSocial AI
**Model:** On-Demand Prepaid Credits (Replicate-style)

---

## Credit Purchase Flow (End-to-End)
```
1. User clicks "Buy Credits" → selects pack (€10/€20/€50)
2. Frontend calls POST /billing/buy-credits → receives checkout_url
3. User pays on Stripe Checkout (one-time payment)
4. Stripe fires webhook: checkout.session.completed
5. Backend: add_purchased_credits() → credits added to balance
6. User generates → POST /generate → consume_credits() → -2 atomically
7. If generation fails → refund_credits_on_failure() → +2 back
```

## Credit Packs
| Pack | Credits | Price | €/credit |
|------|:-------:|:-----:|:--------:|
| Small | 40 | €10 | €0.25 |
| Medium | 80 | €20 | €0.25 |
| Large | 200 | €50 | €0.25 |

## Cost Matrix
| Action | Credits |
|--------|:-------:|
| Generate image (std) | 2 |
| Generate image (HD) | 3 |
| Context photo upload | 1 |
| Context photo analysis | 1 |
| Regenerate variation | 2 |

## Key Documents
| TSD | Focus |
|-----|-------|
| [TSD-01](./TSD-01-saas-database-billing.md) | DB schema: `credit_packs`, `credit_balances`, `credit_transactions` |
| [TSD-02](./TSD-02-saas-stripe-webhooks.md) | Stripe one-time Checkout + webhook handler |
| [TSD-03](./TSD-03-saas-frontend-pricing-ux.md) | Buy Credits page, CreditBadge, welcome bonus |
| [TSD-04](./TSD-04-saas-backend-quota-enforcement.md) | Auth + atomic deduction + refund on failure |