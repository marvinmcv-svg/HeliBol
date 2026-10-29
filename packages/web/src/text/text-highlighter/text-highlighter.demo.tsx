import { TextHighlighter } from "./text-highlighter";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <p className="max-w-xl text-2xl leading-relaxed font-medium tracking-tight sm:text-3xl">
        Teams using kinetik ship <TextHighlighter delay={0.2}>twice as many</TextHighlighter> polished interactions, with{" "}
        <TextHighlighter variant="underline" color="rgb(139 92 246)" delay={0.9}>
          accessibility built in
        </TextHighlighter>{" "}
        from day one.
      </p>
    </div>
  );
}
