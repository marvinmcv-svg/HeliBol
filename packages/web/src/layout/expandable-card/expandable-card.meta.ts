import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "expandable-card",
  name: "Expandable Card",
  description: "List rows morph into a full dialog: image, title and subtitle fly into place with shared layout animations.",
  category: "layout",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion", "lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["layoutId", "modal", "shared layout", "list", "detail"],
  pageTypes: ["ecommerce", "portfolio", "dashboard"],
  inspiration: ["Aceternity Expandable Card", "App Store Today cards"],
  a11y: "role=dialog + aria-modal, labelled by the title; Esc/backdrop close; focus moves into the dialog and returns to the trigger on close.",
  perf: "FLIP-based layout animations (transforms only) driven by Motion's layout engine.",
  status: "stable",
  priority: "P1",
  previewHeight: 440,
  props: [{ name: "items", type: "{ id, title, subtitle, image, content }[]", description: "Cards to render." }],
};
