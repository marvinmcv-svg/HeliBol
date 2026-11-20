import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-snap-outline",
  name: "Cursor — Snap Outline",
  description: "iPadOS-style pointer: a soft dot that morphs into a rounded outline hugging whatever button or link you hover, springing on position, size and radius, with a subtle magnetic pull toward the target's centre.",
  category: "cursor",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","cursor","ipados","magnetic","morph","pointer"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Purely decorative overlay (aria-hidden); native cursor stays available. Disabled on touch and under reduced motion.",
  perf: "Five spring motion values; one pointermove listener; no React re-renders while moving.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "children", type: "ReactNode", description: "Area where the cursor is active." },
    { name: "targets", type: "string", default: "a, button, [data-snap]", description: "Selector for elements to snap to." },
  ],
};
