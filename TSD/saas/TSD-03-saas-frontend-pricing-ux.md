# TSD-03: Frontend — Buy Credits Page & Credit UX
**Project:** FoodSocial AI — SaaS Transformation
**Module:** Next.js Client Application
**Status:** DRAFT v2 — On-Demand Credits (Replicate model)
**Dependency:** TSD-01 (credit pack data), TSD-02 (Stripe Checkout URLs)

---

## 1. Purpose
This TSD covers all frontend changes to support the prepaid credit model:
- Public landing with CTA to sign up.
- Auth-gated "Buy Credits" page (Replicate-style).
- Real-time credit balance display.
- Credit exhaustion handling and prompts to buy more.

---

## 2. New Routes

| Route | Access | Component | Purpose |
|-------|--------|-----------|---------|
| `/` | Public | `LandingPage` | Hero + value prop + CTA to signup |
| `/login` | Public | `LoginPage` | Supabase Auth (Magic Link / Google OAuth) |
| `/signup` | Public | `SignupPage` | Registration → redirect to `/dashboard` |
| `/dashboard` | Auth | `DashboardPage` | Credit balance + "New Creation" + "Buy Credits" |
| `/create` | Auth | `WizardPage` | The existing wizard (moved from `/`) |
| `/buy-credits` | Auth | `BuyCreditsPage` | Credit pack selector + Stripe Checkout |
| `/account` | Auth | `AccountPage` | Profile + transaction history |

### 2.1 Auth Middleware
```typescript
// middleware.ts
const protectedRoutes = ['/dashboard', '/create', '/buy-credits', '/account'];
```

---

## 3. Buy Credits Page (Core New Page)

### 3.1 Layout — Replicate-Style
```
┌──────────────────────────────────────────────┐
│ Billing / Comprar créditos                   │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │         │  │         │  │         │      │
│  │   €10   │  │   €20   │  │   €50   │      │
│  │  40 cr  │  │  80 cr  │  │  200 cr │      │
│  │         │  │         │  │         │      │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                              │
│  Tu saldo actual: 42 créditos               │
│                                              │
│  ┌──────────────────────────────────────┐   │
│  │ ℹ️ Los créditos no caducan.          │   │
│  │ Puedes comprar más en cualquier      │   │
│  │ momento.                             │   │
│  └──────────────────────────────────────┘   │
│                                              │
│  ¿Qué consume créditos?                     │
│  • Generar imagen estándar: 2 créditos      │
│  • Analizar foto de interior: 2 créditos    │
│  • Variación/regeneración: 2 créditos       │
│                                              │
│        [ Comprar €20 en créditos ]           │
│                                              │
└──────────────────────────────────────────────┘
```

### 3.2 Component: `<CreditPackSelector>`

```typescript
interface CreditPack {
  id: string;
  credits: number;
  priceEur: number;
}

const PACKS: CreditPack[] = [
  { id: "pack_10", credits: 40, priceEur: 10 },
  { id: "pack_20", credits: 80, priceEur: 20 },
  { id: "pack_50", credits: 200, priceEur: 50 },
];
```

**Behavior:**
1. User selects a pack (default: €20).
2. Click CTA → calls `POST /api/v1/billing/buy-credits`.
3. Frontend redirects to `checkout_url` (Stripe hosted page).
4. On success, Stripe redirects to `/dashboard?payment=success`.
5. Dashboard fetches updated balance from `GET /api/v1/billing/balance`.

### 3.3 Success Toast (Post-Purchase)
When redirected back with `?payment=success`:
```
┌─────────────────────────────────────┐
│ ✅ ¡Créditos añadidos con éxito!    │
│ Tu nuevo saldo: 122 créditos        │
└─────────────────────────────────────┘
```

---

## 4. Credit Balance UX

### 4.1 Zustand Store

```typescript
// store/billing.ts
interface BillingState {
  creditsRemaining: number;
  totalPurchased: number;
  totalConsumed: number;
  isLoading: boolean;

  fetchBalance: () => Promise<void>;
  decrementCredits: (amount: number) => void;
}
```

