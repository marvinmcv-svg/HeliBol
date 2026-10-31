import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-food-order", name: "Food Order — Fly to Cart", category: "buttons", platforms: ["native", "web"], engine: "motion",
  description: "Delivery menu where tapping + launches the dish thumbnail along an arc into the bag, which bumps and counts up; a 'View bag' bar slides in.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core"], tags: ["fly to cart", "ecommerce", "food delivery", "mobile"],
  pageTypes: ["ecommerce"], inspiration: ["DoorDash", "Uber Eats", "Mobbin add-to-cart"],
  a11y: "Add buttons are labelled with the dish; the count badge updates as text.", perf: "One short-lived flying image per add.",
  status: "stable", priority: "P2", previewHeight: 700, steps: ["Menu", "Items added"],
};
