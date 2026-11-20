"use client";
import { Activity, Bell, Cloud, Heart, Map, Music, Timer, Wallet } from "lucide-react";
import { DemoCenter } from "../../_demo";
import { MockupWatch } from "./mockup-watch";

const apps = [
  { name: "Activity", icon: <Activity className="size-5" />, color: "#22c55e" },
  { name: "Heart Rate", icon: <Heart className="size-5" />, color: "#ef4444" },
  { name: "Music", icon: <Music className="size-5" />, color: "#ec4899" },
  { name: "Weather", icon: <Cloud className="size-5" />, color: "#3b82f6" },
  { name: "Timers", icon: <Timer className="size-5" />, color: "#f59e0b" },
  { name: "Maps", icon: <Map className="size-5" />, color: "#14b8a6" },
  { name: "Wallet", icon: <Wallet className="size-5" />, color: "#18181b" },
  { name: "Alerts", icon: <Bell className="size-5" />, color: "#8b5cf6" },
];

export default function Demo() {
  return (
    <DemoCenter className="flex-row items-center gap-12 overflow-hidden">
      <MockupWatch apps={apps} />
      <p className="hidden max-w-36 text-xs leading-relaxed text-muted-foreground sm:block">Drag the crown, scroll over the face, or focus it and use ↑/↓.</p>
    </DemoCenter>
  );
}
