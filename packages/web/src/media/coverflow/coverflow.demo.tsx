"use client";
import { photoAlt, photos } from "../../_demo";
import { Coverflow } from "./coverflow";
export default function Demo() {
  return <div className="flex h-full w-full items-center justify-center p-4"><Coverflow className="w-full" items={photos.map((src, i) => ({ src, title: photoAlt[i] }))} /></div>;
}
