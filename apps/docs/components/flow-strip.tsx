"use client";
import { lazy, Suspense, useMemo, type ComponentType } from "react";
import { demoLoaders } from "@/lib/registry.generated";

/** Mobbin-style strip: every screen of a flow rendered side by side, each frozen at its step. */
export function FlowStrip({ id, steps }: { id: string; steps: string[] }) {
  const Demo = useMemo(() => lazy(demoLoaders[id] as () => Promise<{ default: ComponentType<{ initialStep?: number }> }>), [id]);
  return (
    <div className="scrollbar-thin -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
      {steps.map((s, i) => (
        <figure key={s} className="k-preview w-[230px] shrink-0 snap-start">
          <div className="h-[470px] rounded-2xl border border-border bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_0)] [background-size:18px_18px]">
            <Suspense fallback={null}>
              <Demo initialStep={i} />
            </Suspense>
          </div>
          <figcaption className="mt-2 flex items-center gap-2 text-sm">
            <span className="grid size-5 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-background">{i + 1}</span>
            {s}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
