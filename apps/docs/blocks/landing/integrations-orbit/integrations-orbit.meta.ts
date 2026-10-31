import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "integrations-orbit", name: "Integrations Orbit", category: "data", platforms: ["web"], engine: "motion",
  description: "Integrations section: flip-word headline on the left, icons orbiting the product logo on the right.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core", "orbit-icons", "text-flip-words"], tags: ["integrations", "ecosystem", "orbit", "landing"],
  pageTypes: ["landing"], a11y: "Integrations are described in text; orbit is decorative and static under reduced motion.", perf: "Two rotating rings.",
  status: "stable", priority: "P2", previewHeight: 480,
};
