import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-video-dialog",
  name: "Hero — Video Dialog",
  description: "Product thumbnail with a pulsing play button that expands (shared layout) into a full-screen video dialog.",
  category: "heroes",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","video","dialog","demo","layoutId"],
  pageTypes: ["landing"],
  inspiration: ["Magic UI Hero Video Dialog"],
  a11y: "Play is a labelled button; dialog is aria-modal, Esc/backdrop/close button dismiss, focus moves to Close.",
  perf: "Video loads only when opened.",
  status: "stable",
  priority: "P1",
  previewHeight: 560,
  props: [
    { name: "thumbnail", type: "string", description: "Poster image." },
    { name: "videoSrc", type: "string", description: "Video URL." },
    { name: "title", type: "string", description: "Heading." },
  ],
};
