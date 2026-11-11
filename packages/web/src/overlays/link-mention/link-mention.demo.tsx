"use client";
import { photos } from "../../_demo";
import { LinkMention } from "./link-mention";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-8">
      <p className="max-w-md text-lg leading-loose text-muted-foreground">
        The new onboarding spec lives in{" "}
        <LinkMention href="https://example.com/specs/onboarding" icon="📄" title="Onboarding v3 — spec" description="Goals, flows and motion notes for the redesigned first-run experience." image={photos[5]}>
          Onboarding v3
        </LinkMention>{" "}
        and the research is summarised in{" "}
        <LinkMention href="https://example.com/research" icon={<span className="rounded bg-violet-500 px-0.5 text-white">R</span>} title="Research digest" description="Twelve interviews, three themes.">
          Research digest
        </LinkMention>
        .
      </p>
    </div>
  );
}
