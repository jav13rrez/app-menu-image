"use client";

import { useWizardStore } from "@/store/wizard";
import { t } from "@/lib/i18n";
import { STYLE_OPTIONS, NARRATIVE_OPTIONS } from "@/lib/styles";
import { Circle, Droplets, Hand, UtensilsCrossed } from "lucide-react";
import ContextPhotoPicker from "@/components/ContextPhotoPicker";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Circle,
  Droplets,
  Hand,
  UtensilsCrossed,
};

export default function StepStylePicker() {
  const selectedStyleId = useWizardStore((s) => s.selectedStyleId);
  const selectedNarrative = useWizardStore((s) => s.selectedNarrative);
  const setStyle = useWizardStore((s) => s.setStyle);
  const setNarrative = useWizardStore((s) => s.setNarrative);

  return (
    <div className="flex flex-col gap-8">
      {/* ── Style Cards ── */}
      <div>
        <h2 className="text-2xl font-bold mb-2">{t.style.title}</h2>
        <p className="text-gray-400 mb-4">{t.style.subtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.id}
              onClick={() => setStyle(style.id)}
              aria-label={`Seleccionar estilo ${style.name}`}
              className={`relative rounded-xl h-32 flex flex-col justify-end cursor-pointer transition-all duration-200 overflow-hidden ${selectedStyleId === style.id
                ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900"
                : "hover:ring-1 hover:ring-gray-500"
                }`}
            >
              {/* Background: image with gradient fallback */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${style.gradient} bg-cover bg-center`}
                style={{ backgroundImage: `url(${style.image})` }}
              />
              {/* Dark overlay 50% for text readability */}
              <div className="absolute inset-0 bg-black/50" />
              {/* Text content */}
              <div className="relative z-10 p-4">
                <span className="font-semibold text-white drop-shadow-lg">{style.name}</span>
                <br />
                <span className="text-xs text-white/80 drop-shadow">{style.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Narrative Cards ── */}
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
                className={`relative rounded-xl flex flex-col items-center gap-2 cursor-pointer transition-all duration-200 overflow-hidden ${selectedNarrative === n.id
                  ? "ring-2 ring-amber-500"
                  : "hover:ring-1 hover:ring-gray-500"
                  }`}
              >
                {/* Background: image with solid color fallback */}
                <div
                  className={`absolute inset-0 bg-cover bg-center ${selectedNarrative === n.id ? "bg-amber-900/40" : "bg-gray-800"
                    }`}
                  style={{ backgroundImage: `url(${n.image})` }}
                />
                {/* Dark overlay 50% for text readability */}
                <div className="absolute inset-0 bg-black/50" />
                {/* Content */}
                <div className="relative z-10 p-4 flex flex-col items-center gap-2">
                  <Icon className="w-8 h-8 text-white drop-shadow" />
                  <span className="font-medium text-sm text-white drop-shadow">{n.name}</span>
                  <span className="text-xs text-white/80 drop-shadow">{n.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Context Photos (Tu Identidad Visual) ── */}
      <div>
        <div className="h-px bg-[var(--fs-border)] mb-6" />
        <h2 className="text-2xl font-bold mb-2">{t.style.contextTitle}</h2>
        <p className="text-gray-400 mb-4">{t.style.contextSubtitle}</p>
        <ContextPhotoPicker />
      </div>
    </div>
  );
}
