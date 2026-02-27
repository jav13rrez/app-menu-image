"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useWizardStore, type AspectRatio } from "@/store/wizard";
import { t } from "@/lib/i18n";
import { FONTS } from "@/lib/fonts";
import { X, Move, Type, GripVertical, Copy, Check, Download, RotateCcw } from "lucide-react";

const ASPECT_SIZES: Record<AspectRatio, { w: number; h: number }> = {
  "1:1": { w: 800, h: 800 },
  "3:4": { w: 800, h: 1067 },
  "4:3": { w: 800, h: 600 },
  "4:5": { w: 800, h: 1000 },
  "5:4": { w: 800, h: 640 },
  "9:16": { w: 720, h: 1280 },
  "16:9": { w: 1280, h: 720 },
};

type ShadowPreset = "none" | "solid" | "soft" | "medium" | "strong" | "glow";

interface ShadowConfig {
  blur: number;
  offsetX: number;
  offsetY: number;
  color: string;
  useTextColor?: boolean;
  useCustomColor?: boolean;
}

const SHADOW_PRESETS: Record<ShadowPreset, ShadowConfig> = {
  none: { blur: 0, offsetX: 0, offsetY: 0, color: "transparent" },
  solid: { blur: 0, offsetX: 1, offsetY: 1, color: "", useCustomColor: true },
  soft: { blur: 4, offsetX: 1, offsetY: 1, color: "", useCustomColor: true },
  medium: { blur: 6, offsetX: 2, offsetY: 2, color: "", useCustomColor: true },
  strong: { blur: 10, offsetX: 3, offsetY: 3, color: "", useCustomColor: true },
  glow: { blur: 12, offsetX: 0, offsetY: 0, color: "", useTextColor: true },
};

const SHADOW_LABELS: Record<ShadowPreset, string> = {
  none: "Ninguna",
  solid: "Sólida",
  soft: "Suave",
  medium: "Media",
  strong: "Fuerte",
  glow: "Resplandor",
};

interface CanvasText {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  shadowColor: string;
  type: "h2" | "p";
  maxWidth: number;
  shadowPreset: ShadowPreset;
}

type DragMode = "move" | "resize-left" | "resize-right" | null;

