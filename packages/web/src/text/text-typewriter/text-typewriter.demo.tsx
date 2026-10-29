"use client";
import { TextTypewriter } from "./text-typewriter";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-5xl">
        Ship{" "}
        <TextTypewriter
          words={["landing pages", "dashboards", "mobile apps", "delight"]}
          className="bg-gradient-to-r from-violet-500 to-sky-500 bg-clip-text text-transparent"
          caretClassName="bg-sky-500"
        />
        <br />
        <span className="text-muted-foreground">in an afternoon.</span>
      </h2>
    </div>
  );
}
