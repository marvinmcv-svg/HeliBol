import { Browse } from "@/components/browse";
import { blocks } from "@/lib/registry.generated";

export const metadata = { title: "Blocks" };

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Blocks</h1>
        <p className="max-w-2xl text-muted-foreground">
          Full sections composed from kinetik components — heroes, features, pricing, auth, dashboards, checkout. Filter by Refero-style page type.
        </p>
      </header>
      <Browse items={blocks} kind="block" />
    </div>
  );
}
