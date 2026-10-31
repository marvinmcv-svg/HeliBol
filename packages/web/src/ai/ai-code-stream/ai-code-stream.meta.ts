import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-code-stream",
  name: "Code Stream",
  description: "A code window that streams in token by token like an AI writing it, with syntax colors, a block caret and a 'writing' status.",
  category: "ai",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["code","ai","typing","terminal","dev tools"],
  pageTypes: ["ai-app","landing","docs"],
  inspiration: ["Cursor / v0 code generation","Magic UI Terminal"],
  a11y: "The full code is exposed via aria-label on <pre>; reduced motion shows it instantly.",
  perf: "One interval; slices pre-tokenized spans.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "tokens", type: "[text, kind?][]", description: "Pre-tokenized code." },
    { name: "file", type: "string", description: "Tab title." },
    { name: "speed", type: "number", default: "18", description: "ms per 2 chars." },
  ],
};
