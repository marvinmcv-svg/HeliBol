"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Image, Mic, Music, PenLine, Share2, Video, MapPin } from "lucide-react";
import { GsapRadialMenu } from "./gsap-radial-menu";

export default function Demo() {
  const [picked, setPicked] = useState("—");
  const wrap = useRef<HTMLDivElement>(null);
  // open on first paint so the preview shows the ring
  useEffect(() => {
    const t = setTimeout(() => wrap.current?.querySelector<HTMLButtonElement>("[aria-expanded]")?.click(), 400);
    return () => clearTimeout(t);
  }, []);
  const items = [
    ["Photo", Camera], ["Gallery", Image], ["Voice", Mic], ["Music", Music], ["Note", PenLine], ["Share", Share2], ["Video", Video], ["Place", MapPin],
  ] as const;
  return (
    <div ref={wrap} className="flex h-full w-full flex-col items-center justify-center gap-10 p-6">
      <GsapRadialMenu items={items.map(([label, icon]) => ({ label, icon, onSelect: () => setPicked(label) }))} />
      <p className="text-xs text-muted-foreground">Last action: <span className="font-medium text-foreground">{picked}</span></p>
    </div>
  );
}
