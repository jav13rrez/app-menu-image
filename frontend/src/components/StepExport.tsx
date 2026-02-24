"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizard";
import { t } from "@/lib/i18n";
import { Copy, Check, Share2, Download } from "lucide-react";

export default function StepExport() {
  const store = useWizardStore();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const fullText = [store.generatedCopy || "", store.generatedHashtags.join(" ")].join("\n\n");

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (!navigator.share) return;
    
    setSharing(true);
    try {
      if (store.generatedImageUrl && navigator.canShare) {
        const response = await fetch(store.generatedImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "foodsocial.png", { type: "image/png" });
        
        const shareData = {
          title: "FoodSocial AI",
          text: fullText,
          files: [file],
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setSharing(false);
          return;
        }
      }
      
      await navigator.share({
        title: "FoodSocial AI",
        text: fullText,
      });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
    setSharing(false);
  };

  const downloadImage = () => {
    if (!store.generatedImageUrl) return;
    const a = document.createElement("a");
    a.href = store.generatedImageUrl;
    a.download = `foodsocial_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold">{t.export.title}</h2>

      {store.generatedImageUrl && (
        <div className="w-full aspect-square rounded-2xl overflow-hidden border border-gray-700">
          <img
            src={store.generatedImageUrl}
            alt="Imagen generada"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="w-full">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {t.export.caption}
        </label>
        <textarea
          value={fullText}
          readOnly
          rows={5}
          className="w-full mt-2 p-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={copyToClipboard}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-xl cursor-pointer hover:bg-gray-700 transition-colors duration-200"
          aria-label={t.export.copyText}
        >
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          {copied ? t.export.copied : t.export.copyText}
        </button>
        <button
          onClick={downloadImage}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-xl cursor-pointer hover:bg-gray-700 transition-colors duration-200"
          aria-label={t.export.downloadBtn}
        >
          <Download className="w-5 h-5" />
          {t.export.downloadBtn}
        </button>
        {"share" in navigator && (
          <button
            onClick={share}
            disabled={sharing}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-xl cursor-pointer hover:bg-amber-500 transition-colors duration-200 disabled:opacity-50"
            aria-label={t.export.share}
          >
            <Share2 className="w-5 h-5" />
            {sharing ? "..." : t.export.share}
          </button>
        )}
      </div>

      <button
        onClick={() => store.reset()}
        className="text-gray-500 hover:text-gray-300 text-sm cursor-pointer transition-colors duration-200"
      >
        {t.export.createAnother}
      </button>
    </div>
  );
}
