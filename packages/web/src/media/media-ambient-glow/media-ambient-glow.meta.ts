import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "media-ambient-glow",
  name: "Ambient Glow Media",
  description: "YouTube-style ambient mode: the image or video is drawn into a tiny canvas behind itself, scaled and blurred, so its own colours spill around the frame.",
  category: "media",
  platforms: ["web"],
  engine: "canvas",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["video","ambient","glow","media","image"],
  pageTypes: ["media","portfolio"],
  inspiration: ["unlumen UI — Video Ambient"],
  a11y: "Glow canvas is aria-hidden; video is muted. Reduced motion: video doesn't autoplay and the glow doesn't resample.",
  perf: "32×18 canvas resampled at ~6 fps for video, once for images; the blur is a CSS filter on a tiny bitmap.",
  status: "stable",
  priority: "P2",
  previewHeight: 360,
  props: [
    { name: "src", type: "string", description: "Image or video URL (same-origin or CORS-enabled)." },
    { name: "kind", type: "'image' | 'video'", default: "'image'", description: "Media type." },
    { name: "intensity", type: "number", default: "0.8", description: "Glow opacity." },
  ],
};
