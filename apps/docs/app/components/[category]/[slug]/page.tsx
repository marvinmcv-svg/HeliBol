import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/item-detail";
import { components } from "@/lib/registry.generated";
import { categories, categoryName } from "@/lib/taxonomy";

const order = categories.flatMap((c) => components.filter((m) => m.category === c.id));
const href = (m: (typeof components)[number]) => `/components/${m.category}/${m.id}`;

export function generateStaticParams() {
  return components.map((m) => ({ category: m.category, slug: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = components.find((c) => c.id === slug);
  return m ? { title: m.name, description: m.description } : {};
}

export default async function Page({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params;
  const i = order.findIndex((m) => m.id === slug);
  if (i < 0) notFound();
  const meta = order[i];
  const similar = components
    .filter((m) => m.id !== meta.id)
    .map((m) => ({ m, s: (m.category === meta.category ? 3 : 0) + m.tags.filter((t) => meta.tags.includes(t)).length + (m.engine === meta.engine ? 1 : 0) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 3)
    .map((x) => x.m);
  return (
    <ItemDetail
      meta={meta}
      kind="component"
      backHref={`/components/${meta.category}`}
      backLabel={categoryName(meta.category)}
      prev={order[i - 1]}
      next={order[i + 1]}
      similar={similar}
      hrefFor={href}
    />
  );
}
