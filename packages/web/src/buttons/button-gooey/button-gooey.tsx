"use client";
import { useId, type ButtonHTMLAttributes } from "react";
import { cn } from "@kinetik/core";

/** Liquid button: blobs bubble out of the edges on hover and merge with the body through an SVG goo filter. */
export function ButtonGooey({ className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const id = `k-goo-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const blobs = [
    [10, 0.0], [28, 0.05], [50, 0.1], [72, 0.05], [90, 0.0],
  ];
  return (
    <button className={cn("group relative inline-flex h-12 items-center px-8 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full", className)} {...props}>
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feColorMatrix in="b" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -9" result="g" />
          <feComposite in="SourceGraphic" in2="g" operator="atop" />
        </filter>
      </svg>
      <span aria-hidden data-goo={id} className="absolute inset-0" style={{ filter: `url(#${id})` }}>
        <span className="absolute inset-0 rounded-full bg-violet-600" />
        {blobs.map(([left, delay], i) => (
          <span
            key={i}
            className="absolute size-7 rounded-full bg-violet-600 transition-transform duration-700 ease-[cubic-bezier(.34,1.56,.64,1)] motion-reduce:hidden"
            style={{ left: `calc(${left}% - 14px)`, top: "calc(50% - 14px)", transitionDelay: `${delay}s` }}
            data-i={i}
          />
        ))}
      </span>
      <style>{[[-14, -18], [0, 22], [0, -24], [0, 20], [14, -16]].map(([x, y], i) => `.group:hover [data-goo="${id}"] [data-i="${i}"],.group:focus-visible [data-goo="${id}"] [data-i="${i}"]{transform:translate(${x}px,${y}px)}`).join("")}</style>
      <span className="relative">{children}</span>
    </button>
  );
}
