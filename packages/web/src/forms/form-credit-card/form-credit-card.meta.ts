import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "form-credit-card",
  name: "Credit Card Form",
  description: "Payment form with a live 3D card: digits roll into place as you type, the card skin cross-fades to the detected brand, the focused field glows on the card, and focusing CVC flips the card to its back.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","payment","credit card","checkout","form","3d"],
  pageTypes: ["ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Real labelled inputs with cc-* autocomplete and numeric keyboards; the card preview is aria-hidden. Reduced motion: no flip or roll.",
  perf: "Per-character AnimatePresence only on the number row; one 3D flip.",
  status: "stable",
  priority: "P1",
  previewHeight: 520,
  props: [
    { name: "onSubmit", type: "(card) => void", description: "Submit handler." },
  ],
};
