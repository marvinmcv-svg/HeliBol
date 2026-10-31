"use client";
import { AiChatStream } from "./ai-chat-stream";
export default function Demo() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="h-full max-h-[380px] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card">
        <AiChatStream
          className="h-full"
          script={[
            { role: "user", text: "Can you add a spring to the pricing toggle?" },
            { role: "assistant", text: "Done — I used the snappy preset (stiffness 500, damping 35) so the indicator settles in about 180ms without overshoot." },
            { role: "user", text: "And on mobile?" },
            { role: "assistant", text: "Same numbers in Reanimated: withSpring(x, { stiffness: 500, damping: 35 }). It will feel identical on iOS and Android." },
          ]}
        />
      </div>
    </div>
  );
}
