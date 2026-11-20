import { DemoCenter } from "../../_demo";
import { Button3DKey } from "./button-3d-key";

export default function Demo() {
  return (
    <DemoCenter className="flex-col gap-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button3DKey>Play now</Button3DKey>
        <Button3DKey color="#22c55e">Continue</Button3DKey>
        <Button3DKey color="#3b82f6" depth={6} className="h-12 text-sm [&_.kn-key-cap]:px-5">Skip</Button3DKey>
      </div>
      <div className="flex gap-2">
        {["⌘", "K"].map((k) => <Button3DKey key={k} color="#27272a" depth={5} className="size-12 text-lg [&_.kn-key-cap]:px-0">{k}</Button3DKey>)}
      </div>
      <p className="text-xs text-muted-foreground">Hover to lift · press to sink</p>
    </DemoCenter>
  );
}
