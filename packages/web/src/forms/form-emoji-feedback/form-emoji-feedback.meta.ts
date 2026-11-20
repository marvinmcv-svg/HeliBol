import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "form-emoji-feedback",
  name: "Form — Emoji Feedback",
  description: "Feedback rating where one drawn face does the talking: choose 1–5 and the mouth curve bends from frown to grin, brows tilt, eyes squint and the face warms; a comment box slides open and Send turns into a thank-you.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","form","feedback","rating","emoji","nps","survey"],
  pageTypes: ["ai-app","ecommerce","onboarding"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Rating is a radiogroup with text labels; the face is decorative. Reduced motion swaps states without springs.",
  perf: "One SVG; path d and transforms animate.",
  status: "stable",
  priority: "P1",
  previewHeight: 500,
  props: [
    { name: "question", type: "string", default: "How was your experience?", description: "Prompt." },
    { name: "labels", type: "string[5]", default: "Awful … Loved it", description: "Rating labels." },
    { name: "onSubmit", type: "(rating, comment) => void", description: "Submit handler." },
  ],
};
