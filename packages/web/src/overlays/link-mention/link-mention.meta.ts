import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "link-mention",
  name: "Inline Link Mention",
  description: "Notion-style inline mention pill inside running text that springs open a rich preview card (image, title, description, URL) on hover or keyboard focus.",
  category: "overlays",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["link","preview","mention","hover card","docs"],
  pageTypes: ["docs","blog"],
  inspiration: ["unlumen UI — Notion Mention Link"],
  a11y: "Real <a> link; preview has role=tooltip and is wired with aria-describedby while open; opens on focus too. Reduced motion: fade only.",
  perf: "Card mounts only while open; 180 ms open delay avoids flicker when the pointer passes over.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "href", type: "string", description: "Link target." },
    { name: "icon", type: "ReactNode", description: "Favicon/emoji." },
    { name: "title", type: "string", description: "Preview title." },
    { name: "description", type: "string", description: "Preview text." },
    { name: "image", type: "string", description: "Preview image." },
  ],
};
