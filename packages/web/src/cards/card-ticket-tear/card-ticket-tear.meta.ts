import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-ticket-tear",
  name: "Tear-off Ticket",
  description: "A boarding-pass ticket whose stub you drag down to tear along the perforation: it hinges and rotates as you pull, then drops away with gravity past the threshold.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","ticket","drag","boarding pass","event","playful"],
  pageTypes: ["ecommerce","onboarding"],
  inspiration: ["kinetik Premium collection"],
  a11y: "A visible “Tear stub” button provides the same action; result announced via aria-live. Reduced motion: stub disappears without the fall.",
  perf: "One draggable element; transforms only.",
  status: "stable",
  priority: "P1",
  previewHeight: 380,
  props: [
    { name: "children", type: "ReactNode", description: "Ticket body." },
    { name: "stub", type: "ReactNode", description: "Tear-off part." },
    { name: "onTear", type: "() => void", description: "Callback." },
  ],
};
