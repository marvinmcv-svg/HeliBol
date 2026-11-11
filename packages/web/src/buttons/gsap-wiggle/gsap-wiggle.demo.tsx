"use client";
import { useState } from "react";
import { Bell, Heart } from "lucide-react";
import { GsapWiggle } from "./gsap-wiggle";

export default function Demo() {
  const [errors, setErrors] = useState(0);
  const [email, setEmail] = useState("");
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-10 p-6">
      <GsapWiggle kind="ring" onHover>
        <button aria-label="Notifications" className="relative grid size-14 place-items-center rounded-2xl border border-border bg-card shadow-sm">
          <Bell className="size-6" />
          <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">3</span>
        </button>
      </GsapWiggle>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.includes("@")) setErrors((n) => n + 1);
        }}
      >
        <GsapWiggle kind="shake" trigger={errors}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.dev" aria-invalid={errors > 0 && !email.includes("@")} className="h-10 w-56 rounded-lg border border-border bg-background px-3 text-sm outline-none aria-[invalid=true]:border-rose-500" />
        </GsapWiggle>
        <button className="h-9 rounded-lg bg-foreground text-sm font-medium text-background">Subscribe (try empty)</button>
      </form>
      <GsapWiggle kind="jelly" onHover>
        <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg">Jelly button</button>
      </GsapWiggle>
      <GsapWiggle kind="nudge" onHover>
        <button aria-label="Like" className="grid size-12 place-items-center rounded-full bg-rose-500/15 text-rose-500"><Heart className="size-5 fill-current" /></button>
      </GsapWiggle>
    </div>
  );
}
