"use client";
import { ToastProvider, useToast } from "./toast-stack";

const samples = [
  { title: "Deployment ready", description: "kinetik-docs → production", tone: "success" as const },
  { title: "New comment", description: "Maya: “That spring feels perfect.”" },
  { title: "Build failed", description: "Type error in hero.tsx:42", tone: "error" as const },
  { title: "Invite accepted", description: "Leo joined your workspace", tone: "success" as const },
];
let i = 0;

function Buttons() {
  const toast = useToast();
  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={() => toast(samples[i++ % samples.length])} className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background">Show toast</button>
      <p className="text-xs text-muted-foreground">Add a few, hover the stack to expand, swipe right to dismiss</p>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <ToastProvider contained duration={6000}>
        <div className="grid h-full place-items-center pb-24"><Buttons /></div>
      </ToastProvider>
    </div>
  );
}
