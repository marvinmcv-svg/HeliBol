"use client";
import { LoaderMorph } from "./loader-morph";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center gap-10 p-6"><LoaderMorph className="text-violet-500" /><LoaderMorph size={36} className="text-amber-500" /><LoaderMorph size={24} className="text-foreground" /></div>;
}
