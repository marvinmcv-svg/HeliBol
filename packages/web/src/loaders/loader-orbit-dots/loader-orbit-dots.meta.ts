import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "loader-orbit-dots",
  name: "Loader — Orbit Dots",
  description: "Atom-style loader: three tilted rings of dots spinning at different speeds and directions around a pulsing core, built with CSS 3D transforms only.",
  category: "loaders",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","loader","spinner","orbit","atom","3d"],
  pageTypes: ["dashboard","ai-app"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=status with a label. Reduced motion shows the static gyroscope.",
  perf: "Pure CSS keyframes on transform; no JS per frame.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "size", type: "number", default: "72", description: "Size in px." },
    { name: "dots", type: "number", default: "8", description: "Dots per ring." },
    { name: "color", type: "string", default: "currentColor", description: "Colour." },
  ],
};
