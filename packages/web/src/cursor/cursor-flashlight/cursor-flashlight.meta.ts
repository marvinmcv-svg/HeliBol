import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "cursor-flashlight",
  name: "Cursor — Flashlight",
  description: "X-ray flashlight: a dark top layer has a soft circular hole that trails the pointer with easing, revealing a second layer underneath — hidden messages, blueprints, before/after. Click to widen the beam. Touch and reduced motion get a Reveal toggle.",
  category: "cursor",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","cursor","flashlight","mask","reveal","spotlight","dark"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Both layers stay in the DOM; a Reveal toggle (aria-pressed) shows the hidden layer for touch and keyboard users.",
  perf: "CSS mask-image driven by three custom properties updated in one rAF loop.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "children", type: "ReactNode", description: "What you see in the dark (top layer)." },
    { name: "reveal", type: "ReactNode", description: "What the light reveals underneath." },
    { name: "radius", type: "number", default: "110", description: "Beam radius in px." },
  ],
};
