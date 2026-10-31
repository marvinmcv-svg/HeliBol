"use client";
import { ButtonRipple } from "./button-ripple";
export default function Demo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 p-8">
      <ButtonRipple>Press anywhere on me</ButtonRipple>
      <ButtonRipple className="h-24 w-56 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">Big target</ButtonRipple>
    </div>
  );
}
