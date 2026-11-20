"use client";
import { DemoCenter, photos } from "../../_demo";
import { LayoutSplitPanes } from "./layout-split-panes";

export default function Demo() {
  return (
    <DemoCenter>
      <div className="h-[340px] w-full max-w-2xl">
        <LayoutSplitPanes
          defaultSplit={0.42}
          left={
            <div className="h-full space-y-2 p-5 font-mono text-[12px] leading-relaxed">
              <p className="text-muted-foreground">{"// hero.tsx"}</p>
              <p><span className="text-violet-500">export function</span> <span className="text-sky-500">Hero</span>() {"{"}</p>
              <p className="pl-4"><span className="text-violet-500">return</span> {"<"}<span className="text-rose-500">section</span>{">"}</p>
              <p className="pl-8">{"<"}<span className="text-rose-500">h1</span>{">"}Ocean glass{"</"}<span className="text-rose-500">h1</span>{">"}</p>
              <p className="pl-8">{"<"}<span className="text-rose-500">img</span> <span className="text-amber-500">src</span>=<span className="text-emerald-500">"/sea.jpg"</span> {"/>"}</p>
              <p className="pl-4">{"</"}<span className="text-rose-500">section</span>{">"}</p>
              <p>{"}"}</p>
            </div>
          }
          right={
            <div className="relative h-full">
              <img src={photos[1]} alt="" className="absolute inset-0 size-full object-cover" />
              <h3 className="absolute bottom-5 left-5 text-3xl font-semibold text-white drop-shadow">Ocean glass</h3>
            </div>
          }
        />
      </div>
    </DemoCenter>
  );
}