### 4.2 `<CreditBadge>` — Persistent Header Component
Visible on all authenticated pages (dashboard, wizard, account).

```
┌────────────────────────┐
│ 🔥 42 créditos         │
│ [+ Comprar]            │
└────────────────────────┘
```

**Visual States:**

| Credits | Color | Behavior |
|---------|-------|----------|
| > 20 | Green | Normal |
| 6 – 20 | Amber | Warning icon |
| 1 – 5 | Red | Pulse animation |
| 0 | Red | "Compra créditos" link emphasized |

### 4.3 Zero-Credits Modal
When `creditsRemaining < 2` and user clicks "Generate":

```
┌──────────────────────────────────────┐
│ ⚠️ Créditos insuficientes           │
│                                      │
│ Necesitas al menos 2 créditos        │
│ para generar una imagen.             │
│                                      │
│ Tu saldo: 0 créditos                │
│                                      │
│     [ Comprar créditos → ]           │
│                                      │
└──────────────────────────────────────┘
```

---

## 5. Dashboard Page

### 5.1 Layout
```
┌──────────────────────────────────────────┐
│ ¡Hola, [nombre]!                         │
├──────────────────────────────────────────┤
│                                          │
│  Tu saldo                                │
│  ┌──────────────────────────────────┐   │
│  │  🔥 42 créditos disponibles      │   │
│  │  Total comprado: 120             │   │
│  │  Total usado: 78                 │   │
│  │                                  │   │
│  │  [+ Comprar más créditos]        │   │
│  └──────────────────────────────────┘   │
│                                          │
│  [ 🎨 Crear nueva publicación ]          │
│                                          │
│  Historial reciente                      │
│  ┌──────────────────────────────────┐   │
│  │ Hoy      Generación    -2  → 42 │   │
│  │ Hoy      Generación    -2  → 44 │   │
│  │ Ayer     Compra 80 cr  +80 → 46 │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

---

## 6. Wizard Flow Changes

### 6.1 Pre-Generation Credit Check (UX Guard)
Before submitting to `/api/v1/generate`:
1. Check `billingStore.creditsRemaining >= 2`.
2. If insufficient → show Zero-Credits Modal.
3. If sufficient → proceed (backend enforces the real check).

### 6.2 Post-Generation
After `job.status === 'completed'`:
- `billingStore.decrementCredits(2)` optimistically.
- On next API call, re-sync from `GET /billing/balance`.

---

## 7. Welcome Bonus Flow
New users get **10 free credits** (5 generations to try the product).

After signup:
```
┌──────────────────────────────────────┐
│ 🎉 ¡Bienvenido a FoodSocial AI!     │
│                                      │
│ Te hemos regalado 10 créditos        │
│ para que pruebes la aplicación.      │
│                                      │
│ Eso son 5 generaciones de imagen     │
│ completamente gratis.                │
│                                      │
│     [ Crear mi primera imagen → ]    │
│                                      │
└──────────────────────────────────────┘
```

---

## 8. Design Standards
- **Dark Mode first** (consistent with current app).
- **Credit pack cards:** Glassmorphism border, amber accent on selected pack.
- **Animations:** Counter animation on CreditBadge updates, subtle fade on pack selection.
- **Mobile:** Pack cards stack 1-column, full-width CTA.
- **Typography:** Existing Google Fonts system.

---

## 9. Acceptance Criteria
- [ ] Buy Credits page renders 3 pack options
- [ ] Selected pack highlights with amber border
- [ ] CTA click sends to Stripe Checkout and redirects back on success
- [ ] CreditBadge shows correct real-time balance on all auth pages
- [ ] Zero-credits modal blocks generation and links to Buy Credits
- [ ] Dashboard shows transaction history
- [ ] Welcome bonus toast appears for new users
- [ ] All pages responsive and dark theme consistent
