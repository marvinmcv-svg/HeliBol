"use client";
import { LikeBurst } from "./like-burst";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-6 p-8">
      <div className="w-72 overflow-hidden rounded-2xl border border-border bg-card">
        <img src="/demo/photo-8.jpg" alt="" className="aspect-[4/3] w-full object-cover" />
        <div className="flex items-center justify-between p-2">
          <LikeBurst count={1284} />
          <span className="pr-3 text-xs text-muted-foreground">Tap the heart</span>
        </div>
      </div>
    </div>
  );
}
