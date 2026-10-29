"use client";
import { TextScramble } from "./text-scramble";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 font-mono">
      <TextScramble as="h2" className="text-3xl font-semibold tracking-tight sm:text-5xl">
        ACCESS GRANTED
      </TextScramble>
      <div className="flex gap-6 text-sm">
        {["Work", "About", "Contact"].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} className="rounded text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            <TextScramble trigger="hover" chars="01">{l.toUpperCase()}</TextScramble>
          </a>
        ))}
      </div>
    </div>
  );
}
