import { notFound } from "next/navigation";
import { ItemDetail } from "@/components/item-detail";
import { blocks } from "@/lib/registry.generated";

const href = (m: (typeof blocks)[number]) => `/blocks/${m.id}`;

export function generateStaticParams() {
  return blocks.map((m) => ({ slug: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = blocks.find((c) => c.id === slug);
  return m ? { title: m.name, description: m.description } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = blocks.findIndex((m) => m.id === slug);
  if (i < 0) notFound();
  const meta = blocks[i];
  const similar = blocks.filter((m) => m.id !== meta.id && m.pageTypes.some((p) => meta.pageTypes.includes(p))).slice(0, 2);
  return <ItemDetail meta={meta} kind="block" backHref="/blocks" backLabel="Blocks" prev={blocks[i - 1]} next={blocks[i + 1]} similar={similar} hrefFor={href} />;
}
