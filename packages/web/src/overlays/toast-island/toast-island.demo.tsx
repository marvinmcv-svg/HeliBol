"use client";
import { useEffect } from "react";
import { ToastIsland, useIsland } from "./toast-island";

function Buttons() {
  const island = useIsland();
  const save = () => island.promise(new Promise((r) => setTimeout(r, 1400)), { loading: "Saving changes…", success: "Saved", error: "Couldn't save", detail: "Synced to 3 devices" }).catch(() => {});
  const fail = () => island.promise(new Promise((_, j) => setTimeout(() => j(new Error("You're offline")), 1200)), { loading: "Uploading…", success: "Uploaded", error: "Upload failed" }).catch(() => {});
  useEffect(() => {
    save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex h-full items-center justify-center gap-3">
      <button onClick={save} className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background">Save</button>
      <button onClick={fail} className="rounded-xl border border-border px-4 py-2 text-sm">Upload offline</button>
      <button onClick={() => island.show("success", "Link copied")} className="rounded-xl border border-border px-4 py-2 text-sm">Copy link</button>
    </div>
  );
}

export default function Demo() {
  return (
    <ToastIsland className="h-full">
      <Buttons />
    </ToastIsland>
  );
}
