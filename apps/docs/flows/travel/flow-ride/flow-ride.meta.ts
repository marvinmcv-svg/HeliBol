import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-ride", name: "Ride Booking Sheet", category: "overlays", platforms: ["native", "web"], engine: "motion",
  description: "Uber-style booking: the route draws on the map, a draggable bottom sheet snaps between three detents with velocity, the ride selection ring glides.",
  dependencies: ["motion"], registryDependencies: ["kinetik-core"], tags: ["bottom sheet", "snap points", "map", "ride hailing", "mobile"],
  pageTypes: ["ecommerce"], inspiration: ["Uber", "Lyft", "Mobbin ride flows"],
  a11y: "Ride options are a radiogroup; the sheet's content is reachable without dragging.", perf: "Single drag motion value; snap via spring.",
  status: "stable", priority: "P1", previewHeight: 700, steps: ["Choose ride", "Sheet expanded", "Booked"],
};
