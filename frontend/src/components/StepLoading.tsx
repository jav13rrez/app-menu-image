"use client";

import { useEffect, useRef } from "react";
import { useWizardStore } from "@/store/wizard";
import { t } from "@/lib/i18n";
import { generateImage, pollJob } from "@/lib/api";
import { Loader2 } from "lucide-react";

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StepLoading() {
  const store = useWizardStore();
  const cancelledRef = useRef(false);
  const messageIndex = useRef(0);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    cancelledRef.current = false;

    const messages = t.loading.messages;

    const msgInterval = setInterval(() => {
      messageIndex.current = (messageIndex.current + 1) % messages.length;
      if (messageRef.current) {
        messageRef.current.textContent = messages[messageIndex.current];
      }
    }, 3000);

    const state = useWizardStore.getState();
    state.setGenerating(true);
    state.setError(null);

    let pollTimeout: ReturnType<typeof setTimeout>;

    (async () => {
      try {
        let imageUrl = state.originalImagePreview || "";
        if (state.originalImageFile) {
          imageUrl = await fileToDataUri(state.originalImageFile);
        }

        const genRes = await generateImage({
          image_url: imageUrl,
          style_id: state.selectedStyleId,
          narrative: state.selectedNarrative,
          aspect_ratio: state.selectedAspectRatio,
        });

        if (cancelledRef.current) return;
        useWizardStore.getState().setJobId(genRes.job_id);

        const poll = async () => {
          if (cancelledRef.current) return;
          const result = await pollJob(genRes.job_id);
          if (cancelledRef.current) return;
          if (result.status === "completed" && result.result) {
            useWizardStore.getState().setGenerationResult(
              result.result.generated_image_url,
              result.result.generated_copy,
              result.result.hashtags,
              result.result.headline || "Delicioso",
              result.result.tagline || "Un sabor único que despierta los sentidos"
            );
          } else if (result.status === "failed") {
            useWizardStore.getState().setError(result.error || "Error en la generación");
          } else {
            pollTimeout = setTimeout(poll, 2000);
          }
        };
        await poll();
      } catch (e) {
        if (!cancelledRef.current) {
          useWizardStore.getState().setError(e instanceof Error ? e.message : "Error desconocido");
        }
      }
    })();

    return () => {
      cancelledRef.current = true;
      clearInterval(msgInterval);
      clearTimeout(pollTimeout);
    };
  }, []);

  if (store.error) {
    return (
      <div className="flex flex-col items-center gap-6 py-16">
        <div className="text-red-400 text-lg">{store.error}</div>
        <button
          onClick={() => {
            store.setError(null);
            store.setStep(1);
          }}
          className="px-6 py-3 bg-amber-600 text-white rounded-xl cursor-pointer hover:bg-amber-500 transition-colors duration-200"
        >
          {t.loading.tryAgain}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
      <p ref={messageRef} className="text-xl text-gray-300">
        {t.loading.messages[0]}
      </p>
      <div className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full"
          style={{ animation: "pulse-slow 2s ease-in-out infinite", width: "60%" }}
        />
      </div>
      <p className="text-gray-500 text-sm">{t.loading.estimate}</p>
    </div>
  );
}
