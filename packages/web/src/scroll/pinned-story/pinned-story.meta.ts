import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "pinned-story",
  name: "Pinned Scroll Story",
  description: "Apple/Stripe-style story: text steps scroll by on the left while the sticky visual on the right swaps for the active step.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","sticky","story","features","steps"],
  pageTypes: ["landing"],
  inspiration: ["Apple product pages","Stripe Sessions"],
  a11y: "All steps' text is in the DOM in order; visuals are supplementary.",
  perf: "Native sticky; one scroll observer computes the active index.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "steps", type: "{ title, body, visual }[]", description: "Story steps." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
