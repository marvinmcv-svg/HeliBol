import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "error-shake",
  name: "Error Shake",
  description: "The macOS login 'no' — a damped horizontal shake triggered by any changing value. Pair with color and text for accessibility.",
  category: "forms",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["error", "shake", "validation", "form", "feedback"],
  pageTypes: ["auth", "settings", "ecommerce"],
  inspiration: ["macOS login window"],
  a11y: "Motion is never the only signal: demo pairs it with aria-invalid, red styling and a role=alert message. Reduced motion: no shake.",
  perf: "One translate keyframe, remounted by key to replay.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [{ name: "trigger", type: "unknown", description: "Any value; each change replays the shake." }],
};
