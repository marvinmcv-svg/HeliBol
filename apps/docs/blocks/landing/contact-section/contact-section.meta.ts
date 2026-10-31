import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "contact-section", name: "Contact Section", category: "forms", platforms: ["web"], engine: "motion",
  description: "Contact block over a glowing dot matrix: floating-label fields, an animated select and a paper-plane send button.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core", "bg-dot-glow", "input-floating-label", "select-animated", "button-send"], tags: ["contact", "form", "lead", "agency"],
  pageTypes: ["landing", "portfolio"], a11y: "Labelled fields, listbox select, live-region send state.", perf: "One canvas background.",
  status: "stable", priority: "P2", previewHeight: 560,
};
