"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ChefHat, Loader2 } from "lucide-react";
import { useBillingStore } from "@/store/billing";
import CreditBadge from "@/components/CreditBadge";

function DashboardContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isSuccess = searchParams.get("payment") === "success";
    const { fetchBalance, isLoading } = useBillingStore();
    const [verifying, setVerifying] = useState(isSuccess);

    useEffect(() => {
        // Fetch real balance from API
        const loadBalance = async () => {
            await fetchBalance();
            if (isSuccess) {
                // Wait briefly to ensure webhook was processed before confirming
                setTimeout(() => {
                    setVerifying(false);
                }, 2000);
            }
        };
        loadBalance();
    }, [fetchBalance, isSuccess]);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--fs-border)]">
                <div className="flex items-center gap-3">
                    <ChefHat className="w-8 h-8 text-[var(--fs-accent)]" />
                    <h1 className="text-xl font-heading font-bold">FoodSocial AI</h1>
                </div>
                <CreditBadge />
            </header>

            <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full flex flex-col items-center justify-center">
                {isSuccess && (
                    <div className="mb-12 text-center max-w-md w-full bg-[#141414] border border-[#ea580c]/30 rounded-2xl p-8" style={{ boxShadow: "0 0 30px rgba(234, 88, 12, 0.1)" }}>
                        {verifying ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <Loader2 className="w-16 h-16 text-[#ea580c] animate-spin mb-4" />
                                <h2 className="text-2xl font-bold mb-2">Procesando pago...</h2>
                                <p className="text-[var(--fs-text-secondary)]">
                                    Verificando con Stripe y acreditando tu cuenta.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">¡Pago Completado!</h2>
                                <p className="text-[var(--fs-text-secondary)] mb-6">
                                    Tus créditos ya están disponibles en tu cuenta. Mira arriba a la derecha.
                                </p>
                                <button
                                    onClick={() => router.push("/buy-credits")}
                                    className="fs-btn-primary w-full py-3"
                                >
                                    ¡Genial!
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="text-center opacity-50">
                    <h2 className="text-2xl font-heading mb-4">Dashboard</h2>
                    <p>Aquí irá la interfaz principal para crear las publicaciones.</p>
                </div>
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#ea580c]" /></div>}>
            <DashboardContent />
        </Suspense>
    );
}