function getShadowCSS(preset: ShadowPreset, textColor: string, shadowColor: string): string {
  const config = SHADOW_PRESETS[preset];
  if (preset === "none") return "none";

  let color: string;
  if (config.useTextColor) {
    color = hexToRgba(textColor, 0.6);
  } else if (config.useCustomColor) {
    color = shadowColor;
  } else {
    color = config.color;
  }

  return `${config.offsetX}px ${config.offsetY}px ${config.blur}px ${color}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function StepCanvas() {
  const store = useWizardStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [texts, setTexts] = useState<CanvasText[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialX, setInitialX] = useState(0);
  const [copied, setCopied] = useState(false);

  const aspectRatio = store.selectedAspectRatio;
  const size = ASPECT_SIZES[aspectRatio];

  const maxDisplayHeight = 500;
  const scale = Math.min(1, maxDisplayHeight / size.h, 400 / size.w);
  const displayW = size.w * scale;
  const displayH = size.h * scale;

  const selectedText = texts.find((t) => t.id === selectedId) || null;
  const hasH2 = texts.some((t) => t.type === "h2");
  const hasP = texts.some((t) => t.type === "p");

  const addText = (type: "h2" | "p") => {
    const content = type === "h2"
      ? (store.generatedHeadline || "Delicioso")
      : (store.generatedTagline || "Un sabor único");

    const newText: CanvasText = {
      id: `text-${Date.now()}`,
      content,
      x: 50,
      y: type === "h2" ? 20 : 80,
      fontSize: type === "h2" ? 48 : 24,
      fontFamily: "Anton",
      color: "#ffffff",
      shadowColor: "#000000",
      type,
      maxWidth: 80,
      shadowPreset: type === "h2" ? "none" : "soft",
    };

    setTexts((prev) => [...prev, newText]);
    setSelectedId(newText.id);
  };

  const removeText = (id: string) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const updateText = (id: string, updates: Partial<CanvasText>) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleMoveStart = useCallback((e: React.MouseEvent | React.TouchEvent, textId: string) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    const text = texts.find((t) => t.id === textId);
    if (!text) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((clientX - rect.left) / displayW) * 100;
    const mouseY = ((clientY - rect.top) / displayH) * 100;

    setDragStartX(mouseX - text.x);
    setInitialX(mouseY - text.y);
    setDragMode("move");
    setSelectedId(textId);
  }, [texts, displayW, displayH]);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent, textId: string, side: "left" | "right") => {
    e.stopPropagation();
    if (!('touches' in e)) {
      e.preventDefault();
    }
    if (!containerRef.current) return;

    const text = texts.find((t) => t.id === textId);
    if (!text) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;

    setDragStartX(mouseX);
    setInitialWidth(text.maxWidth);
    setInitialX(text.x);
    setDragMode(side === "left" ? "resize-left" : "resize-right");
    setSelectedId(textId);
  }, [texts]);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!dragMode || !containerRef.current || !selectedId) return;

    const text = texts.find((t) => t.id === selectedId);
    if (!text) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current.getBoundingClientRect();

    if (dragMode === "move") {
      const mouseX = ((clientX - rect.left) / displayW) * 100;
      const mouseY = ((clientY - rect.top) / displayH) * 100;

      const newX = Math.max(5, Math.min(95, mouseX - dragStartX));
      const newY = Math.max(5, Math.min(95, mouseY - initialX));

      updateText(selectedId, { x: newX, y: newY });
    } else if (dragMode === "resize-left" || dragMode === "resize-right") {
      const mouseX = clientX - rect.left;
      const deltaX = mouseX - dragStartX;
      const deltaPercent = (deltaX / displayW) * 100;

      if (dragMode === "resize-right") {
        const newWidth = Math.max(20, Math.min(100, initialWidth + deltaPercent * 2));
        updateText(selectedId, { maxWidth: newWidth });
      } else {
        const newWidth = Math.max(20, Math.min(100, initialWidth - deltaPercent * 2));
        updateText(selectedId, { maxWidth: newWidth });
      }
    }
  }, [dragMode, selectedId, texts, displayW, displayH, dragStartX, initialX, initialWidth]);

  const handleMouseUp = useCallback(() => {
    setDragMode(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setSelectedId(null);
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setDragMode(null);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

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

    for (const text of texts) {
      const textX = (text.x / 100) * size.w;
      const textY = (text.y / 100) * size.h;
      const maxWidthPx = (text.maxWidth / 100) * size.w;

      ctx.font = `bold ${text.fontSize}px "${text.fontFamily}", sans-serif`;
      ctx.fillStyle = text.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const shadowConfig = SHADOW_PRESETS[text.shadowPreset];
      if (text.shadowPreset !== "none") {
        ctx.shadowBlur = shadowConfig.blur;
        ctx.shadowOffsetX = shadowConfig.offsetX;
        ctx.shadowOffsetY = shadowConfig.offsetY;
        if (shadowConfig.useTextColor) {
          ctx.shadowColor = hexToRgba(text.color, 0.6);
        } else if (shadowConfig.useCustomColor) {
          ctx.shadowColor = text.shadowColor;
        } else {
          ctx.shadowColor = shadowConfig.color;
        }
      } else {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "transparent";
      }

      wrapText(ctx, text.content, textX, textY, maxWidthPx, text.fontSize * 1.2);
    }

    const dataUrl = canvas.toDataURL("image/png", 1);
    const fileName = `foodsocial_${Date.now()}.png`;

    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t.appName,
        });
        return;
      }
    } catch (e) {
      console.warn("Share API fallback", e);
    }

    // Fallback: Descarga clásica para navegadores de PC
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    a.click();
  };

  const changeAspect = (ratio: AspectRatio) => {
    store.setAspectRatio(ratio);
  };

  const fullText = [store.generatedCopy || "", store.generatedHashtags.join(" ")].join("\n\n");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex justify-center items-start">
        <div
          ref={containerRef}
          className="relative border border-gray-700 rounded-xl overflow-hidden bg-gray-900 select-none touch-none"
          style={{ width: displayW, height: displayH, touchAction: "none" }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchCancel={handleMouseUp}
          onClick={handleCanvasClick}
        >
          {store.generatedImageUrl && (
            <img
              src={store.generatedImageUrl}
              alt="Imagen generada"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {texts.map((text) => {
            const isSelected = selectedId === text.id;
            const widthPx = (text.maxWidth / 100) * displayW;

            return (
              <div
                key={text.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  width: widthPx,
                }}
              >
                <div
                  className={`relative cursor-move group ${dragMode === "move" && selectedId === text.id ? "cursor-grabbing" : "cursor-grab"
                    }`}
                  onMouseDown={(e) => handleMoveStart(e, text.id)}
                  onTouchStart={(e) => handleMoveStart(e, text.id)}
                >
                  {isSelected && (
                    <>
                      <div
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center cursor-ew-resize z-10 group/handle"
                        onMouseDown={(e) => handleResizeStart(e, text.id, "left")}
                        onTouchStart={(e) => handleResizeStart(e, text.id, "left")}
                      >
                        <div className="w-1.5 h-10 bg-amber-500 rounded-full opacity-80 hover:opacity-100 hover:w-2 transition-all shadow-lg" />
                      </div>

                      <div
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center cursor-ew-resize z-10 group/handle"
                        onMouseDown={(e) => handleResizeStart(e, text.id, "right")}
                        onTouchStart={(e) => handleResizeStart(e, text.id, "right")}
                      >
                        <div className="w-1.5 h-10 bg-amber-500 rounded-full opacity-80 hover:opacity-100 hover:w-2 transition-all shadow-lg" />
                      </div>

                      <div className="absolute inset-0 border-2 border-amber-500 rounded-lg pointer-events-none"
                        style={{ margin: "-4px" }} />
                    </>
                  )}

                  <div
                    className="text-center px-2"
                    style={{
                      fontSize: `${text.fontSize * scale}px`,
                      fontFamily: `"${text.fontFamily}", sans-serif`,
                      color: text.color,
                      textShadow: getShadowCSS(text.shadowPreset, text.color, text.shadowColor),
                      fontWeight: "bold",
                      lineHeight: 1.2,
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {text.content}
                  </div>

                  {isSelected && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 rounded-lg px-3 py-1.5 text-xs text-white flex items-center gap-2 whitespace-nowrap shadow-lg">
                      <Move className="w-3 h-3" />
                      <span>{t.canvas.dragHint}</span>
                      <span className="text-amber-400 ml-1">|</span>
                      <GripVertical className="w-3 h-3 text-amber-400" />
                      <span className="text-amber-400">{Math.round(text.maxWidth)}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-5">
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
                className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-200 ${aspectRatio === ratio
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
            {t.canvas.generatedTexts}
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => addText("h2")}
              disabled={hasH2}
              className={`px-3 py-3 rounded-lg text-sm text-left cursor-pointer transition-colors duration-200 flex items-start gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${hasH2
                ? "bg-amber-600/20 ring-1 ring-amber-500 text-amber-400"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              <Type className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">{t.canvas.headline}</div>
                <div className="font-bold">{store.generatedHeadline || "Delicioso"}</div>
              </div>
            </button>

            <button
              onClick={() => addText("p")}
              disabled={hasP}
              className={`px-3 py-3 rounded-lg text-sm text-left cursor-pointer transition-colors duration-200 flex items-start gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${hasP
                ? "bg-amber-600/20 ring-1 ring-amber-500 text-amber-400"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              <Type className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-xs text-gray-500 mb-1">{t.canvas.tagline}</div>
                <div>{store.generatedTagline || "Un sabor único que despierta los sentidos"}</div>
              </div>
            </button>
          </div>
        </div>

        {selectedText && (
          <div className="bg-gray-800/50 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {t.canvas.editText}
              </h3>
              <button
                onClick={() => removeText(selectedText.id)}
                className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                aria-label={t.canvas.removeText}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Texto</label>
              <textarea
                value={selectedText.content}
                onChange={(e) => updateText(selectedText.id, { content: e.target.value })}
                rows={2}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">{t.canvas.fontSize}</label>
              <input
                type="range"
                min="16"
                max="96"
                value={selectedText.fontSize}
                onChange={(e) => updateText(selectedText.id, { fontSize: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
              <div className="text-xs text-gray-500 text-center">{selectedText.fontSize}px</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.canvas.fontFamily}</label>
                <select
                  value={selectedText.fontFamily}
                  onChange={(e) => updateText(selectedText.id, { fontFamily: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {FONTS.map((font) => (
                    <option key={font.family} value={font.family} style={{ fontFamily: font.family }}>
                      {font.family}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.canvas.shadow}</label>
                <select
                  value={selectedText.shadowPreset}
                  onChange={(e) => updateText(selectedText.id, { shadowPreset: e.target.value as ShadowPreset })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {(Object.keys(SHADOW_PRESETS) as ShadowPreset[]).map((preset) => (
                    <option key={preset} value={preset}>
                      {SHADOW_LABELS[preset]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.canvas.textColor}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedText.color}
                    onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-gray-700 p-1"
                  />
                  <span className="text-xs text-gray-500 font-mono">{selectedText.color}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">{t.canvas.shadowColor}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedText.shadowColor}
                    onChange={(e) => updateText(selectedText.id, { shadowColor: e.target.value })}
                    disabled={selectedText.shadowPreset === "none" || selectedText.shadowPreset === "glow"}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-gray-700 p-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <span className="text-xs text-gray-500 font-mono">
                    {selectedText.shadowPreset === "glow" ? "auto" : selectedText.shadowColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {t.canvas.caption}
          </label>
          <div className="relative mt-2">
            <textarea
              value={fullText}
              readOnly
              rows={4}
              className="w-full p-3 pr-12 bg-gray-900 border border-gray-700 rounded-xl text-gray-300 text-sm resize-none focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-amber-400 transition-colors cursor-pointer"
              aria-label={t.canvas.copyText}
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-400 mt-1">{t.canvas.copied}</p>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={exportCanvas}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl font-semibold cursor-pointer hover:bg-amber-500 transition-colors duration-200"
          >
            <Download className="w-5 h-5" />
            {t.canvas.download}
          </button>
        </div>

        <button
          onClick={() => store.reset()}
          className="mt-4 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-sm cursor-pointer transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          {t.canvas.createAnother}
        </button>
      </div>
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];

  for (const word of words) {
    const testLine = line + (line ? " " : "") + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const totalHeight = lines.length * lineHeight;
  const startY = y - totalHeight / 2 + lineHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, startY + i * lineHeight);
  }
}
