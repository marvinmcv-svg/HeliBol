import type { ReactNode } from "react";
import { cn } from "@kinetik/core/utils";

/** CSS iPhone frame (titanium bezel, Dynamic Island, side buttons) that wraps any screen content or image. */
export function MockupIphone({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative aspect-[9/19.5] w-64 rounded-[3rem] bg-gradient-to-b from-zinc-600 via-zinc-800 to-zinc-700 p-[3px] shadow-[0_40px_80px_-24px_rgb(0_0_0/.55)]", className)}>
      <span className="absolute top-24 -left-[3px] h-8 w-[3px] rounded-l bg-zinc-600" />
      <span className="absolute top-36 -left-[3px] h-14 w-[3px] rounded-l bg-zinc-600" />
      <span className="absolute top-32 -right-[3px] h-20 w-[3px] rounded-r bg-zinc-600" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.8rem] bg-black p-[10px]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-background">
          {children}
          <span className="pointer-events-none absolute top-2.5 left-1/2 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
}
