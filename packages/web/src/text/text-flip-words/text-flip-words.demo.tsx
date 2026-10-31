"use client";
import { TextFlipWords } from "./text-flip-words";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h2 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
        Design that feels <br />
        <TextFlipWords words={["effortless", "tactile", "cinematic", "human"]} className="text-brand" />
      </h2>
    </div>
  );
}
