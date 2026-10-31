"use client";
import { useEffect, useState } from "react";
import { LazyDemo } from "./lazy-demo";

export function ThumbStage({ id }: { id: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div data-thumb-ready={ready || undefined} className="fixed inset-0 z-[200] overflow-hidden bg-background">
      <LazyDemo id={id} eager />
    </div>
  );
}
