import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-bento-scrub",
  name: "Scrubbed Bento Gallery",
  description: "A full-bleed hero image shrinks into the centre of a bento grid as you scroll while the other tiles fade in — a Flip layout change scrubbed by ScrollTrigger.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","flip","bento","gallery","hero"],
  pageTypes: ["landing","portfolio"],
  inspiration: ["GSAP Demo Hub — Scrubbed bento gallery"],
  a11y: "Images are decorative; reduced motion shows the final grid with no pinning.",
  perf: "One Flip timeline (absolute, scale) driven by a scrubbed ScrollTrigger; sticky pin.",
  status: "stable",
  priority: "P1",
  previewHeight: 480,
  props: [
    { name: "images", type: "string[]", description: "7 images; first is the hero." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
    { name: "title", type: "string", description: "Caption above the grid." },
  ],
};
