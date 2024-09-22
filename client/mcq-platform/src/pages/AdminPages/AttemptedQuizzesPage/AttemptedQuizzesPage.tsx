import { FC, useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { fetchAttemptedQuizzes } from "../../../services/api/questionService"; // Example API service
import styles from "./AttemptedQuizzesPage.module.scss";
import { AttemptedQuiz } from "../../../interfaces/AttemptedQUiz";

const AttemptedQuizzesPage: FC = () => {
  const [attemptedQuizzes, setAttemptedQuizzes] = useState<AttemptedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAttemptedQuizzes(); // Assuming an API call
        setAttemptedQuizzes(response);
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load attempted quizzes. Please try again.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.AttemptedQuizzesPage}>
      <h3>Attempted Quizzes</h3>
      {attemptedQuizzes.map((quiz) => (
        <div key={quiz._id}>
          <p>
            {quiz.owner.userName} got {quiz.obtainedMarks} out of{" "}
            {quiz.totalMarks} marks
          </p>
        </div>
      ))}
    </div>
  );
};

export default AttemptedQuizzesPage;
