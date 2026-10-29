import Link from "next/link";
import { Accessibility, ArrowLeft, ArrowRight, Gauge } from "lucide-react";
import type { ComponentMeta } from "@web/types";
import { getContent, installCommand } from "@/lib/content";
import { highlight } from "@/lib/highlight";
import { categoryName, pageTypes } from "@/lib/taxonomy";
import { CodeTabs } from "./code-tabs";
import { CopyButton } from "./copy-button";
import { EngineBadge } from "./engine-badge";
import { PreviewFrame } from "./preview-frame";
import { ComponentCard } from "./component-card";

export async function ItemDetail({
  meta,
  kind,
  backHref,
  backLabel,
  prev,
  next,
  similar,
  hrefFor,
  extra,
}: {
  meta: ComponentMeta;
  kind: "component" | "block" | "flow";
  backHref: string;
  backLabel: string;
  prev?: ComponentMeta;
  next?: ComponentMeta;
  similar: ComponentMeta[];
  hrefFor: (m: ComponentMeta) => string;
  extra?: React.ReactNode;
}) {
  const content = getContent(meta.id);
  const install = installCommand(meta.id);
  const [sourceHtml, demoHtml, promptHtml, installHtml] = await Promise.all([
    highlight(content.source),
    highlight(content.demo),
    highlight(content.prompt, "markdown"),
    highlight(`${install}\n\n# or install dependencies manually\nnpm i ${meta.dependencies.join(" ") || "# (none — CSS only)"}`, "bash"),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-4">
        <Link href={backHref} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3" /> {backLabel}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <EngineBadge engine={meta.engine} />
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{meta.priority}</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{meta.platforms.join(" + ")}</span>
              {meta.status !== "stable" && <span className="rounded-md bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">{meta.status}</span>}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{meta.name}</h1>
            <p className="text-muted-foreground">{meta.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton
              text={content.prompt}
              label="Copy AI prompt"
              icon="sparkles"
              className="h-9 rounded-xl bg-foreground px-3.5 text-sm text-background hover:bg-foreground/90 hover:text-background"
            />
            <CopyButton text={install} label="Copy install" icon="terminal" className="h-9 rounded-xl border border-border px-3.5 text-sm" />
          </div>
        </div>
      </div>

      <PreviewFrame id={meta.id} height={meta.previewHeight ?? 380} />

      {extra}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Installation</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card text-[13px] [&_pre]:overflow-x-auto [&_pre]:p-4" dangerouslySetInnerHTML={{ __html: installHtml }} />
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">Code</h2>
          <span className="text-xs text-muted-foreground">{content.path} · {content.lines} lines</span>
        </div>
        <CodeTabs
          tabs={[
            { id: "source", label: kind === "component" ? `${meta.id}.tsx` : "Source", html: sourceHtml, raw: content.source },
            { id: "usage", label: "Usage", html: demoHtml, raw: content.demo },
            { id: "prompt", label: "✦ AI prompt", html: promptHtml, raw: content.prompt },
          ]}
        />
        <p className="text-xs text-muted-foreground">
          The AI prompt bundles intent, constraints, full source and helpers — paste it into Claude Code, Cursor, v0, Bolt or Lovable to rebuild this in any project.
        </p>
      </section>

      {meta.props && meta.props.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Props</h2>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Prop</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Default</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {meta.props.map((p) => (
                  <tr key={p.name} className="align-top">
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold">{p.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-brand">{p.type}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.default ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><Accessibility className="size-4 text-brand" /> Accessibility</h3>
          <p className="mt-2 text-sm text-muted-foreground">{meta.a11y}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold"><Gauge className="size-4 text-brand" /> Performance</h3>
          <p className="mt-2 text-sm text-muted-foreground">{meta.perf}</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div>
          <p className="mb-1.5 text-xs text-muted-foreground">Category</p>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">{categoryName(meta.category)}</span>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-muted-foreground">Page types</p>
          <div className="flex flex-wrap gap-1">{meta.pageTypes.map((p) => <span key={p} className="rounded-full border border-border px-2.5 py-0.5 text-xs">{pageTypes[p]}</span>)}</div>
        </div>
        <div>
          <p className="mb-1.5 text-xs text-muted-foreground">Tags</p>
          <div className="flex flex-wrap gap-1">{meta.tags.map((t) => <span key={t} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">#{t}</span>)}</div>
        </div>
        {meta.inspiration && (
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Inspired by</p>
            <p className="text-xs text-muted-foreground">{meta.inspiration.join(" · ")}</p>
          </div>
        )}
      </section>

      {similar.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Similar</h2>
          <div className={kind === "block" ? "grid gap-4 lg:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
            {similar.map((m) => <ComponentCard key={m.id} meta={m} href={hrefFor(m)} size={kind === "flow" ? "phone" : kind === "block" ? "lg" : "md"} />)}
          </div>
        </section>
      )}

      <nav className="flex justify-between gap-4 border-t border-border pt-6 text-sm">
        {prev ? (
          <Link href={hrefFor(prev)} className="group flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Previous</span>
            <span className="flex items-center gap-1 font-medium"><ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />{prev.name}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={hrefFor(next)} className="group flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Next</span>
            <span className="flex items-center gap-1 font-medium">{next.name}<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        )}
      </nav>
    </div>
  );
}
