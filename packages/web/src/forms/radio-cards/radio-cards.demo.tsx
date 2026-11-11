"use client";
import { useState } from "react";
import { Package, Rocket, Truck } from "lucide-react";
import { RadioCards } from "./radio-cards";

const options = [
  { value: "standard", title: "Standard", description: "4–6 business days", icon: <Package className="size-5" />, aside: "Free" },
  { value: "express", title: "Express", description: "2–3 business days", icon: <Truck className="size-5" />, aside: "$9" },
  { value: "overnight", title: "Overnight", description: "Next morning", icon: <Rocket className="size-5" />, aside: "$24" },
];

export default function Demo() {
  const [v, setV] = useState("express");
  return (
    <div className="grid h-full place-items-center p-6">
      <RadioCards label="Shipping" options={options} value={v} onChange={setV} className="w-full max-w-sm" />
    </div>
  );
}
