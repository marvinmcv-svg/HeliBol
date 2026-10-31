import { CardShine } from "./card-shine";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center gap-5 p-8">
      {[["Starter", "$9", "from-zinc-700 to-zinc-900"], ["Gold", "$29", "from-amber-400 to-orange-600"], ["Platinum", "$99", "from-slate-300 to-slate-500"]].map(([n, p, g]) => (
        <CardShine key={n} className={`h-48 w-40 bg-gradient-to-br ${g} p-4 text-white shadow-xl`}>
          <p className="text-xs opacity-80">{n}</p><p className="mt-auto pt-20 text-3xl font-bold">{p}</p>
        </CardShine>
      ))}
    </div>
  );
}
