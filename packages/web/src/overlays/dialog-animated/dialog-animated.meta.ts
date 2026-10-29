import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "dialog-animated",
  name: "Native Animated Dialog",
  description: "A real <dialog> with enter and exit animations in pure CSS (@starting-style + allow-discrete), blurred backdrop and click-outside.",
  category: "overlays",
  platforms: ["web"],
  engine: "css",
  dependencies: ["lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["dialog", "modal", "@starting-style", "native", "top layer"],
  pageTypes: ["dashboard", "settings", "auth"],
  inspiration: ["Chrome @starting-style demos", "Radix Dialog"],
  a11y: "showModal() gives focus trapping, Esc, inert page and top-layer stacking natively; labelled by its title.",
  perf: "No animation library; transitions on opacity/scale/translate only.",
  status: "stable",
  priority: "P1",
  previewHeight: 360,
  props: [
    { name: "open / onOpenChange", type: "boolean / (open) => void", description: "Controlled state." },
    { name: "title / description", type: "string", description: "Header copy (title labels the dialog)." },
  ],
};
