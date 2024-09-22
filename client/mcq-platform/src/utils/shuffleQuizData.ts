import { QuizData } from "../interfaces/QuizData";

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array]; // Create a copy to avoid modifying the original array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
  }
  return shuffledArray;
};

export const shuffleQuizData = (quizData: QuizData[]): QuizData[] => {
  // Shuffle the questions first
  const shuffledQuestions = shuffleArray(quizData);

  // Now shuffle the answers for each question
  const shuffledQuestionsWithShuffledAnswers = shuffledQuestions.map(
    (question) => ({
      ...question,
      answers: shuffleArray(question.answers), // Shuffle the answers for each question
    })
  );

  return shuffledQuestionsWithShuffledAnswers;
};