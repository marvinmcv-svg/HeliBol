import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "media-thumb-reel",
  name: "Thumbnail Reel",
  description: "Hero image with a filmstrip of thumbnails: the active thumb widens into a pill with a filling progress bar while the hero slowly zooms; when it fills, the next slide cross-fades in. Hover pauses.",
  category: "media",
  platforms: ["web"],
  engine: "motion",
  dependencies: ["motion"],
  registryDependencies: ["kinetik-core"],
  tags: ["premium","carousel","slideshow","thumbnails","ken-burns","autoplay","hero"],
  pageTypes: ["landing","media","ecommerce"],
  inspiration: ["kinetik Premium collection"],
  a11y: "Thumbnails are a tablist; title is aria-live; hover and focus pause autoplay. Reduced motion: no zoom, no autoplay.",
  perf: "Flex-grow springs on 5 buttons; one image transform per slide.",
  status: "stable",
  priority: "P1",
  previewHeight: 460,
  props: [
    { name: "items", type: "{ src; title; meta?; alt? }[]", description: "Slides." },
    { name: "interval", type: "number", default: "5", description: "Seconds per slide." },
  ],
};
