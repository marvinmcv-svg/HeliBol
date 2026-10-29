"use client";
import { forwardRef, useRef, type ReactNode } from "react";
import { Cloud, Database, GitBranch, Mail, MessageSquare, Sparkles, Zap } from "lucide-react";
import { AnimatedBeam } from "./animated-beam";

const Node = forwardRef<HTMLDivElement, { children: ReactNode; big?: boolean }>(({ children, big }, ref) => (
  <div ref={ref} className={`z-10 grid place-items-center rounded-full border border-border bg-card shadow-[0_0_20px_-8px_rgb(0_0_0/.4)] ${big ? "size-16" : "size-11"}`}>{children}</div>
));
Node.displayName = "Node";

export default function Demo() {
  const c = useRef<HTMLDivElement>(null);
  const l = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const r = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const hub = useRef<HTMLDivElement>(null);
  const li = [GitBranch, MessageSquare, Mail];
  const ri = [Database, Cloud, Zap];
  return (
    <div ref={c} className="relative mx-auto flex h-full w-full max-w-lg items-center justify-between p-8 text-muted-foreground">
      <div className="flex flex-col gap-6">{li.map((I, i) => <Node key={i} ref={l[i]}><I className="size-5" /></Node>)}</div>
      <Node ref={hub} big><Sparkles className="size-7 text-brand" /></Node>
      <div className="flex flex-col gap-6">{ri.map((I, i) => <Node key={i} ref={r[i]}><I className="size-5" /></Node>)}</div>
      {l.map((ref, i) => <AnimatedBeam key={`l${i}`} container={c} from={ref} to={hub} curvature={(i - 1) * -40} delay={i * 0.4} />)}
      {r.map((ref, i) => <AnimatedBeam key={`r${i}`} container={c} from={hub} to={ref} curvature={(i - 1) * -40} delay={1 + i * 0.4} colorFrom="#22d3ee" colorTo="#34d399" />)}
    </div>
  );
}
