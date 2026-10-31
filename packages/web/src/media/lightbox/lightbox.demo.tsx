"use client";
import { photoAlt, photos } from "../../_demo";
import { Lightbox } from "./lightbox";
export default function Demo() {
  return <div className="relative h-full w-full overflow-auto p-6 [contain:paint]"><Lightbox images={photos.slice(0, 6).map((src, i) => ({ src, alt: photoAlt[i] }))} className="mx-auto max-w-md" /></div>;
}
