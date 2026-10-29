"use client";
import { Component, lazy, Suspense, useMemo, useRef, type ComponentType, type ReactNode } from "react";
import { useInView } from "@kinetik/core";
import { demoLoaders } from "@/lib/registry.generated";

const cache = new Map<string, ComponentType>();
function getLazy(id: string) {
  if (!cache.has(id)) {
    const loader = demoLoaders[id];
    cache.set(id, lazy(loader ?? (async () => ({ default: () => <p className="p-4 text-sm">Missing demo: {id}</p> }))));
  }
  return cache.get(id)!;
}

class Boundary extends Component<{ children: ReactNode }, { error?: Error }> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return <div className="grid h-full place-items-center p-4 text-center text-xs text-muted-foreground">Preview unavailable in this browser.<br />{this.state.error.message}</div>;
    return this.props.children;
  }
}

function Spinner() {
  return (
    <div className="grid h-full w-full place-items-center">
      <span className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
    </div>
  );
}

/** Mounts a demo only once it scrolls near the viewport, so a page with 60 live previews stays fast. */
export function LazyDemo({ id, eager = false }: { id: string; eager?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { rootMargin: "200px", amount: 0 });
  const Demo = useMemo(() => getLazy(id), [id]);
  return (
    <div ref={ref} className="k-preview relative h-full w-full">
      {eager || near ? (
        <Boundary>
          <Suspense fallback={<Spinner />}>
            <Demo />
          </Suspense>
        </Boundary>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
