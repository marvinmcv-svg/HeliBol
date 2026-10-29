import { Browse } from "@/components/browse";
import { components } from "@/lib/registry.generated";

export const metadata = { title: "Components" };

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
        <p className="max-w-2xl text-muted-foreground">
          {components.length} animated components. Every one ships with a live preview, source, a one-line install and an AI prompt you can paste into Claude Code, Cursor, v0 or Lovable.
        </p>
      </header>
      <Browse items={components} />
    </div>
  );
}
