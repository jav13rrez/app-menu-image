"use client";

import { useState } from "react";
import { ChefHat, CreditCard, Info, Check } from "lucide-react";
import { useBillingStore } from "@/store/billing";
import { getAuthHeaders } from "@/lib/auth-headers";
import CreditBadge from "@/components/CreditBadge";

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

const CREDIT_COSTS = [
    { action: "Generar imagen estándar", credits: 2 },
    { action: "Subir foto de contexto", credits: 2 },
    { action: "Variación / regeneración", credits: 2 },
];

export default function BuyCreditsPage() {
    const [selectedPack, setSelectedPack] = useState<string>("pack_20");
    const [isLoading, setIsLoading] = useState(false);
    const { creditsRemaining } = useBillingStore();

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const handlePurchase = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/v1/billing/buy-credits`, {
                method: "POST",
                headers: getAuthHeaders() as Record<string, string>,
                body: JSON.stringify({ pack_id: selectedPack }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.checkout_url) {
                    window.location.href = data.checkout_url;
                }
            } else {
                const err = await res.json();
                alert(err.detail || "Error al crear la sesión de pago.");
            }
        } catch {
            alert("Error de conexión. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const selected = PACKS.find((p) => p.id === selectedPack);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--fs-border)]">
                <div className="flex items-center gap-3">
                    <ChefHat className="w-8 h-8 text-[var(--fs-accent)]" />
                    <h1 className="text-xl font-heading font-bold">FoodSocial AI</h1>
                </div>
                <CreditBadge />
            </header>

            <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
                {/* Title */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                        Comprar créditos
                    </h2>
                    <p className="text-[var(--fs-text-secondary)]">
                        Selecciona la cantidad de créditos que necesitas.
                    </p>
                </div>

                {/* Pack Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {PACKS.map((pack) => (
                        <button
                            key={pack.id}
                            onClick={() => setSelectedPack(pack.id)}
                            className={`fs-card p-6 text-center cursor-pointer transition-all ${selectedPack === pack.id ? "fs-card-selected" : ""
                                }`}
                        >
                            {selectedPack === pack.id && (
                                <div className="flex justify-end mb-2">
                                    <Check className="w-5 h-5 text-[var(--fs-accent)]" />
                                </div>
                            )}
                            <div className="text-3xl font-heading font-bold mb-1">
                                €{pack.priceEur}
                            </div>
                            <div className="text-[var(--fs-text-secondary)] text-sm">
                                {pack.credits} créditos
                            </div>
                            <div className="text-[var(--fs-text-muted)] text-xs mt-1">
                                ~{Math.floor(pack.credits / 2)} generaciones
                            </div>
                        </button>
                    ))}
                </div>

                {/* Current Balance */}
                <div className="fs-card p-4 mb-6 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[var(--fs-text-muted)]" />
                    <span className="text-[var(--fs-text-secondary)] text-sm">
                        Tu saldo actual:{" "}
                        <span className="font-medium text-[var(--fs-text-primary)]">
                            {creditsRemaining} créditos
                        </span>
                    </span>
                </div>

                {/* Info Box */}
                <div className="fs-card p-4 mb-6 border-[var(--fs-accent-soft)] bg-[var(--fs-accent-soft)]">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-[var(--fs-accent)] mt-0.5 shrink-0" />
                        <p className="text-sm text-[var(--fs-text-secondary)]">
                            Los créditos <strong className="text-[var(--fs-text-primary)]">no caducan</strong>.
                            Puedes comprar más en cualquier momento.
                        </p>
                    </div>
                </div>

                {/* Credit Cost Table */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-[var(--fs-text-muted)] mb-3 uppercase tracking-wider">
                        ¿Qué consume créditos?
                    </h3>
                    <div className="space-y-2">
                        {CREDIT_COSTS.map((item) => (
                            <div
                                key={item.action}
                                className="flex items-center justify-between text-sm py-2 border-b border-[var(--fs-border)]"
                            >
                                <span className="text-[var(--fs-text-secondary)]">{item.action}</span>
                                <span className="font-medium text-[var(--fs-text-primary)]">
                                    {item.credits} cr
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handlePurchase}
                    disabled={isLoading || !selected}
                    className="w-full fs-btn-primary text-center text-lg font-semibold py-4 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Redirigiendo a Stripe...</span>
                    ) : (
                        <>
                            Comprar €{selected?.priceEur} en créditos
                        </>
                    )}
                </button>
            </main>
        </div>
    );
}
