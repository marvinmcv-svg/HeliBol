"use client";
import { photos } from "../../_demo";
import { CommentThread } from "./comment-thread";

export default function Demo() {
  return (
    <div className="mx-auto h-full max-w-lg overflow-y-auto p-6">
      <CommentThread
        comments={[
          { id: "1", author: "Ava Chen", avatar: photos[0], time: "2h", likes: 24, body: "The spring on the save button is perfect — it feels like a real object.", replies: [{ id: "1a", author: "Leo Martins", avatar: photos[1], time: "1h", likes: 6, body: "Agreed. 500 stiffness, 15 damping — I checked." }] },
          { id: "2", author: "Noor Haddad", avatar: photos[2], time: "45m", likes: 9, body: "Could the reduced-motion version keep the colour change? It still reads as feedback." },
        ]}
      />
    </div>
  );
}
