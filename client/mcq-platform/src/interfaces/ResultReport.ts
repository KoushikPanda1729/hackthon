import { Answer } from "./Answer";

// Submit the quiz results to the server
export interface ResultReport {
  obtainedMarks: number;
  totalMarks: number;
  results: ObtainedQuizResult[];
}

export interface ObtainedQuizResult {
  questionId: string;
  question: string;
  userAnswerText: Answer;
  correctAnswerText: Answer;
  isCorrect: boolean;
  timeSpent: number;
}
