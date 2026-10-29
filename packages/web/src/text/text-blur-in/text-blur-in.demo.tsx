"use client";
import { TextBlurIn } from "./text-blur-in";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
      <TextBlurIn as="h2" className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Quietly, then all at once.
      </TextBlurIn>
      <TextBlurIn by="chars" delay={0.6} className="text-sm text-muted-foreground">
        Words drift out of focus into place.
      </TextBlurIn>
    </div>
  );
}
