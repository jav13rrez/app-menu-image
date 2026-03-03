"use client";

import { useEffect, useState } from "react";
import { useWizardStore } from "@/store/wizard";
import { ImagePlus, Trash2, Check, Camera, X } from "lucide-react";

interface ContextPhoto {
    id: string;
    image_url: string;
    thumbnail_url: string | null;
    ai_description: string | null;
    label: string;
    sort_order: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getAuthHeaders = (): HeadersInit => {
    const token =
        typeof window !== "undefined"
            ? ((window as unknown as Record<string, unknown>).__auth_token as string | undefined)
            : undefined;
    return token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };
};

export default function ContextPhotoPicker() {
    const [photos, setPhotos] = useState<ContextPhoto[]>([]);
    const [maxPhotos, setMaxPhotos] = useState(10);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedContextPhotoId = useWizardStore((s) => s.selectedContextPhotoId);
    const setSelectedContextPhotoId = useWizardStore((s) => s.setSelectedContextPhotoId);

    // Fetch photos on mount
    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/v1/context-photos/`, {
                headers: getAuthHeaders(),
            });
            if (res.ok) {
                const data = await res.json();
                setPhotos(data.photos || []);
                setMaxPhotos(data.max || 10);
            }
        } catch {
            // Silently fail — will show empty state
        }
    };

    const handleUpload = async (file: File) => {
        if (photos.length >= maxPhotos) return;

        setIsUploading(true);
        setError(null);

        try {
            // Convert to data URI for now (in production this would upload to Supabase Storage first)
            const reader = new FileReader();
            reader.onloadend = async () => {
                const imageUrl = reader.result as string;

                const res = await fetch(`${API_BASE}/api/v1/context-photos/`, {
                    method: "POST",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({
                        image_url: imageUrl,
                        label: file.name.replace(/\.[^.]+$/, "") || "Mi espacio",
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setPhotos((prev) => [...prev, data.photo]);
                } else {
                    const err = await res.json();
                    setError(err.detail || "Error al subir la foto.");
                }
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch {
            setError("Error de conexión.");
            setIsUploading(false);
        }
    };

    const handleDelete = async (photoId: string) => {
        try {
            const res = await fetch(
                `${API_BASE}/api/v1/context-photos/${photoId}`,
                { method: "DELETE", headers: getAuthHeaders() },
            );
            if (res.ok) {
                setPhotos((prev) => prev.filter((p) => p.id !== photoId));
                if (selectedContextPhotoId === photoId) {
                    setSelectedContextPhotoId(null);
                }
            }
        } catch {
            // Silently fail
        }
    };

    const handleSelect = (photoId: string) => {
        setSelectedContextPhotoId(
            selectedContextPhotoId === photoId ? null : photoId,
        );
    };

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-4 h-4 text-[var(--fs-accent)]" />
                    <h3 className="text-sm font-semibold text-[var(--fs-text-primary)]">
                        Agrega Contexto
                    </h3>
                </div>
                <p className="text-xs text-[var(--fs-text-muted)]">
                    La fotografía que elijas servirá de fondo de la imagen final. Puede
                    ser un rincón especial de tu local u otra imagen que desees.
                </p>
            </div>

            {/* Photo Grid */}
            <div className="flex flex-wrap gap-3">
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="relative group"
                    >
                        <button
                            type="button"
                            onClick={() => handleSelect(photo.id)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedContextPhotoId === photo.id
                                ? "border-[var(--fs-border-accent)] shadow-[0_0_12px_var(--fs-accent-glow)]"
                                : "border-[var(--fs-border)] hover:border-[var(--fs-border-hover)]"
                                }`}
                        >
                            <img
                                src={photo.thumbnail_url || photo.image_url}
                                alt={photo.label}
                                className="w-full h-full object-cover"
                            />
                            {selectedContextPhotoId === photo.id && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-[var(--fs-accent)]" />
                                </div>
                            )}
                        </button>
                        {/* Delete button */}
                        <button
                            type="button"
                            onClick={() => handleDelete(photo.id)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            title="Eliminar"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                        <span className="block text-[10px] text-center text-[var(--fs-text-muted)] mt-1 truncate max-w-[80px]">
                            {photo.label}
                        </span>
                    </div>
                ))}

                {/* Upload Button */}
                {photos.length < maxPhotos && (
                    <label
                        className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${isUploading
                            ? "border-[var(--fs-accent)] opacity-50"
                            : "border-[var(--fs-border)] hover:border-[var(--fs-border-hover)]"
                            }`}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploading}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(file);
                            }}
                        />
                        {isUploading ? (
                            <span className="text-xs text-[var(--fs-text-muted)] animate-pulse">...</span>
                        ) : (
                            <>
                                <ImagePlus className="w-5 h-5 text-[var(--fs-text-muted)]" />
                                <span className="text-[10px] text-[var(--fs-text-muted)]">
                                    +2 cr
                                </span>
                            </>
                        )}
                    </label>
                )}
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--fs-text-muted)]">
                    {photos.length}/{maxPhotos} espacios
                </span>
                {selectedContextPhotoId && (
                    <button
                        type="button"
                        onClick={() => setSelectedContextPhotoId(null)}
                        className="text-xs text-[var(--fs-text-muted)] hover:text-[var(--fs-text-secondary)] flex items-center gap-1 transition-colors"
                    >
                        <X className="w-3 h-3" />
                        Sin fondo de contexto
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="text-xs text-[var(--fs-error)] bg-red-500/10 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}
        </div>
    );
}
