"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton-shimmer";

export default function Demo() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setLoaded((l) => !l), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-80 rounded-2xl border border-border bg-card p-4" aria-busy={!loaded}>
        {loaded ? (
          <div>
            <img src="/demo/photo-4.jpg" alt="" className="aspect-video w-full rounded-xl object-cover" />
            <div className="mt-3 flex items-center gap-3">
              <img src="/demo/photo-8.jpg" alt="" className="size-10 rounded-full object-cover" />
              <div><p className="text-sm font-semibold">Canopy at dawn</p><p className="text-xs text-muted-foreground">Ava Lin · 4 min read</p></div>
            </div>
          </div>
        ) : (
          <div>
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2"><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
