"use client";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, MessageCircle } from "lucide-react";
import { spring } from "@kinetik/tokens";
import { cn, useReducedMotion } from "@kinetik/core";

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  time: string;
  body: string;
  likes: number;
  replies?: Comment[];
}

export interface CommentThreadProps {
  comments: Comment[];
  /** Name used for new replies. */
  me?: string;
  className?: string;
}

function Item({ c, depth, me, onReply }: { c: Comment; depth: number; me: string; onReply: (parent: string, body: string) => void }) {
  const reduced = useReducedMotion();
  const id = useId();
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const likes = c.likes + (liked ? 1 : 0);
  return (
    <motion.li layout={!reduced} initial={reduced ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={spring.smooth} className="relative">
      <article aria-labelledby={`${id}-a`} className="flex gap-3">
        {c.avatar ? <img src={c.avatar} alt="" className="size-8 shrink-0 rounded-full object-cover" /> : <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{c.author[0]}</span>}
        <div className="min-w-0 flex-1">
          <p className="text-sm"><span id={`${id}-a`} className="font-semibold">{c.author}</span> <span className="text-xs text-muted-foreground">· {c.time}</span></p>
          <p className="mt-0.5 text-sm leading-relaxed">{c.body}</p>
          <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
            <button type="button" onClick={() => setLiked((l) => !l)} aria-pressed={liked} aria-label={`Like, ${likes} likes`} className={cn("inline-flex items-center gap-1 hover:text-foreground", liked && "text-rose-500")}>
              <motion.span key={String(liked)} initial={liked && !reduced ? { scale: 0.3 } : false} animate={{ scale: 1 }} transition={spring.bouncy}><Heart className={cn("size-3.5", liked && "fill-current")} /></motion.span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={likes} initial={reduced ? false : { y: liked ? 8 : -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduced ? undefined : { y: liked ? -8 : 8, opacity: 0 }} className="tabular-nums">{likes}</motion.span>
              </AnimatePresence>
            </button>
            {depth < 2 && (
              <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex items-center gap-1 hover:text-foreground">
                <MessageCircle className="size-3.5" /> Reply
              </button>
            )}
          </div>
          <AnimatePresence initial={false}>
            {open && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={reduced ? { duration: 0 } : spring.smooth}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim()) return;
                  onReply(c.id, draft.trim());
                  setDraft("");
                  setOpen(false);
                }}
                className="overflow-hidden"
              >
                <div className="mt-2 flex gap-2">
                  <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Reply to ${c.author} as ${me}…`} aria-label={`Reply to ${c.author}`} className="h-9 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  <button type="submit" disabled={!draft.trim()} className="h-9 rounded-xl bg-foreground px-3 text-sm font-medium text-background disabled:opacity-40">Post</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
          {c.replies && c.replies.length > 0 && (
            <ul className="mt-3 space-y-3 border-l border-border pl-4">
              <AnimatePresence initial={false}>{c.replies.map((r) => <Item key={r.id} c={r} depth={depth + 1} me={me} onReply={onReply} />)}</AnimatePresence>
            </ul>
          )}
        </div>
      </article>
    </motion.li>
  );
}

/**
 * Threaded comments: likes pop and their count rolls, the reply composer expands in place, and new
 * replies slide into the thread while siblings make room (layout animation). Two levels deep.
 */
export function CommentThread({ comments: initial, me = "You", className }: CommentThreadProps) {
  const [comments, setComments] = useState(initial);
  const addReply = (parent: string, body: string) => {
    const reply: Comment = { id: `${parent}-${Date.now()}`, author: me, time: "now", body, likes: 0 };
    const walk = (list: Comment[]): Comment[] => list.map((c) => (c.id === parent ? { ...c, replies: [...(c.replies ?? []), reply] } : { ...c, replies: c.replies && walk(c.replies) }));
    setComments(walk);
  };
  return (
    <ul className={cn("space-y-5", className)} aria-label="Comments">
      <AnimatePresence initial={false}>{comments.map((c) => <Item key={c.id} c={c} depth={0} me={me} onReply={addReply} />)}</AnimatePresence>
    </ul>
  );
}
