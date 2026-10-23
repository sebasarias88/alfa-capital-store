import type { Metadata } from "next";
import { ScentQuiz } from "@/components/store/scent-quiz";

export const metadata: Metadata = {
  alternates: { canonical: "/quiz" },
  title: "Encuentra tu aroma",
  description: "Responde 4 preguntas y descubre la fragancia perfecta para ti o para regalar.",
};

export default function QuizPage() {
  return <ScentQuiz />;
}
