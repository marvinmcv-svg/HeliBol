import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "form-stepper",
  name: "Form Stepper",
  description: "Multi-step form where steps slide in the direction of travel, connectors fill as you progress, and completed steps morph into checks.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["stepper", "wizard", "onboarding", "checkout", "multi-step"],
  pageTypes: ["onboarding", "ecommerce", "auth"],
  inspiration: ["Stripe onboarding", "Linear workspace setup"],
  a11y: "Ordered list with aria-current=step; Back/Continue are real buttons. Move focus to the step heading in production forms.",
  perf: "popLayout swap; connectors use scaleX.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "steps", type: "{ title, content }[]", description: "Steps." },
    { name: "onFinish", type: "() => void", description: "Called on the last Continue." },
  ],
};
