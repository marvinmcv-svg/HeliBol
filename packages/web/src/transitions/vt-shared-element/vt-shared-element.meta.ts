import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "vt-shared-element",
  name: "Shared Element (View Transitions)",
  description: "A card's image and title morph into a detail view using the native View Transitions API — the web's answer to iOS hero transitions.",
  category: "transitions",
  platforms: ["web"],
  engine: "view-transitions",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["view transitions", "hero", "shared element", "gallery", "zero-dependency"],
  pageTypes: ["ecommerce", "portfolio", "blog"],
  inspiration: ["Chrome VT demos", "Mobbin product → detail flows"],
  a11y: "Real buttons; focus moves to Back when detail opens. Unsupported browsers or reduced motion get an instant swap.",
  perf: "Browser snapshots and composites; zero JS animation cost. Unique view-transition-name per element.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [
    { name: "items", type: "SharedItem[]", description: "{ id, title, subtitle?, image, body? }" },
    { name: "withViewTransition(fn)", type: "export", description: "Helper to wrap any state update in a View Transition." },
  ],
};
