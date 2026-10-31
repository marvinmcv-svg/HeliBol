import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hover-card",
  name: "Hover Card",
  description: "Rich preview card that springs up from a link after a short hover-intent delay — profiles and link previews.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["hover card","preview","profile","popover"],
  pageTypes: ["social","blog","docs"],
  inspiration: ["GitHub / X hover cards","Radix Hover Card"],
  a11y: "Opens on focus too; aria-describedby links trigger and card; moving into the card keeps it open.",
  perf: "Mounted only while open.",
  status: "stable",
  priority: "P2",
  previewHeight: 320,
  props: [
    { name: "trigger", type: "ReactNode", description: "Trigger element." },
    { name: "children", type: "ReactNode", description: "Card content." },
    { name: "openDelay", type: "number", default: "350", description: "Hover intent delay (ms)." },
  ],
};
