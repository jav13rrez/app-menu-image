"use client";

import { useBillingStore } from "@/store/billing";
import { useEffect } from "react";
import { Flame, Plus } from "lucide-react";
import Link from "next/link";

export default function CreditBadge() {
    const { creditsRemaining, isLoading, fetchBalance } = useBillingStore();

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    const getColor = () => {
        if (creditsRemaining > 20) return "text-green-400";
        if (creditsRemaining > 5) return "text-amber-400";
        return "text-red-400";
    };

    const getPulse = () => {
        if (creditsRemaining <= 5 && creditsRemaining > 0) return "animate-pulse";
        return "";
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full fs-card text-sm">
                <span className="w-3 h-3 rounded-full bg-gray-600 animate-pulse" />
                <span className="text-[var(--fs-text-muted)]">...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full fs-card text-sm ${getPulse()}`}
            >
                <Flame className={`w-4 h-4 ${getColor()}`} />
                <span className={`font-medium ${getColor()} animate-counter`}>
                    {creditsRemaining}
                </span>
                <span className="text-[var(--fs-text-muted)] hidden sm:inline">
                    créditos
                </span>
            </div>
            <Link
                href="/buy-credits"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full fs-btn-ghost text-xs hover:border-[var(--fs-border-accent)] transition-colors"
            >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Comprar</span>
            </Link>
        </div>
    );
}
