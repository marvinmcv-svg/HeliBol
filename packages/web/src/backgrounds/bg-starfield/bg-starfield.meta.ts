import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "bg-starfield",
  name: "Warp Starfield",
  description: "Stars stream out from the center with motion trails; raise `speed` to jump to lightspeed.",
  category: "backgrounds",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["space","stars","warp","canvas"],
  pageTypes: ["landing"],
  inspiration: ["Windows starfield screensaver"],
  a11y: "aria-hidden; one frame under reduced motion.",
  perf: "Projected 3D points drawn as lines; trails via translucent clears.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "count", type: "number", default: "500", description: "Stars." },
    { name: "speed", type: "number", default: "0.6", description: "Depth units per second." },
  ],
};
