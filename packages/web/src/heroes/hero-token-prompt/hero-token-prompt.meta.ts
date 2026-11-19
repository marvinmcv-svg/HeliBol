import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-token-prompt",
  name: "Hero — Token Prompt",
  description: "Enterprise-AI hero: halftone dot fields frame a prompt box that types itself, dropping in coloured data chips; \"New suggestion\" shuffles prompts.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","ai","prompt","typing","chips","halftone"],
  pageTypes: ["ai-app","landing"],
  inspiration: ["Mobbin — Zaro hero (mobbin.com/sites/sections/1504b865-76c3-4681-8079-da52475e6e58)"],
  a11y: "Prompt text is in an aria-live region; buttons are labelled; reduced motion shows the full prompt instantly.",
  perf: "One 38ms interval while typing; static halftone backgrounds.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
