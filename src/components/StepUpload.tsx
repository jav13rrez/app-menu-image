"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { useWizardStore, type AspectRatio } from "@/store/wizard";
import { t } from "@/lib/i18n";

const MIN_WIDTH = 400;
const MIN_HEIGHT = 400;

/* ── Aspect Ratio visual icons: mini rectangles showing the proportion ── */
interface RatioMeta {
  ratio: AspectRatio;
  label: string;
  /** SVG viewBox-relative rect sizes (w/h scaled to fit 24×24) */
  rectW: number;
  rectH: number;
}

const RATIOS: RatioMeta[] = [
  { ratio: "1:1", label: "1:1", rectW: 18, rectH: 18 },
  { ratio: "3:4", label: "3:4", rectW: 15, rectH: 20 },
  { ratio: "4:3", label: "4:3", rectW: 20, rectH: 15 },
  { ratio: "4:5", label: "4:5", rectW: 16, rectH: 20 },
  { ratio: "5:4", label: "5:4", rectW: 20, rectH: 16 },
  { ratio: "9:16", label: "9:16", rectW: 12, rectH: 22 },
  { ratio: "16:9", label: "16:9", rectW: 22, rectH: 12 },
];

function RatioIcon({ meta, selected }: { meta: RatioMeta; selected: boolean }) {
  const x = (24 - meta.rectW) / 2;
  const y = (24 - meta.rectH) / 2;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x={x}
        y={y}
        width={meta.rectW}
        height={meta.rectH}
        rx="2"
        stroke={selected ? "#f59e0b" : "#9ca3af"}
        strokeWidth="1.5"
        fill={selected ? "rgba(245,158,11,0.15)" : "transparent"}
      />
    </svg>
  );
}

export default function StepUpload() {
  const setImage = useWizardStore((s) => s.setImage);
  const preview = useWizardStore((s) => s.originalImagePreview);
  const selectedAspectRatio = useWizardStore((s) => s.selectedAspectRatio);
  const setAspectRatio = useWizardStore((s) => s.setAspectRatio);
  const dishName = useWizardStore((s) => s.dishName);
  const setDishName = useWizardStore((s) => s.setDishName);
  const businessName = useWizardStore((s) => s.businessName);
  const setBusinessName = useWizardStore((s) => s.setBusinessName);
  const location = useWizardStore((s) => s.location);
  const setLocation = useWizardStore((s) => s.setLocation);
  const postContext = useWizardStore((s) => s.postContext);
  const setPostContext = useWizardStore((s) => s.setPostContext);

  const [preset, setPreset] = useState<string>("");

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPreset(val);
    if (val !== "custom" && val !== "") {
      const contextText = t.upload.presets[val as keyof typeof t.upload.presets];
      setPostContext(contextText);
    } else if (val === "") {
      setPostContext("");
    }
  };

  const MAX_PHOTO_DIMENSION = 1024;

  const resizeImage = (file: File): Promise<Blob> => {
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
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject("Blob conversion failed");
            }
          }, "image/jpeg", 0.85); // 85% JS JPEG compression 
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;

      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = async () => {
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          alert(t.upload.minRes);
          URL.revokeObjectURL(url);
          return;
        }

        try {
          const resizedBlob = await resizeImage(file);
          const resizedFile = new File([resizedBlob], file.name.replace(/\.[^.]+$/, ".jpg"), {
            type: "image/jpeg",
            lastModified: Date.now()
          });
          const resizedUrl = URL.createObjectURL(resizedBlob);
          setImage(resizedFile, resizedUrl);
          URL.revokeObjectURL(url); // Clean up the original large image url
        } catch (e) {
          console.error("Failed to resize image, using original", e);
          setImage(file, url);
        }

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

  const inputClasses =
    "w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-600 transition-all";

  return (
    <div className="flex flex-col gap-8">
      {/* ── Upload Area ── */}
      <div className="flex flex-col items-center gap-4">
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
            className={`w-full max-w-md aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors duration-200 ${isDragActive
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

      {/* ── Aspect Ratio ── */}
      <div>
        <h3 className="text-lg font-bold mb-1">{t.upload.formatTitle}</h3>
        <p className="text-gray-400 text-sm mb-3">{t.upload.formatSubtitle}</p>
        <div className="flex flex-wrap gap-2">
          {RATIOS.map((meta) => (
            <button
              key={meta.ratio}
              onClick={() => setAspectRatio(meta.ratio)}
              aria-label={`Proporción ${meta.ratio}`}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${selectedAspectRatio === meta.ratio
                ? "bg-amber-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
            >
              <RatioIcon meta={meta} selected={selectedAspectRatio === meta.ratio} />
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Dish Name + Business Info ── */}
      <div>
        <div className="h-px bg-[var(--fs-border)] mb-6" />
        <div className="space-y-5">
          {/* Dish Name — clears between generations */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.upload.dishName}
            </label>
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder={t.upload.dishNamePlace}
              className={inputClasses}
            />
          </div>

          {/* Business Name — persists between generations */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.upload.businessName}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t.upload.businessNamePlace}
              className={inputClasses}
            />
          </div>

          {/* Location — persists between generations */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.upload.location}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t.upload.locationPlace}
              className={inputClasses}
            />
          </div>

          {/* Post Context */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t.upload.postContext}
            </label>

            <select
              value={preset}
              onChange={handlePresetChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3 cursor-pointer appearance-none"
            >
              <option value="">{t.upload.presets.none}</option>
              <option value="weekend">{t.upload.presets.weekend}</option>
              <option value="today">{t.upload.presets.today}</option>
              <option value="chef">{t.upload.presets.chef}</option>
              <option value="party">{t.upload.presets.party}</option>
              <option value="valentine">{t.upload.presets.valentine}</option>
              <option value="custom">{t.upload.customContext}</option>
            </select>

            {preset !== "" && (
              <textarea
                value={postContext}
                onChange={(e) => setPostContext(e.target.value)}
                placeholder={t.upload.postContextPlace}
                rows={3}
                className={`${inputClasses} resize-none mt-2`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
