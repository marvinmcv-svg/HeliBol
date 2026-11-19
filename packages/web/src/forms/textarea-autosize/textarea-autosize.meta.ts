import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "textarea-autosize",
  name: "Auto-growing Textarea",
  description: "A textarea that grows smoothly with its content (spring on measured height), a character ring that fills and turns amber then red near the limit, and ⌘/Ctrl+Enter to send.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["textarea","input","composer","counter","chat"],
  pageTypes: ["ai-app","social"],
  inspiration: ["21st.dev category gap (audit 2026-11)"],
  a11y: "Real label; count is linked with aria-describedby and announced near the limit. Reduced motion: instant height.",
  perf: "Measures scrollHeight on change only; one spring.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "label", type: "string", description: "Label." },
    { name: "maxLength", type: "number", default: "280", description: "Soft limit." },
    { name: "maxRows", type: "number", default: "8", description: "Rows before scrolling." },
    { name: "onSubmit", type: "(v) => void", description: "⌘/Ctrl+Enter or send." },
  ],
};
