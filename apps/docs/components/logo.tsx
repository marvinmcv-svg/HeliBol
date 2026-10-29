import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
      <span className="relative grid size-7 place-items-center overflow-hidden rounded-lg bg-foreground text-background">
        <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:rotate-[20deg] group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M6 4v16M6 12l9-8M9.5 9.5 18 20" />
        </svg>
      </span>
      <span>kinetik</span>
    </Link>
  );
}
