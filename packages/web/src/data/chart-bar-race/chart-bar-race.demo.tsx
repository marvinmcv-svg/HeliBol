"use client";
import { ChartBarRace } from "./chart-bar-race";

const frames = ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const series = [
  { name: "Motion", color: "#d946ef", values: [20, 32, 48, 70, 96, 120, 150, 182] },
  { name: "GSAP", color: "#65a30d", values: [60, 64, 70, 78, 88, 104, 122, 140] },
  { name: "CSS", color: "#0284c7", values: [80, 82, 84, 90, 95, 100, 108, 118] },
  { name: "Lottie", color: "#14b8a6", values: [40, 52, 60, 64, 66, 66, 64, 60] },
  { name: "three.js", color: "#ea580c", values: [30, 36, 44, 56, 70, 88, 110, 136] },
  { name: "Anime.js", color: "#e11d48", values: [44, 46, 48, 50, 50, 52, 56, 62] },
  { name: "Rive", color: "#7c3aed", values: [2, 6, 14, 28, 46, 66, 84, 102] },
];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-5">
      <ChartBarRace title="Animation engines by usage (index)" frames={frames} series={series} className="max-w-lg" />
    </div>
  );
}
