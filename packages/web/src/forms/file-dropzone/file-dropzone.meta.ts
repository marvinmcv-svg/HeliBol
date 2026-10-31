import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "file-dropzone",
  name: "File Dropzone",
  description: "Drop zone that lifts and glows on drag-over; dropped files fly into a list with per-file animated upload progress.",
  category: "forms",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion","lucide-react"],
  registryDependencies: ["kinetik-core"],
  tags: ["upload","dropzone","files","progress","drag and drop"],
  pageTypes: ["dashboard","settings"],
  inspiration: ["Vercel / Linear uploaders"],
  a11y: "Zone is a button that opens the file picker; hidden input is labelled; list is aria-live.",
  perf: "Per-file intervals; layout animations on the list.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "accept", type: "string", description: "Accepted MIME types." },
  ],
};
