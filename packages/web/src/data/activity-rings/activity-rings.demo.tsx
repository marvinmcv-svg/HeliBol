"use client";
import { ActivityRings } from "./activity-rings";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center bg-black p-6 text-white"><ActivityRings rings={[{ label: "Move", value: 612, goal: 500, color: "#fa114f" }, { label: "Exercise", value: 24, goal: 30, color: "#a6ff00" }, { label: "Stand", value: 9, goal: 12, color: "#00e5ff" }]} /></div>;
}
