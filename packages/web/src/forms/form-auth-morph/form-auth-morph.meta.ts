import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "form-auth-morph",
  name: "Auth Card Morph",
  description: "One card, two forms: switching Sign in ↔ Create account morphs the card height, slides the tab indicator, keeps shared fields in place while Name and Confirm grow in and out, and the title and button label roll to their new text.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","auth","sign in","sign up","form","morph"],
  pageTypes: ["auth","onboarding"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Real labelled inputs with correct autocomplete for each mode; tablist for the mode switch. Reduced motion: instant swap.",
  perf: "Layout animations on a handful of elements; extra fields mount only in sign-up mode.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "onSubmit", type: "(mode, data) => void", description: "Submit handler." },
    { name: "brand", type: "string", default: "'kinetik'", description: "Kicker text." },
  ],
};
