"use client";
import { useState } from "react";
import { DemoCenter } from "../../_demo";
import { PaginationAnimated } from "./pagination-animated";

export default function Demo() {
  const [page, setPage] = useState(4);
  return (
    <DemoCenter className="flex-col">
      <PaginationAnimated page={page} total={20} onChange={setPage} />
      <p className="text-xs text-muted-foreground" aria-live="polite">Showing results {(page - 1) * 10 + 1}–{page * 10} of 200</p>
    </DemoCenter>
  );
}
