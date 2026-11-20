"use client";
import { Clock, GitMerge, Layers, Send } from "lucide-react";
import { DemoCenter } from "../../_demo";
import { ButtonSplitAction } from "./button-split-action";

export default function Demo() {
  return (
    <DemoCenter className="items-start pt-24">
      <ButtonSplitAction
        options={[
          { id: "merge", label: "Merge pull request", hint: "All commits added to main", icon: <GitMerge className="size-4" /> },
          { id: "squash", label: "Squash and merge", hint: "One commit on main", icon: <Layers className="size-4" /> },
          { id: "schedule", label: "Merge at 6 pm", hint: "Queue for the evening deploy", icon: <Clock className="size-4" /> },
          { id: "review", label: "Request review", hint: "Ping two reviewers", icon: <Send className="size-4" /> },
        ]}
      />
    </DemoCenter>
  );
}
