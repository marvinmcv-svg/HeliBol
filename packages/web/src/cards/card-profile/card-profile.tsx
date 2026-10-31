"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

export interface CardProfileProps {
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  bio?: string;
  stats: { label: string; value: number }[];
  className?: string;
}

/** Profile card: cover parallax on hover, stats that roll when you follow, and a morphing Follow → Following button. */
export function CardProfile({ name, handle, avatar, cover, bio, stats, className }: CardProfileProps) {
  const [following, setFollowing] = useState(false);
  return (
    <div className={cn("group w-72 overflow-hidden rounded-3xl border border-border bg-card shadow-lg", className)}>
      <div className="h-24 overflow-hidden"><img src={cover} alt="" className="h-full w-full scale-110 object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-125" /></div>
      <div className="px-5 pb-5">
        <div className="-mt-9 flex items-end justify-between">
          <img src={avatar} alt="" className="size-[72px] rounded-full object-cover ring-4 ring-card" />
          <motion.button layout onClick={() => setFollowing((f) => !f)} aria-pressed={following} transition={spring.snappy} className={cn("h-9 overflow-hidden rounded-full px-4 text-sm font-medium", following ? "border border-border bg-transparent" : "bg-foreground text-background")}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={String(following)} className="block" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>{following ? "Following ✓" : "Follow"}</motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
        <p className="mt-3 font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">@{handle}</p>
        {bio && <p className="mt-2 text-sm">{bio}</p>}
        <dl className="mt-4 flex gap-5 text-sm">
          {stats.map((s, i) => {
            const v = s.value + (following && i === 0 ? 1 : 0);
            return (
              <div key={s.label}>
                <dd className="relative h-5 overflow-hidden font-semibold tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}><motion.span key={v} className="block" initial={{ y: 14 }} animate={{ y: 0 }} exit={{ y: -14 }}>{v.toLocaleString()}</motion.span></AnimatePresence>
                </dd>
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
