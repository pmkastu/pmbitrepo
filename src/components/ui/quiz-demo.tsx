import React from "react";
import { QuizSection } from "./quiz-section";
import { type Bite } from "@/data/bites";

// sample bite data for demonstration
const sampleBite: Bite = {
  id: 999,
  type: "quiz",
  content: "Which gas do plants absorb from the atmosphere?",
  options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
  answer: "Carbon Dioxide",
  tags: [],
};

export default function QuizDemo() {
  return (
    <div className="p-8">
      <QuizSection bite={sampleBite} />
    </div>
  );
}
