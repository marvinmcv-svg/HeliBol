"use client";
import { Bell, Camera, Cloud, Code2, Compass, Cpu, Feather, Flame, Gem, Globe, Heart, Leaf, Music, Palette, Rocket, Sparkles, Star, Sun, Zap, Moon, Anchor, Coffee, Gift, Key } from "lucide-react";
import { GsapProximityGrid } from "./gsap-proximity-grid";

const icons = [Rocket, Sparkles, Palette, Music, Camera, Globe, Code2, Cpu, Heart, Flame, Leaf, Gem, Zap, Star, Sun, Moon, Cloud, Compass, Feather, Bell, Anchor, Coffee, Gift, Key];
const hues = ["text-violet-400", "text-sky-400", "text-pink-400", "text-amber-400", "text-emerald-400", "text-rose-400"];

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <GsapProximityGrid
        className="w-full max-w-xl"
        columns={8}
        items={icons.map((I, i) => <I key={i} className={`size-5 ${hues[i % hues.length]}`} />)}
      />
      <p className="text-xs text-muted-foreground">Move your cursor across the grid</p>
    </div>
  );
}
