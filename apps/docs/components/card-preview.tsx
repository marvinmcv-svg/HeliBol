"use client";
import { useState } from "react";
import { cn } from "@kinetik/core";
import { thumbs } from "@/lib/registry.generated";
import { LazyDemo } from "./lazy-demo";

/**
 * 21st.dev-style card media: a static thumbnail (captured with REA) by default,
 * swapped for the live, interactive demo while hovered or focused.
 * Falls back to an in-view live demo when no thumbnail exists yet.
 */
export function CardPreview({ id, name, inner }: { id: string; name: string; inner: string }) {
  const thumb = thumbs[id];
  const [live, setLive] = useState(false);
  if (!thumb)
    return (
      <div className={cn("absolute inset-0 origin-top-left", inner)}>
        <LazyDemo id={id} />
      </div>
    );
  return (
    <div className="absolute inset-0" onPointerEnter={(e) => e.pointerType !== "touch" && setLive(true)} onFocus={() => setLive(true)}>
      <img src={thumb} alt={`${name} preview`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
      {live && (
        <div className={cn("absolute inset-0 origin-top-left [animation:k-fadein_.35s_ease]", inner)}>
          <LazyDemo id={id} eager />
        </div>
      )}
      {!live && (
        <span className="pointer-events-none absolute right-2 bottom-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          Hover to play
        </span>
      )}
    </div>
  );
}
