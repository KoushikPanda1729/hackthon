// Submit the quiz results to the server
export interface QuizResult {
  questionId: string;
  answerId: string | null;
  timeSpent: number;
}
