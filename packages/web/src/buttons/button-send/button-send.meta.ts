import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "button-send",
  name: "Send Button",
  description: "Paper-plane send: the plane winds back, takes off along an arc and disappears, then a check draws in.",
  category: "buttons",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["send","message","chat","feedback","icon morph"],
  pageTypes: ["social","ai-app","dashboard"],
  inspiration: ["iMessage send","Telegram"],
  a11y: "aria-live polite announces Sent; guards double sends.",
  perf: "Keyframed transforms on one SVG.",
  status: "stable",
  priority: "P2",
  previewHeight: 220,
  props: [
    { name: "onSend", type: "() => void", description: "Called on click." },
    { name: "label / sentLabel", type: "string", description: "Copy." },
  ],
};
