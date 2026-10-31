import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-chat", name: "Messaging", category: "layout", platforms: ["native", "web"], engine: "motion",
  description: "iMessage-style thread: bubbles spring in from their side, a typing indicator precedes replies, double-tap reacts with a popping heart.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core"], tags: ["chat", "messaging", "social", "mobile"],
  pageTypes: ["social"], inspiration: ["iMessage", "Mobbin messaging flows"],
  a11y: "Labelled composer and send; reactions also available via long-press menu on native.", perf: "Layout springs per new message.",
  status: "stable", priority: "P1", previewHeight: 700, steps: ["Thread", "New message", "Reacted"],
};
