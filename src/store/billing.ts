import { create } from "zustand";
import { getAuthHeaders } from "@/lib/auth-headers";

interface BalanceData {
    creditsRemaining: number;
    totalPurchased: number;
    totalConsumed: number;
}

interface CreditTransaction {
    id: string;
    amount: number;
    balance_after: number;
    type: string;
    reference_id: string | null;
    description: string | null;
    created_at: string;
}

interface BillingState extends BalanceData {
    isLoading: boolean;
    transactions: CreditTransaction[];
    hasMoreTransactions: boolean;

    fetchBalance: () => Promise<void>;
    fetchTransactions: (offset?: number) => Promise<void>;
    decrementCredits: (amount: number) => void;
    reset: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useBillingStore = create<BillingState>()((set) => ({
    creditsRemaining: 0,
    totalPurchased: 0,
    totalConsumed: 0,
    isLoading: false,
    transactions: [],
    hasMoreTransactions: false,

    fetchBalance: async () => {
        set({ isLoading: true });
        try {
            const res = await fetch(`${API_BASE}/api/v1/billing/balance`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                set({
                    creditsRemaining: data.credits_remaining,
                    totalPurchased: data.total_purchased,
                    totalConsumed: data.total_consumed,
                });
            }
        } catch {
            // Silently fail — will show 0 credits
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTransactions: async (offset = 0) => {
        try {
            const res = await fetch(
                `${API_BASE}/api/v1/billing/transactions?limit=20&offset=${offset}`,
                { headers: getAuthHeaders() },
            );
            if (res.ok) {
                const data = await res.json();
                set((state) => ({
                    transactions:
                        offset === 0
                            ? data.transactions
                            : [...state.transactions, ...data.transactions],
                    hasMoreTransactions: data.has_more,
                }));
            }
        } catch {
            // Silently fail
        }
    },

    decrementCredits: (amount: number) => {
        set((state) => ({
            creditsRemaining: Math.max(0, state.creditsRemaining - amount),
            totalConsumed: state.totalConsumed + amount,
        }));
    },

    reset: () =>
        set({
            creditsRemaining: 0,
            totalPurchased: 0,
            totalConsumed: 0,
            transactions: [],
            hasMoreTransactions: false,
        }),
}));
