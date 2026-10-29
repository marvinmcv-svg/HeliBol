"use client";
import { useState } from "react";
import { m } from "motion/react";
import { MotionProvider } from "./motion-provider";

export default function Demo() {
  const [on, setOn] = useState(false);
  return (
    <MotionProvider>
      <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
        <div className="flex h-16 w-64 items-center rounded-2xl border border-border bg-card p-2">
          <m.div layout className="size-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500" style={{ marginLeft: on ? "auto" : 0 }} />
        </div>
        <button onClick={() => setOn((v) => !v)} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent">
          Toggle (uses the provider&apos;s default spring)
        </button>
        <p className="max-w-xs text-center text-xs text-muted-foreground">Uses <code>m.div</code> + LazyMotion. Turn on “Reduce motion” and the box jumps instead of springing.</p>
      </div>
    </MotionProvider>
  );
}
