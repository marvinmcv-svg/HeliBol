import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-swipe-deck",
  name: "Swipe Deck",
  description: "Tinder-style deck: drag to swipe with rotation and LIKE/NOPE stamps; buttons and arrow keys do the same.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["swipe","tinder","drag","deck","dating"],
  pageTypes: ["social","onboarding","ecommerce"],
  inspiration: ["Tinder","Mobbin swipe flows"],
  a11y: "Like/Nope buttons and ←/→ keys make the drag optional; deck changes are announced (aria-live).",
  perf: "Only the top card is draggable; two cards preview underneath.",
  status: "stable",
  priority: "P2",
  previewHeight: 460,
  props: [
    { name: "cards", type: "{ id, content }[]", description: "Cards." },
    { name: "onSwipe", type: "(id, dir) => void", description: "Swipe callback (1 right, −1 left)." },
  ],
};
