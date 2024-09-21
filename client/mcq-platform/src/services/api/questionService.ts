import axios from "axios";

// Fetch all MCQs from the server
export const fetchAllMcqs = async () => {
  try {
    const response = await axios.get("/api/v1/questions/mcqs");
    console.log("Fetched all MCQs:", response.data);
    return response.data.mcqs; // Return the data from the response
  } catch (error) {
    console.error("Error fetching MCQs:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};

// Submit the quiz results to the server
export interface QuizResult {
  questionId: string;
  answerId: string | null;
}

export const submitQuiz = async (quizResults: QuizResult[]) => {
  try {
    const response = await axios.post("/api/v1/mcqs/result", { quizResults });
    console.log("Quiz results submitted:", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error submitting quiz results:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};
