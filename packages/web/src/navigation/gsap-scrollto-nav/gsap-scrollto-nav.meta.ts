import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-scrollto-nav",
  name: "ScrollTo Table of Contents",
  description: "Docs-style table of contents: links glide the scroller to each section with ScrollToPlugin (eased, interruptible) while ScrollTriggers track the active section and a bar slides beside it.",
  category: "navigation",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap"],
  registryDependencies: ["kinetik-core"],
  tags: ["gsap","scrollto","toc","docs","navigation"],
  pageTypes: ["docs","blog"],
  inspiration: ["GSAP Demo Hub — ScrollTo / scroll waypoints"],
  a11y: "Real anchor links with aria-current=location; sections are focusable regions and receive focus after the jump. Reduced motion: instant jump.",
  perf: "ScrollTo autoKill hands control back as soon as the user scrolls.",
  status: "stable",
  priority: "P2",
  previewHeight: 420,
  props: [
    { name: "sections", type: "{ id, label, content }[]", description: "Sections." },
    { name: "scroller", type: "RefObject<HTMLElement>", default: "window", description: "Scroll container." },
  ],
};
