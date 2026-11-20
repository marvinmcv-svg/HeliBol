"use client";
import { AiVoiceCall } from "./ai-voice-call";

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-4">
      <AiVoiceCall
        className="h-[460px]"
        turns={[
          { who: "agent", text: "Hi! I'm Nova. What can I help you plan today?" },
          { who: "user", text: "Book a table for four on Friday, somewhere quiet." },
          { who: "agent", text: "Done — Lumen at 7:30, corner booth, away from the bar. Want a reminder?" },
          { who: "user", text: "Yes, an hour before please." },
        ]}
      />
    </div>
  );
}
