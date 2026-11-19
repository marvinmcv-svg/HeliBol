import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ComponentCard } from "@/components/component-card";
import { blocks, newIds } from "@/lib/registry.generated";

export const metadata = {
  title: "Templates",
  description: "Full, multi-section pages assembled from kinetik blocks — SaaS launch, AI startup and creative portfolio — each with one install command and a rebuild prompt.",
};

const templates = blocks.filter((b) => b.tags.includes("template"));

export default function Page() {
  return (
    <div className="mx-auto flex max-w-[1440px]">
      <Sidebar />
      <main className="min-w-0 flex-1 space-y-8 px-4 py-8 sm:px-8">
        <header className="space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"><Layers className="size-3.5" /> {templates.length} templates</p>
          <h1 className="text-3xl font-semibold tracking-tight">Templates</h1>
          <p className="max-w-2xl text-muted-foreground">
            Whole pages, not just sections. Each template composes kinetik blocks in a proven order, installs with every dependency in one command, and ships a prompt your agent can use to rebuild it with your copy and brand.
          </p>
        </header>
        <div className="grid gap-6 xl:grid-cols-2">
          {templates.map((t) => (
            <div key={t.id} className="space-y-3">
              <ComponentCard meta={t} href={`/blocks/${t.id}`} size="lg" isNew={newIds.includes(t.id)} />
              <p className="text-xs text-muted-foreground">Built from: {(t.registryDependencies ?? []).filter((d) => d !== "kinetik-core").join(" · ")}</p>
            </div>
          ))}
        </div>
        <Link href="/blocks" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          Or start from individual blocks <ArrowRight className="size-3.5" />
        </Link>
      </main>
    </div>
  );
}
