import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "progress-bar-animated",
  name: "Progress Bar",
  description: "Determinate (springy expo-out fill, optional moving stripes) and indeterminate progress, colored with currentColor.",
  category: "loaders",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["progress", "upload", "loading", "css-only"],
  pageTypes: ["dashboard", "onboarding", "settings"],
  inspiration: ["Vercel deploy progress", "Linear sync bars"],
  a11y: "role=progressbar with aria-valuenow (omitted when indeterminate) and a label.",
  perf: "Fill uses the `scale` property — no width/layout animation.",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "value", type: "number", description: "0–100; omit for indeterminate." },
    { name: "striped", type: "boolean", default: "false", description: "Animated barber stripes." },
    { name: "label", type: "string", default: '"Progress"', description: "Accessible name." },
  ],
};
