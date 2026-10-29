import { Spotlight } from "./spotlight";

export default function Demo() {
  return (
    <Spotlight className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_0)] [background-size:22px_22px] p-8 text-center">
      <p className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs backdrop-blur">Move your cursor</p>
      <h2 className="max-w-md text-4xl font-semibold tracking-tight">Light follows intent.</h2>
      <p className="max-w-sm text-sm text-muted-foreground">A radial gradient driven by two CSS variables. Zero re-renders, disabled on touch.</p>
    </Spotlight>
  );
}
