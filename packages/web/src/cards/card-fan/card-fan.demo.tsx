"use client";
import { photos } from "../../_demo";
import { CardFan } from "./card-fan";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <CardFan items={photos.slice(0, 5).map((p) => <img key={p} src={p} alt="" className="h-full w-full rounded-2xl border-4 border-white object-cover shadow-xl dark:border-zinc-800" />)} />
    </div>
  );
}
