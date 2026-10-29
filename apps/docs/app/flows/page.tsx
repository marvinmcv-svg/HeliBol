import { Browse } from "@/components/browse";
import { flows } from "@/lib/registry.generated";

export const metadata = { title: "Mobile flows" };

export default function Page() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Mobile flows</h1>
        <p className="max-w-2xl text-muted-foreground">
          Mobbin-style end-to-end mobile flows — onboarding, paywall, auth, checkout, habits, settings. Each is a live, interactive prototype with a
          prompt that rebuilds it natively in Expo with Reanimated 4, Gesture Handler and haptics.
        </p>
      </header>
      <Browse items={flows} kind="flow" />
    </div>
  );
}
