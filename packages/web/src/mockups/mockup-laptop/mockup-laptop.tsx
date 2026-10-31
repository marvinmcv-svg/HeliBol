import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

/** CSS laptop (lid, notch, hinge and base) for hero shots of web apps. */
export function MockupLaptop({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div className="relative mx-auto w-[86%] rounded-t-2xl bg-zinc-800 p-[2.2%] pb-[1.5%] shadow-2xl">
        <span className="absolute top-0 left-1/2 h-[3%] w-[14%] -translate-x-1/2 rounded-b-lg bg-black" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-background">{children}</div>
      </div>
      <div className="relative h-3 rounded-b-xl bg-gradient-to-b from-zinc-400 to-zinc-600 shadow-[0_18px_30px_-10px_rgb(0_0_0/.5)] dark:from-zinc-600 dark:to-zinc-800">
        <span className="absolute top-0 left-1/2 h-1.5 w-[16%] -translate-x-1/2 rounded-b-md bg-zinc-500/80" />
      </div>
    </div>
  );
}
