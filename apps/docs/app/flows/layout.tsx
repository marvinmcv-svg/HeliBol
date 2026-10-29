import { Sidebar } from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1440px]">
      <Sidebar />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
    </div>
  );
}
