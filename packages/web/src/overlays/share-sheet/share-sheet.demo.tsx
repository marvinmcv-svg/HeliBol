"use client";
import { useState } from "react";
import { AtSign, Mail, MessageCircle, Send } from "lucide-react";
import { photos } from "../../_demo";
import { ShareSheet } from "./share-sheet";

export default function Demo() {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <ShareSheet
        key={k}
        defaultOpen
        url="https://kinetik.dev/c/premium"
        title="Share collection"
        people={[{ name: "Ava", avatar: photos[0] }, { name: "Leo", avatar: photos[1] }, { name: "Noor", avatar: photos[2] }, { name: "Kai", avatar: photos[3] }]}
        targets={[
          { label: "Messages", icon: <MessageCircle className="size-5" />, color: "#22c55e" },
          { label: "Mail", icon: <Mail className="size-5" />, color: "#3b82f6" },
          { label: "Telegram", icon: <Send className="size-5" />, color: "#0ea5e9" },
          { label: "Threads", icon: <AtSign className="size-5" />, color: "#18181b" },
        ]}
      />
      <button onClick={() => setK((x) => x + 1)} className="text-xs text-muted-foreground underline underline-offset-4">Reset</button>
    </div>
  );
}
