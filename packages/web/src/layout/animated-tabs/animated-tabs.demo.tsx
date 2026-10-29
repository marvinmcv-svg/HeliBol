"use client";
import { AnimatedTabs } from "./animated-tabs";

const panel = (title: string, body: string, n: number) => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <img src={`/demo/photo-${n}.jpg`} alt="" className="mb-3 aspect-[3/1] w-full rounded-xl object-cover" />
    <p className="font-semibold">{title}</p>
    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
  </div>
);

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-6">
      <AnimatedTabs
        className="max-w-md"
        tabs={[
          { id: "overview", label: "Overview", content: panel("Overview", "Everything at a glance.", 2) },
          { id: "analytics", label: "Analytics", content: panel("Analytics", "Traffic, conversion, retention.", 7) },
          { id: "reports", label: "Reports", content: panel("Reports", "Scheduled PDF exports.", 4) },
        ]}
      />
      <AnimatedTabs variant="underline" tabs={[{ id: "a", label: "Code" }, { id: "b", label: "Preview" }, { id: "c", label: "Prompt" }]} className="w-auto" />
    </div>
  );
}
