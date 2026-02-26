"use client";

import { useWizardStore, type AspectRatio } from "@/store/wizard";
import { t } from "@/lib/i18n";
import { STYLE_OPTIONS, NARRATIVE_OPTIONS } from "@/lib/styles";
import { Circle, Droplets, Hand, UtensilsCrossed } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Circle,
  Droplets,
  Hand,
  UtensilsCrossed,
};

const ASPECT_RATIOS: AspectRatio[] = ["1:1", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9"];

export default function StepStylePicker() {
  const selectedStyleId = useWizardStore((s) => s.selectedStyleId);
  const selectedNarrative = useWizardStore((s) => s.selectedNarrative);
  const selectedAspectRatio = useWizardStore((s) => s.selectedAspectRatio);
  const setStyle = useWizardStore((s) => s.setStyle);
  const setNarrative = useWizardStore((s) => s.setNarrative);
  const setAspectRatio = useWizardStore((s) => s.setAspectRatio);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.style.title}</h2>
        <p className="text-gray-400 mb-4">{t.style.subtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.id}
              onClick={() => setStyle(style.id)}
              aria-label={`Seleccionar estilo ${style.name}`}
              className={`relative rounded-xl p-4 h-32 flex flex-col justify-end cursor-pointer transition-all duration-200 bg-gradient-to-br ${style.gradient} ${
                selectedStyleId === style.id
                  ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900"
                  : "hover:ring-1 hover:ring-gray-500"
              }`}
            >
              <span className="font-semibold text-white drop-shadow-lg">{style.name}</span>
              <span className="text-xs text-white/70 drop-shadow">{style.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">{t.style.narrativeTitle}</h2>
        <p className="text-gray-400 mb-4">{t.style.narrativeSubtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {NARRATIVE_OPTIONS.map((n) => {
            const Icon = iconMap[n.icon] || Circle;
            return (
              <button
                key={n.id}
                onClick={() => setNarrative(n.id)}
                aria-label={`Seleccionar ${n.name}`}
                className={`rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 ${
                  selectedNarrative === n.id
                    ? "bg-amber-500/20 ring-2 ring-amber-500"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                <Icon className="w-8 h-8" />
                <span className="font-medium text-sm">{n.name}</span>
                <span className="text-xs text-gray-400">{n.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">{t.style.formatTitle}</h2>
        <p className="text-gray-400 mb-4">{t.style.formatSubtitle}</p>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              aria-label={`Proporción ${ratio}`}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
                selectedAspectRatio === ratio
                  ? "bg-amber-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
