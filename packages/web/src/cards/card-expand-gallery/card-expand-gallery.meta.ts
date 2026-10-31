import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "card-expand-gallery",
  name: "Expanding Gallery",
  description: "Accordion gallery: hovering or focusing a panel grows it with a spring while siblings compress, captions fade in.",
  category: "cards",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["gallery","accordion","expand","images"],
  pageTypes: ["portfolio","landing","ecommerce"],
  inspiration: ["Animata expandable carousel","React Bits Accordion Gallery"],
  a11y: "Panels are buttons with aria-expanded; activates on focus too.",
  perf: "Flex-grow via Motion layout; images are static.",
  status: "stable",
  priority: "P2",
  previewHeight: 380,
  props: [
    { name: "panels", type: "{ id, title, image, caption? }[]", description: "Panels." },
  ],
};
