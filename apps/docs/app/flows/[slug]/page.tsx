import { notFound } from "next/navigation";
import { FlowStrip } from "@/components/flow-strip";
import { ItemDetail } from "@/components/item-detail";
import { flows } from "@/lib/registry.generated";

const href = (m: (typeof flows)[number]) => `/flows/${m.id}`;

export function generateStaticParams() {
  return flows.map((m) => ({ slug: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = flows.find((c) => c.id === slug);
  return m ? { title: m.name, description: m.description } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = flows.findIndex((m) => m.id === slug);
  if (i < 0) notFound();
  const meta = flows[i];
  return (
    <ItemDetail
      meta={meta}
      kind="flow"
      backHref="/flows"
      backLabel="Mobile flows"
      prev={flows[i - 1]}
      next={flows[i + 1]}
      similar={flows.filter((m) => m.id !== meta.id).slice(0, 3)}
      hrefFor={href}
      extra={
        meta.steps && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">Screens in this flow</h2>
            <FlowStrip id={meta.id} steps={meta.steps} />
          </section>
        )
      }
    />
  );
}
