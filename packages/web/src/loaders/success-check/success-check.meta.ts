import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "success-check",
  name: "Success / Error Mark",
  description: "The circle draws, the check (or cross) strokes in, then the whole mark pops — the moment-of-completion signature.",
  category: "loaders",
  platforms: ["web"],
  engine: "svg",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["success", "error", "checkmark", "payment", "feedback"],
  pageTypes: ["ecommerce", "auth", "onboarding"],
  inspiration: ["Stripe checkout success", "Apple Pay done"],
  a11y: "role=img with Success/Error label; pair with a text message. Reduced motion: drawn instantly.",
  perf: "pathLength animations on 2–3 SVG paths.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "status", type: '"success" | "error"', description: "Which mark." },
    { name: "size", type: "number", default: "72", description: "px." },
  ],
};
