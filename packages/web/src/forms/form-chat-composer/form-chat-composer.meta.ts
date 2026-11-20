import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "form-chat-composer",
  name: "Form — Chat Composer",
  description: "Messaging composer with polish: the field grows with the text, attachments drop in as removable chips, the mic morphs into a send arrow as soon as you type, and sent text lifts into the thread as a bubble, followed by a typing reply.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","form","chat","composer","messaging","input","attachments"],
  pageTypes: ["social","ai-app"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Thread is role=log aria-live; Enter sends, Shift+Enter breaks lines; all buttons labelled. Reduced motion fades.",
  perf: "Layout animations on bubbles only.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "initial", type: "{ id; text; me }[]", default: "[]", description: "Starting messages." },
    { name: "placeholder", type: "string", default: "Message", description: "Field placeholder." },
    { name: "onSend", type: "(text, files) => void", description: "Send handler." },
  ],
};
