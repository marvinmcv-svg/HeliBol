import { Spinner, type SpinnerVariant } from "./spinner-set";

const all: SpinnerVariant[] = ["ring", "dots", "bars", "orbit", "pulse", "wave", "square", "bounce"];

export default function Demo() {
  return (
    <div className="grid h-full w-full grid-cols-4 place-items-center gap-4 p-6">
      {all.map((v, i) => (
        <div key={v} className="flex flex-col items-center gap-3">
          <Spinner variant={v} className={["text-foreground", "text-violet-500", "text-sky-500", "text-emerald-500", "text-rose-500", "text-amber-500", "text-foreground", "text-fuchsia-500"][i]} />
          <span className="text-[11px] text-muted-foreground">{v}</span>
        </div>
      ))}
    </div>
  );
}
