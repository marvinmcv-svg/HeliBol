"use client";
import { AccordionSmooth } from "./accordion-smooth";

export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <AccordionSmooth
        className="w-full max-w-md"
        defaultOpen={["1"]}
        items={[
          { id: "1", title: "Is kinetik free?", content: "Yes. Every component is MIT-licensed source code that lives in your repo." },
          { id: "2", title: "Does it work with React Native?", content: "Mobile flows ship with Reanimated 4 prompts and share the same motion tokens as web." },
          { id: "3", title: "What about reduced motion?", content: "Every component has a tested fallback — try the Reduce motion toggle in the toolbar." },
          { id: "4", title: "Can my AI agent install it?", content: "Copy the AI prompt or point your agent at the registry JSON." },
        ]}
      />
    </div>
  );
}
