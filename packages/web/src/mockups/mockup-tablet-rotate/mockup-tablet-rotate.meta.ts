import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "mockup-tablet-rotate",
  name: "Mockup — Rotating Tablet",
  description: "Tablet mockup that physically turns between portrait and landscape with a spring while the screen content reflows — pass a render function and lay out differently per orientation; layout-animated children glide to their new spots.",
  category: "mockups",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","mockup","tablet","ipad","rotate","responsive","device"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Rotate control is a labelled button; content stays upright and readable. Reduced motion switches instantly.",
  perf: "Device size animates via springs; inner content uses layout animations.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "children", type: "(o: 'portrait' | 'landscape') => ReactNode", description: "Screen renderer." },
    { name: "defaultOrientation", type: "'portrait' | 'landscape'", default: "landscape", description: "Start orientation." },
    { name: "size", type: "number", default: "440", description: "Long side in px." },
  ],
};
