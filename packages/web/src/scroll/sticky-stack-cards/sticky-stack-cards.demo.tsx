"use client";
import { DemoScroller, photos, useDemoScroller } from "../../_demo";
import { StickyStackCards } from "./sticky-stack-cards";

const steps = [
  { t: "Discover", d: "Browse 70+ components by category, engine or page type.", c: "from-violet-600 to-indigo-700" },
  { t: "Preview", d: "Replay, resize and test reduced motion live.", c: "from-fuchsia-600 to-rose-600" },
  { t: "Install", d: "One shadcn command drops the source into your repo.", c: "from-amber-500 to-orange-600" },
  { t: "Prompt", d: "Or paste the AI prompt into your coding agent.", c: "from-emerald-500 to-teal-600" },
];

function Stack() {
  const c = useDemoScroller() ?? undefined;
  return (
    <div className="px-6">
      <div className="h-[30cqh]" />
      <StickyStackCards
        container={c}
        items={steps.map((s, i) => (
          <div key={s.t} className={`mx-auto grid max-w-xl grid-cols-[1fr_140px] items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-2xl ${s.c}`}>
            <div>
              <p className="text-xs font-medium opacity-70">Step 0{i + 1}</p>
              <h3 className="mt-1 text-2xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm opacity-85">{s.d}</p>
            </div>
            <img src={photos[i + 2]} alt="" className="aspect-square rounded-2xl object-cover" />
          </div>
        ))}
      />
      <div className="h-[40cqh]" />
    </div>
  );
}

export default function Demo() {
  return (
    <DemoScroller>
      <Stack />
    </DemoScroller>
  );
}
