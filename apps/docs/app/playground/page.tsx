import { Playground } from "@/components/playground";

export const metadata = { title: "Motion playground", description: "Visualize kinetik easings and springs, tune them and copy as CSS, Motion, GSAP or Reanimated." };

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Motion playground</h1>
        <p className="max-w-2xl text-muted-foreground">Feel the token system. Pick an easing or tune a spring, watch it run, and copy the exact values for CSS, Motion, GSAP or Reanimated.</p>
      </header>
      <Playground />
    </main>
  );
}
