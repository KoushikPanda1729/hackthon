import axios from "axios";
import { QuizResult } from "../../interfaces/QuizResult";

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

export const createMCQ = async (
  question: string,
  answers: { text: string; isCorrect: boolean }[],
  category: string
) => {
  try {
    const response = await axios.post("/api/v1/questions/mcqs", {
      question,
      answers,
      category,
    });

    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error creating MCQ:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};

export const editMCQ = async (
  id: string,
  question: string,
  answers: { text: string; isCorrect: boolean }[],
  category: string
) => {
  try {
    const response = await axios.put(`/api/v1/questions/mcqs/${id}`, {
      question,
      answers,
      category,
    });

    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error creating MCQ:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};

export const deleteMCQ = async (id: string) => {
  try {
    const response = await axios.delete(`/api/v1/questions/mcqs/${id}`);
    console.log("Deleted MCQ:", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error deleting MCQ:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};

export const submitQuiz = async (quizResults: QuizResult[]) => {
  try {
    const response = await axios.post(
      "/api/v1/questions/mcqs/result",
      quizResults
    );
    console.log("Quiz results submitted:", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error submitting quiz results:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};

// Fetch all attempted quizzes (dummy API example)
export const fetchAttemptedQuizzes = async () => {
  try {
    const response = await axios.get("/api/v1/questions/mcqs/all-result-admin");
    console.log("Fetched all MCQs:", response.data);
    return response.data.allReports; // Return the data from the response
    return [];
  } catch (error) {
    console.error("Error fetching MCQs:", error);
    throw error; // Throw the error to handle it in the calling function
  }
};
