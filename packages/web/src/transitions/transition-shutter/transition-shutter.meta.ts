import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "transition-shutter",
  name: "Shutter Transition",
  description: "Page transition with venetian shutters: blades close top-to-bottom, the page swaps while covered (its name flashes), then blades open bottom-to-top with a stagger.",
  category: "transitions",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","page transition","shutter","blinds","route","agency"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Nav buttons have aria-current; content swap is instant for AT. Reduced motion: quick crossfade.",
  perf: "N blades × scaleY; page swapped once under cover.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "pages", type: "{ key, label, content }[]", description: "Pages." },
    { name: "blades", type: "number", default: "7", description: "Blade count." },
    { name: "color", type: "string", default: "'#0a0a0a'", description: "Blade colour." },
  ],
};
