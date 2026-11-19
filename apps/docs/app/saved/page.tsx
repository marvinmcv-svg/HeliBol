import { SavedView } from "./saved-view";

export const metadata = { title: "Saved", description: "Your saved kinetik components, blocks and flows." };

export default function Page() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-10 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Saved</h1>
        <p className="max-w-2xl text-muted-foreground">Your collection — components, blocks and flows you hearted. Install them all at once or come back to them later.</p>
      </header>
      <SavedView />
    </div>
  );
}
