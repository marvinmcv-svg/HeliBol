"use client";
import { TransitionCurtain } from "./transition-curtain";
const page = (n: number, t: string) => <div className="relative grid h-full place-items-center"><img src={`/demo/photo-${n}.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover" /><h2 className="relative text-5xl font-semibold text-white">{t}</h2></div>;
export default function Demo() {
  return <TransitionCurtain pages={[{ title: "Home", content: page(1, "Home") }, { title: "Work", content: page(3, "Work") }, { title: "About", content: page(6, "About") }]} />;
}
