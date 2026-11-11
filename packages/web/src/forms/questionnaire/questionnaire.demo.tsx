"use client";
import { Questionnaire, type Question } from "./questionnaire";

const questions: Question[] = [
  { id: "role", title: "What best describes you?", options: ["Designer", "Engineer", "Founder", "Student"] },
  { id: "goals", title: "What do you want to build?", hint: "Pick all that apply.", multiple: true, options: ["Marketing site", "Product UI", "Mobile app", "Portfolio"] },
  { id: "team", title: "How big is your team?", options: ["Just me", "2–10", "11–50", "50+"] },
];

export default function Demo() {
  return (
    <div className="grid h-full place-items-center p-8">
      <Questionnaire questions={questions} />
    </div>
  );
}
