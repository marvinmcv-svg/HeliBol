import type { ComponentMeta } from "../../types";

export const meta: ComponentMeta = {
  id: "video-hover",
  name: "Video Hover Preview",
  description: "Card that plays a muted preview on hover/focus — or a Ken Burns pan without video — with a progress line.",
  category: "media",
  platforms: ["web"],
  engine: "js",
  dependencies: [],
  registryDependencies: ["kinetik-core"],
  tags: ["video","preview","hover","youtube"],
  pageTypes: ["media","blog","portfolio"],
  inspiration: ["YouTube / Netflix hover previews"],
  a11y: "Plays on focus too; videos are muted and never autoplay sound; reduced motion keeps the poster still.",
  perf: "preload=none; pauses and rewinds on leave.",
  status: "stable",
  priority: "P2",
  previewHeight: 300,
  props: [
    { name: "poster / src / title / meta", type: "string", description: "Content." },
  ],
};
