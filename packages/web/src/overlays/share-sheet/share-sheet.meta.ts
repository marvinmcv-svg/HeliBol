import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "share-sheet",
  name: "Share Sheet",
  description: "A share button that morphs into a full share sheet (shared layoutId): recent people and targets pop in with a stagger, copy-link confirms inline, and the native share sheet is used when the browser has one.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","share","sheet","morph","social","modal"],
  pageTypes: ["social","media","ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Sheet is a dialog with focus moved in and Esc to close; buttons are labelled. Reduced motion uses a fade.",
  perf: "One layout morph; pops are transform/opacity.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "url", type: "string", description: "Link to share." },
    { name: "title", type: "string", default: "Share", description: "Sheet title." },
    { name: "targets", type: "{ label; icon; color }[]", description: "Share targets." },
    { name: "people", type: "{ name; avatar }[]", default: "[]", description: "Recent contacts." },
    { name: "defaultOpen", type: "boolean", default: "false", description: "Start open." },
  ],
};
