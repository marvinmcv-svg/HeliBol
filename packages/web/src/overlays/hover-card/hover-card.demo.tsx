"use client";
import { HoverCard } from "./hover-card";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-start justify-center p-10">
      <p className="max-w-sm text-center text-sm leading-relaxed">
        The token system was designed by{" "}
        <HoverCard trigger={<a href="#" className="font-medium text-brand underline underline-offset-4">@avamotion</a>}>
          <span className="flex gap-3"><img src="/demo/photo-8.jpg" alt="" className="size-12 rounded-full object-cover" /><span><span className="block font-semibold">Ava Lin</span><span className="block text-xs text-muted-foreground">@avamotion</span><span className="mt-2 block text-sm">Design engineer. Tunes springs for a living.</span><span className="mt-2 block text-xs text-muted-foreground"><b className="text-foreground">12.8k</b> followers · <b className="text-foreground">71</b> components</span></span></span>
        </HoverCard>{" "}
        and the community.
      </p>
    </div>
  );
}
