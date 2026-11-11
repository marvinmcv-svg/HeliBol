"use client";
import { DataTable } from "./data-table";

type Row = { id: string; customer: string; plan: string; status: string; mrr: number };
const rows: Row[] = [
  { id: "1", customer: "Northwind", plan: "Scale", status: "Active", mrr: 1240 },
  { id: "2", customer: "Acme Corp", plan: "Pro", status: "Trial", mrr: 0 },
  { id: "3", customer: "Globex", plan: "Scale", status: "Active", mrr: 980 },
  { id: "4", customer: "Initech", plan: "Starter", status: "Past due", mrr: 49 },
  { id: "5", customer: "Umbrella", plan: "Enterprise", status: "Active", mrr: 4200 },
  { id: "6", customer: "Hooli", plan: "Pro", status: "Active", mrr: 320 },
  { id: "7", customer: "Stark Labs", plan: "Starter", status: "Canceled", mrr: 0 },
];
const tone: Record<string, string> = { Active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", Trial: "bg-sky-500/15 text-sky-600 dark:text-sky-300", "Past due": "bg-amber-500/15 text-amber-700 dark:text-amber-300", Canceled: "bg-zinc-500/15 text-muted-foreground" };

export default function Demo() {
  return (
    <div className="h-full p-5">
      <DataTable<Row>
        caption="Customers"
        rows={rows}
        searchKeys={["customer", "plan", "status"]}
        columns={[
          { key: "customer", header: "Customer" },
          { key: "plan", header: "Plan" },
          { key: "status", header: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone[r.status]}`}>{r.status}</span> },
          { key: "mrr", header: "MRR", align: "right", render: (r) => `$${r.mrr.toLocaleString()}` },
        ]}
      />
    </div>
  );
}
