import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "gsap-scroll-spy",
  name: "Scroll Spy Rail",
  description: "Long-read layout with a lateral rail: the active chapter highlights as you read, the rail fills with progress, and labels glide you to their section with ScrollTo.",
  category: "scroll",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap","@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["scroll","navigation","toc","docs","scrollto"],
  pageTypes: ["docs","blog"],
  inspiration: ["GSAP Demo Hub — Lateral pin indicator / Scroll waypoints"],
  a11y: "Nav is a labelled <nav> with real buttons and aria-current; reduced motion jumps instantly.",
  perf: "One ScrollTrigger per section + one scrubbed scaleY.",
  status: "stable",
  priority: "P2",
  previewHeight: 460,
  props: [
    { name: "sections", type: "{ id, label, content }[]", description: "Chapters." },
    { name: "scroller", type: "RefObject<HTMLElement>", description: "Custom scroller." },
  ],
};
