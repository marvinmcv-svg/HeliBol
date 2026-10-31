"use client";
import { VideoHover } from "./video-hover";
export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-2 content-center gap-4 p-6">
      <VideoHover poster="/demo/photo-7.jpg" title="Ocean glass at noon" meta="Kinetik Studio · 12k views" />
      <VideoHover poster="/demo/photo-5.jpg" title="Amber road trip" meta="Kinetik Studio · 8k views" />
    </div>
  );
}
