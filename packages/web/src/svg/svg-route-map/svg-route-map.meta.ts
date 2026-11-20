import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "svg-route-map",
  name: "SVG — Live Route Map",
  description: "Delivery-tracking map: a stylised street grid, the route draws itself, a courier marker follows the path and turns to its heading, stops light up as it passes and an ETA counts down.",
  category: "svg",
  platforms: ["web"],
  engine: "svg",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","map","route","delivery","tracking","svg","eta"],
  pageTypes: ["ecommerce","dashboard"],
  inspiration: ["kinetik Premium collection"],
  a11y: "role=img with an aria-label carrying the ETA. Reduced motion shows the completed route.",
  perf: "getPointAtLength each frame on one path; the marker is a single transformed group.",
  status: "stable",
  priority: "P1",
  previewHeight: 420,
  props: [
    { name: "route", type: "string", description: "Path in a 400×260 viewBox." },
    { name: "stops", type: "{ label; at }[]", description: "Stops along the route (0–1)." },
    { name: "duration", type: "number", default: "8", description: "Seconds per trip." },
    { name: "minutes", type: "number", default: "18", description: "ETA total." },
  ],
};
