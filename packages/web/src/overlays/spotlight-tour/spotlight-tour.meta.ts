import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "spotlight-tour",
  name: "Spotlight Product Tour",
  description: "Product tour: a dimmed overlay with a rounded cut-out that glides between targets, a pulse ring, and a tooltip card that flips above/below to stay in view.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","onboarding","tour","spotlight","walkthrough","coachmark"],
  pageTypes: ["onboarding","dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Card is an aria-modal dialog that takes focus each step; arrow keys/Enter step, Esc ends. Reduced motion: no glide or pulse.",
  perf: "SVG mask with one animated rect; measures targets on step and resize.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "steps", type: "{ target, title, body }[]", description: "Selectors + copy." },
    { name: "root", type: "RefObject<HTMLElement>", description: "Tour container." },
    { name: "open", type: "boolean", description: "Visible." },
    { name: "onClose", type: "() => void", description: "End handler." },
  ],
};
