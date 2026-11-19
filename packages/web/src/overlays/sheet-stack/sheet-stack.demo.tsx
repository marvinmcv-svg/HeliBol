"use client";
import { useCallback, useState } from "react";
import { photos } from "../../_demo";
import { SheetStack } from "./sheet-stack";

const next: Record<string, string | undefined> = { Share: "Options", Options: "Advanced" };
const blurb: Record<string, string> = { Share: "Pick a person or app.", Options: "Fine-tune before sharing.", Advanced: "Advanced settings." };

export default function Demo() {
  const [stack, setStack] = useState<string[]>(["Share", "Options"]);
  const push = (title: string) => setStack((s) => [...s, title]);
  const close = useCallback((id: string) => setStack((s) => s.slice(0, Number(id))), []);
  const sheets = stack.map((title, i) => ({
    id: String(i),
    title,
    content: (
      <div className="space-y-3 text-sm">
        <p className="text-muted-foreground">{blurb[title]}</p>
        {next[title] && (
          <button onClick={() => push(next[title]!)} className="w-full rounded-xl bg-foreground py-2.5 font-medium text-background">
            Open {next[title]!.toLowerCase()} sheet
          </button>
        )}
        <p className="text-xs text-muted-foreground">Drag down or press Esc to dismiss.</p>
      </div>
    ),
  }));
  return (
    <div className="mx-auto h-full max-w-sm">
      <SheetStack sheets={sheets} onClose={close}>
        <div className="flex h-full flex-col">
          <img src={photos[4]} alt="Amber desert road" className="h-1/2 w-full object-cover" />
          <div className="space-y-3 p-5">
            <h3 className="text-xl font-semibold">Route 12, Utah</h3>
            <p className="text-sm text-muted-foreground">Golden hour on the canyon road.</p>
            <button onClick={() => setStack(["Share"])} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Share</button>
          </div>
        </div>
      </SheetStack>
    </div>
  );
}
