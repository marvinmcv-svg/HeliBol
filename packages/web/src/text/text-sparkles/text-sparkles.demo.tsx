"use client";
import { TextSparkles } from "./text-sparkles";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <h2 className="text-center text-5xl font-bold tracking-tight">
        Make it <TextSparkles className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">magical</TextSparkles>
      </h2>
    </div>
  );
}
