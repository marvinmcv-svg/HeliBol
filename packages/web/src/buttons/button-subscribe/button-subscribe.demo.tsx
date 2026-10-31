"use client";
import { ButtonSubscribe } from "./button-subscribe";
export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="font-semibold">The kinetik weekly</p>
      <p className="text-sm text-muted-foreground">One new animation every Friday.</p>
      <ButtonSubscribe />
    </div>
  );
}
