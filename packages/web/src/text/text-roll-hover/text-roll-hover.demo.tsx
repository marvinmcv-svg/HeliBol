import { TextRollHover } from "./text-roll-hover";

export default function Demo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-8">
      {(["start", "center", "end"] as const).map((f, i) => (
        <a key={f} href="#" className="text-5xl font-semibold tracking-tight uppercase outline-none focus-visible:underline">
          <TextRollHover from={f} className={i === 1 ? "text-brand" : undefined}>{["Work", "Studio", "Contact"][i]}</TextRollHover>
        </a>
      ))}
    </div>
  );
}
