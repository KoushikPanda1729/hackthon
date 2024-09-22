import { Answer } from "./Answer";

export interface AttemptedQuiz {
  _id: string;
  owner: QuizOwner;
  obtainedMarks: number;
  totalMarks: number;
  results: QuizResult[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface QuizOwner {
  _id: string;
  userName: string;
  email: string;
}

 interface QuizResult {
  _id: string;
  questionId: string;
  question: string;
  userAnswerText: Answer;
  correctAnswerText: Answer;
  isCorrect: boolean;
  timeSpent: number;
}
