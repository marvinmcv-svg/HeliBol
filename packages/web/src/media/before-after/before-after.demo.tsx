"use client";
import { BeforeAfter } from "./before-after";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-6"><BeforeAfter before="/demo/photo-2.jpg" after="/demo/photo-6.jpg" beforeLabel="Dusk" afterLabel="Aurora" className="w-full max-w-xl" /></div>;
}
