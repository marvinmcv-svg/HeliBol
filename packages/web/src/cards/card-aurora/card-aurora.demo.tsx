"use client";
import { Sparkles, Zap } from "lucide-react";
import { DemoCenter } from "../../_demo";
import { CardAurora } from "./card-aurora";

export default function Demo() {
  return (
    <DemoCenter>
      <CardAurora className="w-64">
        <Sparkles className="size-5" />
        <h3 className="mt-6 text-lg font-semibold">Smart drafts</h3>
        <p className="mt-1 text-sm text-muted-foreground">Write the first version for you, in your voice.</p>
      </CardAurora>
      <CardAurora className="w-64" colors={["#f59e0b", "#ef4444", "#8b5cf6"]}>
        <Zap className="size-5" />
        <h3 className="mt-6 text-lg font-semibold">Instant sync</h3>
        <p className="mt-1 text-sm text-muted-foreground">Every device, every change, under 50 ms.</p>
      </CardAurora>
    </DemoCenter>
  );
}
