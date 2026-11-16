import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-spectrum-console",
  name: "Hero — Spectrum Console",
  description: "Observability hero: email capture over a console mock flanked by equaliser-style log-volume bars that never stop moving.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","devtools","observability","equalizer","email capture","dark"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — Better Stack hero (mobbin.com/sites/sections/dbde8590-32d4-4b40-a374-65e121d2624d)"],
  a11y: "Labelled email input and real button; bars and console are aria-hidden; reduced motion freezes bars and highlights.",
  perf: "28 scaleY bars on compositor-only keyframes; one console row highlight loop.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
