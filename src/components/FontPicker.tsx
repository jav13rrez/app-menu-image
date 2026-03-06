"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Star, ChevronDown } from "lucide-react";
import { FONTS, FONT_CATEGORY_LABELS, type FontConfig, type FontCategory } from "@/lib/fonts";

// ---------------------------------------------------------------------------
// Favorites persistence via localStorage
// ---------------------------------------------------------------------------

const STORAGE_KEY = "fs_favorite_fonts";

function loadFavorites(): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed: unknown = JSON.parse(raw);
            if (Array.isArray(parsed)) return new Set(parsed as string[]);
        }
    } catch {
        // Corrupted data — reset silently
    }
    return new Set();
}

function saveFavorites(favs: Set<string>): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...favs]));
    } catch {
        // Storage full or unavailable — fail silently
    }
}

// ---------------------------------------------------------------------------
// Custom hook
// ---------------------------------------------------------------------------

function useFavoriteFonts() {
    const [favorites, setFavorites] = useState<Set<string>>(() => loadFavorites());

    const toggleFavorite = useCallback((family: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(family)) {
                next.delete(family);
            } else {
                next.add(family);
            }
            saveFavorites(next);
            return next;
        });
    }, []);

    return { favorites, toggleFavorite } as const;
}

// ---------------------------------------------------------------------------
// FontPicker Component
// ---------------------------------------------------------------------------

interface FontPickerProps {
    value: string;
    onChange: (family: string) => void;
}

export default function FontPicker({ value, onChange }: FontPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { favorites, toggleFavorite } = useFavoriteFonts();

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen]);

    // Separate favorites from the rest
    const favoriteFonts = FONTS.filter((f) => favorites.has(f.family));
    const otherFonts = FONTS.filter((f) => !favorites.has(f.family));

    // Group remaining fonts by category
    const grouped = otherFonts.reduce<Record<FontCategory, FontConfig[]>>(
        (acc, font) => {
            if (!acc[font.category]) acc[font.category] = [];
            acc[font.category].push(font);
            return acc;
        },
        {} as Record<FontCategory, FontConfig[]>,
    );

    const categoryOrder: FontCategory[] = ["condensed", "elegant", "casual", "display", "body"];

    return (
        <div ref={containerRef} className="relative flex-1 min-w-[90px]">
            {/* ── Trigger Button ── */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-1 bg-gray-800 text-white text-xs border border-gray-700 rounded p-1.5 cursor-pointer hover:border-gray-600 transition-colors"
            >
                <span
                    className="truncate"
                    style={{ fontFamily: `"${value}", sans-serif` }}
                >
                    {value}
                </span>
                <ChevronDown
                    className={`w-3 h-3 text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* ── Dropdown Panel ── */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 mt-1 w-64 max-h-[280px] overflow-y-auto bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-[100] scrollbar-thin"
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255,255,255,0.1) transparent",
                    }}
                >
                    {/* ── Favorites Section ── */}
                    {favoriteFonts.length > 0 && (
                        <div className="p-1.5">
                            <div className="flex items-center gap-1.5 px-2 py-1">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                                    Mis Favoritas
                                </span>
                            </div>
                            {favoriteFonts.map((font) => (
                                <FontRow
                                    key={font.family}
                                    font={font}
                                    isSelected={value === font.family}
                                    isFavorite
                                    onSelect={() => { onChange(font.family); setIsOpen(false); }}
                                    onToggleFavorite={() => toggleFavorite(font.family)}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Divider ── */}
                    {favoriteFonts.length > 0 && otherFonts.length > 0 && (
                        <div className="h-px bg-gray-700/60 mx-3" />
                    )}

                    {/* ── All Fonts by Category ── */}
                    <div className="p-1.5">
                        {categoryOrder.map((cat) => {
                            const fonts = grouped[cat];
                            if (!fonts || fonts.length === 0) return null;
                            return (
                                <div key={cat}>
                                    <div className="px-2 pt-2 pb-1">
                                        <span className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">
                                            {FONT_CATEGORY_LABELS[cat]}
                                        </span>
                                    </div>
                                    {fonts.map((font) => (
                                        <FontRow
                                            key={font.family}
                                            font={font}
                                            isSelected={value === font.family}
                                            isFavorite={false}
                                            onSelect={() => { onChange(font.family); setIsOpen(false); }}
                                            onToggleFavorite={() => toggleFavorite(font.family)}
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// FontRow — Individual font item in the picker
// ---------------------------------------------------------------------------

interface FontRowProps {
    font: FontConfig;
    isSelected: boolean;
    isFavorite: boolean;
    onSelect: () => void;
    onToggleFavorite: () => void;
}

function FontRow({ font, isSelected, isFavorite, onSelect, onToggleFavorite }: FontRowProps) {
    return (
        <div
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${isSelected
                ? "bg-amber-600/20 text-amber-300"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                } ${isFavorite ? "border-l-2 border-amber-500/60" : ""}`}
        >
            {/* Star button */}
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className="shrink-0 p-0.5 cursor-pointer transition-colors"
                aria-label={isFavorite ? "Quitar de favoritas" : "Añadir a favoritas"}
            >
                <Star
                    className={`w-3 h-3 transition-colors ${isFavorite
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-600 group-hover:text-gray-400"
                        }`}
                />
            </button>

            {/* Font name rendered in its own typeface */}
            <button
                type="button"
                onClick={onSelect}
                className="flex-1 text-left text-sm truncate cursor-pointer bg-transparent border-none p-0"
                style={{ fontFamily: `"${font.family}", sans-serif` }}
            >
                {font.family}
            </button>
        </div>
    );
}
