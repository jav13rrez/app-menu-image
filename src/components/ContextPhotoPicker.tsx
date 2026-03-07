"use client";

import { useEffect, useState } from "react";
import { useWizardStore } from "@/store/wizard";
import { ImagePlus, Trash2, Check, X } from "lucide-react";
import { getAuthHeaders } from "@/lib/auth-headers";

interface ContextPhoto {
    id: string;
    image_url: string;
    thumbnail_url: string | null;
    ai_description: string | null;
    label: string;
    sort_order: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ContextPhotoPicker() {
    const [photos, setPhotos] = useState<ContextPhoto[]>([]);
    const [maxPhotos, setMaxPhotos] = useState(10);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedContextPhotoId = useWizardStore((s) => s.selectedContextPhotoId);
    const setSelectedContextPhotoId = useWizardStore((s) => s.setSelectedContextPhotoId);

    // Client-side image resizing constraint
    const MAX_PHOTO_DIMENSION = 1024;

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    let { width, height } = img;

                    if (width > MAX_PHOTO_DIMENSION || height > MAX_PHOTO_DIMENSION) {
                        const ratio = Math.min(MAX_PHOTO_DIMENSION / width, MAX_PHOTO_DIMENSION / height);
                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return reject("Canvas ctx not found");

                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.85)); // 85% JS JPEG compression 
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

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
            const resizedImageUrl = await resizeImage(file);

            const res = await fetch(`${API_BASE}/api/v1/context-photos/`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    image_url: resizedImageUrl,
                    label: file.name.replace(/\.[^.]+$/, "") || "Mi espacio",
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setPhotos((prev) => [...prev, data.photo]);
            } else {
                let errorMsg = "Error al subir la foto.";
                try {
                    const err = await res.json();
                    errorMsg = err.detail || errorMsg;
                } catch {
                    // response wasn't JSON
                }
                setError(errorMsg);
            }
        } catch (err: any) {
            console.error("Context photo upload error details:", err);
            setError(`Error: ${err?.message || err}`);
        } finally {
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
            {/* Photo Grid — includes "Sin fondo" as first option */}
            <div className="flex flex-wrap gap-3">
                {/* ── "Sin fondo de contexto" card as first grid item ── */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setSelectedContextPhotoId(null)}
                        className={`w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${selectedContextPhotoId === null
                            ? "border-2 border-red-500/70 bg-red-500/10 text-red-400"
                            : "border border-gray-600 bg-gray-800/60 text-gray-500 hover:border-gray-500"
                            }`}
                    >
                        <X className={`w-5 h-5 ${selectedContextPhotoId === null ? "text-red-400" : "text-gray-500"}`} />
                        <span className="text-[9px] text-center leading-tight px-1">
                            Sin fondo
                        </span>
                    </button>
                </div>

                {/* ── Uploaded photos ── */}
                {photos.map((photo) => (
                    <div
                        key={photo.id}
                        className="relative group"
                    >
                        <button
                            type="button"
                            onClick={() => handleSelect(photo.id)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedContextPhotoId === photo.id
                                ? "border-amber-500 shadow-[0_0_16px_rgba(245,158,11,0.4)]"
                                : "border-gray-700 hover:border-gray-500"
                                }`}
                        >
                            <img
                                src={photo.thumbnail_url || photo.image_url}
                                alt={photo.label}
                                className="w-full h-full object-cover"
                            />
                            {selectedContextPhotoId === photo.id && (
                                <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                                    </div>
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
                        <span className="block text-[10px] text-center text-gray-500 mt-1 truncate max-w-[80px]">
                            {photo.label}
                        </span>
                    </div>
                ))}

                {/* Upload Button */}
                {photos.length < maxPhotos && (
                    <label
                        className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${isUploading
                            ? "border-amber-500 opacity-50"
                            : "border-gray-700 hover:border-gray-500"
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
                            <span className="text-xs text-gray-500 animate-pulse">...</span>
                        ) : (
                            <>
                                <ImagePlus className="w-5 h-5 text-gray-500" />
                                <span className="text-[10px] text-gray-500">
                                    +2 cr
                                </span>
                            </>
                        )}
                    </label>
                )}
            </div>

            {/* Counter */}
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    {photos.length}/{maxPhotos} espacios
                </span>
            </div>

            {/* Error message */}
            {error && (
                <div className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                    {error}
                </div>
            )}
        </div>
    );
}
