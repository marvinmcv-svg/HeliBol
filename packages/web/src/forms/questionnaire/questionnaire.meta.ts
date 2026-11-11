import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "questionnaire",
  name: "Questionnaire",
  description: "Typeform-style one-question-at-a-time form: answers slide the next question in from the direction of travel, the progress bar springs forward, number keys pick and Enter continues.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["form","survey","onboarding","typeform","steps"],
  pageTypes: ["onboarding","auth"],
  inspiration: ["unlumen UI — Questionnaire"],
  a11y: "Each question is a fieldset with legend; options are radio/checkbox roles with aria-checked; progressbar with values; keyboard shortcuts 1–9 and Enter. Reduced motion: crossfade.",
  perf: "One question mounted at a time (AnimatePresence mode=wait).",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "questions", type: "{ id, title, hint?, options, multiple? }[]", description: "Questions." },
    { name: "onComplete", type: "(answers) => void", description: "Called after the last question." },
  ],
};
