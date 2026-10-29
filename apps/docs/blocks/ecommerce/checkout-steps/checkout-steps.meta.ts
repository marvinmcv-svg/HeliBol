import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "checkout-steps",
  name: "Checkout — Stepper + Confetti",
  description: "Shipping → payment → review stepper beside an order summary, ending in a drawn success mark and a confetti burst.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "form-stepper", "input-floating-label", "success-check"],
  tags: ["checkout", "ecommerce", "stepper", "confetti", "success"],
  pageTypes: ["ecommerce"],
  a11y: "Real form fields; confetti aria-hidden and hidden under reduced motion; success has text.",
  perf: "40 confetti pieces, transforms only, unmount after the success view leaves.",
  status: "stable",
  priority: "P2",
  previewHeight: 600,
};
