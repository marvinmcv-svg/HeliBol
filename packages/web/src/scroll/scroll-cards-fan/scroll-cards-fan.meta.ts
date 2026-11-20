import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "scroll-cards-fan",
  name: "Scroll — Cards Fan",
  description: "Pinned section where a tight stack of cards deals itself into a wide arc as you scroll, each card rotating around a pivot far below the stage like a hand of playing cards, while the heading rises. Scroll back and they gather.",
  category: "scroll",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","scroll","cards","fan","pinned","arc","gallery"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Cards are figures with captions; reduced motion shows the finished fan without pinning.",
  perf: "Transform-only, driven by one scroll progress value.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "cards", type: "{ src; title; alt? }[]", description: "Cards to fan." },
    { name: "heading", type: "string", default: "A hand worth holding", description: "Heading above the fan." },
    { name: "container", type: "RefObject<HTMLElement>", description: "Custom scroll container." },
  ],
};
