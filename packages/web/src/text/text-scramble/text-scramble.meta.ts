import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "text-scramble",
  name: "Scramble Text",
  description: "Characters decode from random glyphs into the final string — on mount, on hover/focus, or both. Great for nav links and techy headlines.",
  category: "text",
  platforms: ["web"],
  engine: "gsap",
  dependencies: ["gsap", "@gsap/react"],
  registryDependencies: ["kinetik-core"],
  tags: ["hover", "nav", "tech", "decode", "hacker"],
  pageTypes: ["landing", "portfolio"],
  inspiration: ["GSAP ScrambleTextPlugin", "Codrops glitch text"],
  a11y: "aria-label always holds the real text so screen readers never hear scrambled glyphs. Hover effect also fires on focus. Reduced motion: static text.",
  perf: "Text-node updates on one element; negligible cost.",
  status: "stable",
  priority: "P1",
  previewHeight: 260,
  props: [
    { name: "children", type: "string", description: "Final text." },
    { name: "trigger", type: '"mount" | "hover" | "both"', default: '"both"', description: "When to scramble." },
    { name: "chars", type: "string", default: '"upperCase"', description: 'Glyph set: "upperCase", "lowerCase", "upperAndLowerCase" or a custom string like "01".' },
    { name: "duration", type: "number", default: "1.1", description: "Seconds." },
  ],
};
