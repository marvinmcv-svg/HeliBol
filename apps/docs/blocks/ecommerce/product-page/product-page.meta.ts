import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "product-page", name: "Product Detail Page", category: "media", platforms: ["web"], engine: "motion",
  description: "E-commerce PDP: crossfading gallery with thumbnails, like burst, star rating, sliding size selector and a stateful Add to bag.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core", "rating-stars", "button-stateful", "like-burst"], tags: ["product", "pdp", "ecommerce", "gallery"],
  pageTypes: ["ecommerce"], a11y: "Size options are a radiogroup; thumbnails labelled; async add-to-bag announces its result.", perf: "One image transition at a time.",
  status: "stable", priority: "P1", previewHeight: 620,
};
