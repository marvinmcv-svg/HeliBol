import { notFound } from "next/navigation";
import { Browse } from "@/components/browse";
import { components } from "@/lib/registry.generated";
import { categories } from "@/lib/taxonomy";

export function generateStaticParams() {
  return categories.filter((c) => components.some((m) => m.category === c.id)).map((c) => ({ category: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return { title: categories.find((c) => c.id === category)?.name };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = categories.find((x) => x.id === category);
  if (!c) notFound();
  const items = components.filter((m) => m.category === category);
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Category</p>
        <h1 className="text-3xl font-semibold tracking-tight">{c.name}</h1>
        <p className="text-muted-foreground">{c.blurb}</p>
      </header>
      <Browse items={items} initialCategory={category} />
    </div>
  );
}
