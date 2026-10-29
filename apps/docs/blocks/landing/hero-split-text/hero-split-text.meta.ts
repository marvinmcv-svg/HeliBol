import type { ComponentMeta } from "@web/types";

export const meta: ComponentMeta = {
  id: "hero-split-text",
  name: "Hero — Split Text + Aurora",
  description: "Landing hero: border-beam announcement pill, words rising from masks, blur-in subhead, shimmer CTA over a grainy aurora.",
  category: "text",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap", "@gsap/react", "motion", "lucide-react"],
  registryDependencies: ["kinetik-core", "text-split-reveal", "text-blur-in", "bg-aurora", "bg-noise", "button-shimmer", "button-border-beam", "button-press", "scroll-reveal"],
  tags: ["hero", "landing", "headline", "aurora", "cta"],
  pageTypes: ["landing"],
  a11y: "Real h1; all motion has reduced-motion fallbacks from the underlying components.",
  perf: "CSS backgrounds; GSAP only for the headline split.",
  status: "stable",
  priority: "P1",
  previewHeight: 560,
};
