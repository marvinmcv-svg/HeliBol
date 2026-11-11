import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-empty-state", name: "Empty State → First Task", category: "layout", platforms: ["native", "web"], engine: "motion",
  description: "Mobbin-style first-run journey: a bobbing empty-state illustration and pulsing FAB, a compose sheet, the first task dropping in as the empty state blurs away, and a confetti + streak celebration on first completion.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core"], tags: ["empty state", "onboarding", "todo", "celebration", "mobile"],
  pageTypes: ["onboarding", "dashboard"], inspiration: ["Mobbin — empty states & first-run flows", "Things", "Todoist"],
  a11y: "FAB and checkboxes labelled; sheet input autofocuses and submits with Enter; checkboxes use aria-pressed. Reduced motion: no bobbing, pulsing or confetti.",
  perf: "Springs on a few elements; confetti is 14 short-lived spans.",
  status: "stable", priority: "P1", previewHeight: 700, steps: ["Empty", "Compose", "First task", "Celebrate"],
};
