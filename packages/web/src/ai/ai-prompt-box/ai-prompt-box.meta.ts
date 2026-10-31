import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "ai-prompt-box",
  name: "AI Prompt Box",
  description: "Chat composer: auto-growing textarea, animated attachment chips, model picker and a send button that morphs into Stop while generating.",
  category: "ai",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["ai","chat","composer","prompt","input"],
  pageTypes: ["ai-app","dashboard"],
  inspiration: ["Claude / ChatGPT composers","21st.dev AI Chats"],
  a11y: "Labelled textarea, Enter to send / Shift+Enter newline, labelled icon buttons, native select for the model.",
  perf: "Layout animation only when chips change.",
  status: "stable",
  priority: "P1",
  previewHeight: 320,
  props: [
    { name: "onSubmit", type: "(prompt, files) => Promise | void", description: "Send handler (resolve when generation ends)." },
    { name: "models", type: "string[]", description: "Model options." },
    { name: "placeholder", type: "string", description: "Placeholder." },
  ],
};
