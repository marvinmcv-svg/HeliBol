import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-typewriter",
  name: "Typewriter",
  description: "Types, holds, deletes and cycles through a list of phrases with a blinking caret.",
  category: "text",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero", "rotating", "caret", "terminal"],
  pageTypes: ["landing"],
  inspiration: ["Classic terminal typers", "Aceternity Typewriter"],
  a11y: "Screen readers get all phrases once via sr-only text; the typed span and caret are aria-hidden. Reduced motion: whole words swap without typing; caret stops blinking.",
  perf: "One timeout at a time; no RAF.",
  status: "stable",
  priority: "P1",
  previewHeight: 280,
  props: [
    { name: "words", type: "string[]", description: "Phrases to type in order." },
    { name: "typeSpeed", type: "number", default: "70", description: "ms per character typed." },
    { name: "deleteSpeed", type: "number", default: "35", description: "ms per character deleted." },
    { name: "pause", type: "number", default: "1400", description: "Hold time on a finished word (ms)." },
    { name: "loop", type: "boolean", default: "true", description: "Cycle forever." },
  ],
};
