import { notFound } from "next/navigation";
import { blocks, components, flows } from "@/lib/registry.generated";
import { ThumbStage } from "@/components/thumb-stage";

/** Chrome-less render of one demo at 800×500, used by scripts/capture-thumbs.mjs (REA) to make gallery thumbnails. */
const all = [...components, ...blocks, ...flows];

export function generateStaticParams() {
  return all.map((m) => ({ id: m.id }));
}

export const metadata = { robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!all.some((m) => m.id === id)) notFound();
  // only zoom-to-fit components; blocks and flows are composed screens already
  return <ThumbStage id={id} fit={components.some((m) => m.id === id)} />;
}
