"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { useWizardStore } from "@/store/wizard";
import { t } from "@/lib/i18n";

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;

export default function StepUpload() {
  const setImage = useWizardStore((s) => s.setImage);
  const preview = useWizardStore((s) => s.originalImagePreview);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;

      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          alert(t.upload.minRes);
          URL.revokeObjectURL(url);
          return;
        }
        setImage(file, url);
      };
      img.src = url;
    },
    [setImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">{t.upload.title}</h2>
      <p className="text-gray-400 text-center max-w-md">{t.upload.subtitle}</p>

      {preview ? (
        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-gray-700">
          <img src={preview} alt="Plato subido" className="w-full h-full object-cover" />
          <button
            onClick={() => useWizardStore.getState().reset()}
            className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-black/80 transition-colors duration-200"
            aria-label={t.upload.change}
          >
            {t.upload.change}
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full max-w-md aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-200 ${
            isDragActive
              ? "border-amber-500 bg-amber-500/10"
              : "border-gray-600 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} aria-label={t.upload.title} />
          {isDragActive ? (
            <ImageIcon className="w-16 h-16 text-amber-500" />
          ) : (
            <Upload className="w-16 h-16 text-gray-500" />
          )}
          <p className="text-gray-400 text-center px-8">{t.upload.dropzone}</p>
          <p className="text-gray-600 text-sm">{t.upload.formats}</p>
        </div>
      )}
    </div>
  );
}
