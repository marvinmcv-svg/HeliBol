"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Heart, Search } from "lucide-react";
import { cn } from "@kinetik/core";
import { spring } from "@kinetik/tokens";
import { ThemeToggle } from "@web/buttons/theme-toggle/theme-toggle";
import { Logo } from "./logo";
import { ReduceMotionToggle } from "./reduce-motion-toggle";
import { openCommandMenu } from "./command-menu";
import { useSaved } from "@/lib/saved";

const nav = [
  { href: "/components", label: "Components" },
  { href: "/premium", label: "✦ Premium" },
  { href: "/blocks", label: "Blocks" },
  { href: "/templates", label: "Templates" },
  { href: "/flows", label: "Flows" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const saved = useSaved().length;
  if (pathname.startsWith("/thumb/")) return null;
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={cn("relative rounded-lg px-3 py-1.5 text-sm transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                {active && <motion.span layoutId="nav-pill" transition={spring.snappy} className="absolute inset-0 -z-10 rounded-lg bg-accent" />}
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={openCommandMenu}
            className="mr-1 hidden h-8 w-56 items-center gap-2 rounded-lg border border-border bg-muted/50 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex"
          >
            <Search className="size-3.5" />
            Search components…
            <kbd className="ml-auto rounded border border-border bg-background px-1.5 font-mono text-[10px]">⌘K</kbd>
          </button>
          <button type="button" onClick={openCommandMenu} aria-label="Search" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent sm:hidden">
            <Search className="size-4" />
          </button>
          <Link href="/saved" aria-label={`Saved${saved ? ` (${saved})` : ""}`} className="relative grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
            <Heart className={cn("size-4", saved > 0 && "fill-rose-500 text-rose-500")} />
            {saved > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white tabular-nums">{saved}</span>}
          </Link>
          <ReduceMotionToggle />
          <ThemeToggle className="size-8" />
          <a href="https://github.com/marvinmcv-svg/HeliBol" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="GitHub">
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
          </a>
        </div>
      </div>
      <nav className="scrollbar-thin flex gap-1 overflow-x-auto border-t border-border/60 px-4 py-1.5 md:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={cn("shrink-0 rounded-md px-2.5 py-1 text-sm", pathname.startsWith(n.href) ? "bg-accent text-foreground" : "text-muted-foreground")}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
