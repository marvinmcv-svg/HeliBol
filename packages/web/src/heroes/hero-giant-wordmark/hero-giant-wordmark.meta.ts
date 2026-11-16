import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "hero-giant-wordmark",
  name: "Hero — Giant Wordmark",
  description: "Brand hero inverted: a tall white card with rounded bottom holds the serif pitch, CTA, link columns and a small mark + copyright, while a colossal serif wordmark rises letter by letter out of a pale sky below.",
  category: "heroes",
  platforms: ["web"],
  engine: "css",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["hero","brand","wordmark","serif","sky","inverted"],
  pageTypes: ["landing"],
  inspiration: ["Mobbin — Lassie hero (mobbin.com/sites/sections/b8d17593-6d42-40f6-ac71-88c5f0b8a12c)"],
  a11y: "h1 is the serif pitch; wordmark has aria-label with letters aria-hidden; reduced motion stops letter rise and sky drift.",
  perf: "Per-letter CSS transforms; background-position loop.",
  status: "stable",
  priority: "P2",
  previewHeight: 520,
  props: [
    { name: "className", type: "string", description: "Size/position the section." },
  ],
};
