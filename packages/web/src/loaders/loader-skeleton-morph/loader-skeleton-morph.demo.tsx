"use client";
import { useState } from "react";
import { DemoCenter, photos } from "../../_demo";
import { LoaderSkeletonMorph, useFakeLoad } from "./loader-skeleton-morph";

export default function Demo() {
  const [k, setK] = useState(0);
  const loaded = useFakeLoad(1600, k);
  return (
    <DemoCenter className="flex-col gap-4">
      <div className="w-80 rounded-2xl border bg-card p-5 shadow-sm">
        <LoaderSkeletonMorph loaded={loaded}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={photos[2]} alt="" className="size-11 rounded-full object-cover" />
              <div><p className="text-sm font-semibold">Mila Torres</p><p className="text-xs text-muted-foreground">Product designer · Lisbon</p></div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">Shipping a new onboarding flow this week. Looking for two beta testers who use screen readers daily — DM me.</p>
            <div className="flex gap-2 text-xs"><span className="rounded-full bg-muted px-2 py-1">Design</span><span className="rounded-full bg-muted px-2 py-1">A11y</span></div>
          </div>
        </LoaderSkeletonMorph>
      </div>
      <button type="button" onClick={() => setK((x) => x + 1)} className="rounded-full border px-3 py-1 text-xs">Reload</button>
    </DemoCenter>
  );
}
