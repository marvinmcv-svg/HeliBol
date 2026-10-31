"use client";
import { SelectAnimated } from "./select-animated";
export default function Demo() {
  return <div className="flex h-full w-full justify-center p-6 pt-12"><SelectAnimated label="Spring preset" options={[{ value: "snappy", label: "Snappy", hint: "500 / 35 — toggles, tabs" }, { value: "smooth", label: "Smooth", hint: "260 / 30 — default layout" }, { value: "gentle", label: "Gentle", hint: "120 / 20 — cards, sheets" }, { value: "bouncy", label: "Bouncy", hint: "400 / 15 — likes, success" }, { value: "heavy", label: "Heavy", hint: "200 / 40 — drawers" }]} /></div>;
}
