"use client";
import { ButtonSend } from "./button-send";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-border bg-card p-1.5 pl-4">
        <input placeholder="Write a message…" className="flex-1 bg-transparent text-sm outline-none" />
        <ButtonSend />
      </div>
    </div>
  );
}
