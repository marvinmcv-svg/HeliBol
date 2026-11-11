"use client";
import { GsapTextReplace } from "./gsap-text-replace";

export default function Demo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
      <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Build <GsapTextReplace phrases={["landing pages", "AI interfaces", "mobile flows", "3D heroes"]} className="text-primary" />
      </h3>
      <p className="max-w-md text-muted-foreground">
        <GsapTextReplace mode="word" phrases={["Copy the code and ship it today.", "Or paste the prompt into your agent.", "Every piece respects reduced motion."]} />
      </p>
    </div>
  );
}
