"use client";
import { PreloaderCounter } from "./preloader-counter";
export default function Demo() {
  return (
    <PreloaderCounter className="[container-type:inline-size]">
      <div className="relative grid h-full place-items-center"><img src="/demo/photo-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" /><h2 className="relative text-5xl font-semibold text-white">Welcome in.</h2></div>
    </PreloaderCounter>
  );
}
