"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TransitionSlideStack } from "./transition-slide-stack";

const screens = ["Settings", "Notifications", "Sounds & Haptics"];

export default function Demo() {
  const [stack, setStack] = useState([0]);
  const [dir, setDir] = useState<1 | -1>(1);
  const cur = stack[stack.length - 1];
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="h-[340px] w-[260px] overflow-hidden rounded-[2rem] border-[6px] border-foreground/90 bg-background shadow-2xl">
        <TransitionSlideStack screenKey={String(cur)} direction={dir}>
          <div className="flex h-full flex-col">
            <div className="flex h-12 items-center border-b border-border px-3 text-sm font-semibold">
              {stack.length > 1 && (
                <button onClick={() => { setDir(-1); setStack((s) => s.slice(0, -1)); }} className="-ml-1 flex items-center text-brand">
                  <ChevronLeft className="size-4" /> Back
                </button>
              )}
              <span className="absolute left-1/2 -translate-x-1/2">{screens[cur]}</span>
            </div>
            <ul className="divide-y divide-border text-sm">
              {["General", "Privacy", "Display", "Battery"].map((r) => (
                <li key={r}>
                  <button
                    disabled={cur === screens.length - 1}
                    onClick={() => { setDir(1); setStack((s) => [...s, cur + 1]); }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-accent disabled:opacity-60"
                  >
                    {r} <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </TransitionSlideStack>
      </div>
    </div>
  );
}
