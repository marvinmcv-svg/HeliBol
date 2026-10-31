"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bookmark, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";

function Action({ icon: Icon, count, active, color, label, onClick }: { icon: typeof Heart; count?: number; active: boolean; color: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-pressed={active} aria-label={label} className="group flex items-center gap-1.5 text-muted-foreground">
      <motion.span whileTap={{ scale: 0.8 }} animate={active ? { scale: [1, 1.3, 1] } : { scale: 1 }} className="grid size-8 place-items-center rounded-full transition-colors group-hover:bg-accent" style={{ color: active ? color : undefined }}>
        <Icon className="size-[18px]" fill={active && label !== "Repost" ? color : "none"} />
      </motion.span>
      {count !== undefined && (
        <span className="relative h-4 overflow-hidden text-xs tabular-nums" style={{ color: active ? color : undefined }}>
          <AnimatePresence mode="popLayout" initial={false}><motion.span key={count} className="block" initial={{ y: active ? 12 : -12 }} animate={{ y: 0 }} exit={{ y: active ? -12 : 12 }} transition={spring.snappy}>{count}</motion.span></AnimatePresence>
        </span>
      )}
    </button>
  );
}

/** Social post with spring-y like / repost / save actions and rolling counters. */
export function CardSocialPost({ author, handle, avatar, text, image, className }: { author: string; handle: string; avatar: string; text: string; image?: string; className?: string }) {
  const [s, set] = useState({ like: false, repost: false, save: false });
  const t = (k: keyof typeof s) => set((x) => ({ ...x, [k]: !x[k] }));
  return (
    <article className={cn("w-full max-w-md rounded-3xl border border-border bg-card p-4", className)}>
      <header className="flex items-center gap-3"><img src={avatar} alt="" className="size-10 rounded-full object-cover" /><div><p className="text-sm font-semibold">{author}</p><p className="text-xs text-muted-foreground">@{handle} · 2h</p></div></header>
      <p className="mt-3 text-sm leading-relaxed">{text}</p>
      {image && <img src={image} alt="" className="mt-3 aspect-video w-full rounded-2xl object-cover" />}
      <footer className="mt-2 flex justify-between">
        <Action icon={MessageCircle} count={48} active={false} color="#0ea5e9" label="Reply" onClick={() => {}} />
        <Action icon={Repeat2} count={312 + (s.repost ? 1 : 0)} active={s.repost} color="#10b981" label="Repost" onClick={() => t("repost")} />
        <Action icon={Heart} count={2481 + (s.like ? 1 : 0)} active={s.like} color="#f43f5e" label="Like" onClick={() => t("like")} />
        <Action icon={Bookmark} active={s.save} color="#8b5cf6" label="Save" onClick={() => t("save")} />
      </footer>
    </article>
  );
}
