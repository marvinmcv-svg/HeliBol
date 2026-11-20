"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { cn, useReducedMotion } from "@kinetik/core";

export interface VoiceTurn {
  who: "user" | "agent";
  text: string;
}

export interface AiVoiceCallProps {
  /** Scripted conversation for the demo; wire your real transcript stream instead. */
  turns: VoiceTurn[];
  agentName?: string;
  className?: string;
}

/**
 * Voice-agent call screen: a living orb that breathes while listening and ripples with energy while
 * the agent speaks, live captions that type in word by word, a call timer, mute and hang-up. States:
 * listening → thinking (orb contracts, shimmer) → speaking.
 */
export function AiVoiceCall({ turns, agentName = "Nova", className }: AiVoiceCallProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [words, setWords] = useState(0);
  const [phase, setPhase] = useState<"listening" | "thinking" | "speaking">("listening");
  const [muted, setMuted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [secs, setSecs] = useState(0);
  const turn = turns[i % turns.length];
  const total = turn.text.split(" ").length;

  useEffect(() => {
    if (ended) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [ended]);
  useEffect(() => {
    if (ended) return;
    if (words < total) {
      const id = setTimeout(() => setWords((w) => w + 1), reduced ? 0 : 140);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      const nextTurn = turns[(i + 1) % turns.length];
      if (nextTurn.who === "agent") {
        setPhase("thinking");
        setTimeout(() => (setPhase("speaking"), setI((n) => n + 1), setWords(0)), 900);
      } else {
        setPhase("listening");
        setI((n) => n + 1);
        setWords(0);
      }
    }, 1200);
    return () => clearTimeout(id);
  }, [words, total, i, turns, ended, reduced]);
  useEffect(() => setPhase(turn.who === "agent" ? "speaking" : "listening"), [i]); // eslint-disable-line react-hooks/exhaustive-deps

  const speaking = phase === "speaking" && !ended;
  return (
    <div className={cn("relative flex h-full w-full max-w-sm flex-col items-center overflow-hidden rounded-[2rem] bg-zinc-950 p-6 text-white", className)}>
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">{ended ? "Call ended" : phase}</p>
      <p className="mt-1 font-mono text-sm tabular-nums text-white/60">{String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}</p>
      <div className="relative my-6 grid size-44 place-items-center" aria-hidden>
        {[0, 1, 2].map((k) => (
          <motion.span
            key={k}
            className="absolute inset-0 rounded-full border border-violet-400/40"
            animate={speaking && !reduced ? { scale: [1, 1.5 + k * 0.15], opacity: [0.6, 0] } : { scale: 1, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.5, ease: "easeOut" }}
          />
        ))}
        <motion.span
          className="size-32 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f5d0fe,#a855f7_45%,#4c1d95)] shadow-[0_0_80px_-10px_rgb(168_85_247/.8)]"
          animate={
            reduced || ended
              ? { scale: 1 }
              : phase === "thinking"
                ? { scale: [0.9, 0.85, 0.9], filter: ["hue-rotate(0deg)", "hue-rotate(40deg)", "hue-rotate(0deg)"] }
                : speaking
                  ? { scale: [1, 1.08, 0.97, 1.05, 1], borderRadius: ["50%", "46% 54% 52% 48%", "52% 48% 46% 54%", "50%"] }
                  : { scale: [1, 1.03, 1] }
          }
          transition={{ duration: phase === "speaking" ? 1.1 : 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="min-h-24 w-full text-center" aria-live="polite">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">{turn.who === "agent" ? agentName : "You"}</p>
        <p className={cn("mt-1 text-lg leading-snug", turn.who === "agent" ? "text-white" : "text-white/70")}>
          <AnimatePresence initial={false}>
            {turn.text.split(" ").slice(0, words).map((w, k) => (
              <motion.span key={`${i}-${k}`} initial={reduced ? false : { opacity: 0, filter: "blur(4px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} className="inline-block whitespace-pre">{w} </motion.span>
            ))}
          </AnimatePresence>
        </p>
      </div>
      <div className="mt-auto flex gap-6 pt-6">
        <button type="button" onClick={() => setMuted((m) => !m)} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"} className={cn("grid size-14 place-items-center rounded-full transition-colors", muted ? "bg-white text-black" : "bg-white/10 hover:bg-white/20")}>
          {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </button>
        <button type="button" onClick={() => setEnded(true)} aria-label="End call" className="grid size-14 place-items-center rounded-full bg-rose-500 hover:bg-rose-600"><PhoneOff className="size-5" /></button>
      </div>
    </div>
  );
}
