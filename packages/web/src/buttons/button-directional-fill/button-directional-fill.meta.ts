import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-directional-fill",
  name: "Directional Fill Button",
  description: "Hover fill that knows where you came from: a circle grows from the exact entry point and shrinks back toward the exit point. Pure CSS transitions driven by two custom properties.",
  category: "buttons",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","button","hover","fill","cta","micro-interaction"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Real button; same fill on keyboard focus. Reduced motion: instant colour swap.",
  perf: "Two CSS variables written on enter/leave; transform transition only.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "fill", type: "string", default: "'currentColor'", description: "Fill colour." },
    { name: "fillText", type: "string", default: "background", description: "Text colour when filled." },
  ],
};
