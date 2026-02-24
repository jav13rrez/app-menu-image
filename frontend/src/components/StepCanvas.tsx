"use client";

import { useRef, useState } from "react";
import { useWizardStore, type AspectRatio } from "@/store/wizard";
import { t } from "@/lib/i18n";

const ASPECT_SIZES: Record<AspectRatio, { w: number; h: number }> = {
  "1:1": { w: 800, h: 800 },
  "3:4": { w: 800, h: 1067 },
  "4:3": { w: 800, h: 600 },
  "4:5": { w: 800, h: 1000 },
  "5:4": { w: 800, h: 640 },
  "9:16": { w: 720, h: 1280 },
  "16:9": { w: 1280, h: 720 },
};

const TEXT_TEMPLATES = [
  { label: "Menú del Día", text: "MENÚ DEL DÍA", fontSize: 42, color: "#ffffff" },
  { label: "Especial Fin de Semana", text: "ESPECIAL FIN DE SEMANA", fontSize: 38, color: "#f59e0b" },
  { label: "Selección del Chef", text: "SELECCIÓN DEL CHEF", fontSize: 44, color: "#ef4444" },
  { label: "Tiempo Limitado", text: "TIEMPO LIMITADO", fontSize: 36, color: "#10b981" },
];

export default function StepCanvas() {
  const store = useWizardStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#ffffff");

  const aspectRatio = store.selectedAspectRatio;
  const size = ASPECT_SIZES[aspectRatio];

  const maxDisplayHeight = 500;
  const scale = Math.min(1, maxDisplayHeight / size.h, 400 / size.w);
  const displayW = size.w * scale;
  const displayH = size.h * scale;

  const selectTemplate = (idx: number) => {
    const tpl = TEXT_TEMPLATES[idx];
    setOverlayText(tpl.text);
    setTextColor(tpl.color);
    setActiveTemplate(idx);
  };

  const clearOverlay = () => {
    setOverlayText(null);
    setActiveTemplate(null);
  };

  const exportCanvas = async () => {
    if (!store.generatedImageUrl) return;

    const canvas = document.createElement("canvas");
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = store.generatedImageUrl!;
    });

    const imgScale = Math.max(size.w / img.naturalWidth, size.h / img.naturalHeight);
    const imgW = img.naturalWidth * imgScale;
    const imgH = img.naturalHeight * imgScale;
    const imgX = (size.w - imgW) / 2;
    const imgY = (size.h - imgH) / 2;

    ctx.drawImage(img, imgX, imgY, imgW, imgH);

    if (overlayText && activeTemplate !== null) {
      const tpl = TEXT_TEMPLATES[activeTemplate];
      ctx.font = `bold ${tpl.fontSize}px Arial`;
      ctx.fillStyle = tpl.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(overlayText, size.w / 2, size.h * 0.85);
    }

    const dataUrl = canvas.toDataURL("image/png", 1);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `foodsocial_${Date.now()}.png`;
    a.click();
  };

  const changeAspect = (ratio: AspectRatio) => {
    store.setAspectRatio(ratio);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex justify-center items-start">
        <div
          className="relative border border-gray-700 rounded-xl overflow-hidden bg-gray-900"
          style={{ width: displayW, height: displayH }}
        >
          {store.generatedImageUrl && (
            <img
              src={store.generatedImageUrl}
              alt="Imagen generada"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {overlayText && (
            <div
              className="absolute left-0 right-0 text-center font-bold"
              style={{
                bottom: "15%",
                fontSize: `${(activeTemplate !== null ? TEXT_TEMPLATES[activeTemplate].fontSize : 42) * scale}px`,
                color: textColor,
                textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              }}
            >
              {overlayText}
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-72 flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            {t.canvas.aspectRatio}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ASPECT_SIZES) as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => changeAspect(ratio)}
                aria-label={`Proporción ${ratio}`}
                className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-200 ${
                  aspectRatio === ratio
                    ? "bg-amber-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            {t.canvas.textOverlay}
          </h3>
          <div className="flex flex-col gap-2">
            {TEXT_TEMPLATES.map((tpl, i) => (
              <button
                key={tpl.label}
                onClick={() => activeTemplate === i ? clearOverlay() : selectTemplate(i)}
                aria-label={tpl.label}
                className={`px-3 py-2 rounded-lg text-sm text-left cursor-pointer transition-colors duration-200 ${
                  activeTemplate === i
                    ? "bg-amber-600/20 ring-1 ring-amber-500 text-amber-400"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={exportCanvas}
          className="mt-auto px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold cursor-pointer hover:bg-amber-500 transition-colors duration-200"
        >
          {t.canvas.download}
        </button>
      </div>
    </div>
  );
}
