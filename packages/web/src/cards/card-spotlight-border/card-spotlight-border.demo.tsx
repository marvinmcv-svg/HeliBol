"use client";
import { Gauge, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { SpotlightBorderCard, SpotlightBorderGrid } from "./card-spotlight-border";

const features = [
  { icon: Sparkles, t: "AI prompts", d: "Every component ships a paste-ready prompt." },
  { icon: Gauge, t: "60fps", d: "Transforms and opacity only. Always." },
  { icon: ShieldCheck, t: "Accessible", d: "Reduced-motion fallbacks are tested." },
  { icon: Layers, t: "Engines", d: "CSS, Motion, GSAP, Lenis, R3F." },
];

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <SpotlightBorderGrid className="grid w-full max-w-xl grid-cols-2 gap-3">
        {features.map((f) => (
          <SpotlightBorderCard key={f.t}>
            <div className="p-5">
              <f.icon className="size-5 text-brand" />
              <p className="mt-3 font-semibold">{f.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          </SpotlightBorderCard>
        ))}
      </SpotlightBorderGrid>
    </div>
  );
}
