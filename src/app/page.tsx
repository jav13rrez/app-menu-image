"use client";

import { useWizardStore } from "@/store/wizard";
import { t } from "@/lib/i18n";
import StepUpload from "@/components/StepUpload";
import StepStylePicker from "@/components/StepStylePicker";
import StepLoading from "@/components/StepLoading";
import StepCanvas from "@/components/StepCanvas";
import { ChefHat, ArrowLeft, ArrowRight } from "lucide-react";

export default function WizardPage() {
  const store = useWizardStore();
  const step = store.currentStep;

  const canGoNext = () => {
    if (step === 0) return !!store.originalImagePreview;
    if (step === 1) {
      return !!store.originalImagePreview && !!store.selectedStyleId && !!store.selectedNarrative;
    }
    return false;
  };

  const goNext = () => {
    if (step === 0 && store.originalImagePreview) store.setStep(1);
    else if (
      step === 1 &&
      store.originalImagePreview &&
      store.selectedStyleId &&
      store.selectedNarrative
    ) {
      store.setStep(2); // → Loading/Generation
    }
  };

  const goBack = () => {
    if (step === 1) store.setStep(0);
    else if (step === 3) store.setStep(1); // Canvas → Estilo, skip loading
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
        <ChefHat className="w-8 h-8 text-amber-500" />
        <h1 className="text-xl font-bold">{t.appName}</h1>
      </header>

      <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-800/50 overflow-x-auto">
        {t.steps.map((label, i) => {
          const canNavigate = i < step && step !== 2 && i !== 2;
          return (
            <div
              key={i}
              onClick={() => canNavigate && store.setStep(i)}
              className={`flex items-center gap-2 text-sm whitespace-nowrap ${canNavigate ? "cursor-pointer hover:text-amber-400" : ""
                } ${i === step
                  ? "text-amber-500 font-semibold"
                  : i < step
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-200 ${i === step
                  ? "bg-amber-500 text-black"
                  : i < step
                    ? canNavigate
                      ? "bg-gray-600 text-white hover:bg-amber-600"
                      : "bg-gray-600 text-white"
                    : "bg-gray-800 text-gray-500"
                  }`}
              >
                {i + 1}
              </span>
              {label}
              {i < t.steps.length - 1 && <span className="text-gray-700 mx-1">-</span>}
            </div>
          );
        })}
      </div>

      <main className="flex-1 px-6 py-8 max-w-5xl mx-auto w-full">
        {step === 0 && <StepUpload />}
        {step === 1 && <StepStylePicker />}
        {step === 2 && <StepLoading />}
        {step === 3 && <StepCanvas />}
      </main>

      {step !== 2 && step !== 3 && (
        <footer className="px-6 py-4 border-t border-gray-800 flex justify-between">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
            aria-label={t.nav.back}
          >
            <ArrowLeft className="w-4 h-4" />
            {t.nav.back}
          </button>
          <button
            onClick={goNext}
            disabled={!canGoNext()}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-200"
            aria-label={t.nav.next}
          >
            {t.nav.next}
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      )}
    </div>
  );
}
