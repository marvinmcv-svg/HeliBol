import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "password-strength",
  name: "Password Strength",
  description: "A segmented meter that springs and recolors as rules are met, with a live checklist whose checks pop in.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["password", "signup", "validation", "meter"],
  pageTypes: ["auth", "onboarding", "settings"],
  inspiration: ["1Password / Stripe sign-up"],
  a11y: "Strength label in an aria-live region linked to the input; checklist is text, not color alone; show/hide toggle labelled.",
  perf: "scaleX segments; memoized rule checks.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [{ name: "onChange", type: "(value, score) => void", description: "Value and 0–4 score." }],
};
