import type { ComponentMeta } from "@web/types";
export const meta: ComponentMeta = {
  id: "flow-music-player", name: "Expanding Music Player", category: "media", platforms: ["native", "web"], engine: "motion",
  description: "Apple Music-style mini player that expands into a full-screen player: artwork, title and shell morph with shared layout; art shrinks when paused.",
  dependencies: ["motion", "lucide-react"], registryDependencies: ["kinetik-core"], tags: ["music", "player", "shared element", "mobile"],
  pageTypes: ["media"], inspiration: ["Apple Music", "Spotify"],
  a11y: "Mini player is a button; Minimize and Play/Pause labelled.", perf: "Shared layout transitions; transforms only.",
  status: "stable", priority: "P1", previewHeight: 700, steps: ["Mini player", "Now playing", "Paused"],
};
