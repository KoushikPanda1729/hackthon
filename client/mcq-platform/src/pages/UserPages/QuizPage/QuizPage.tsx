import { FC, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import styles from "./QuizPage.module.scss";
import QuizQuestion from "../../../components/QuizQuestion/QuizQuestion";
import { fetchAllMcqs } from "../../../services/api/questionService";
import Header from "../../../components/Header/Header";
import { QuizData } from "../../../interfaces/QuizData";
import useDisableCopyPaste from "../../../hooks/useDisableCopyPaste";
import usePreventInspectElement from "../../../hooks/usePreventInspectElement";
import useFullScreenMode from "../../../hooks/useFullScreenMode";
import { shuffleQuizData } from "../../../utils/shuffleQuizData";

const QuizPage: FC = () => {
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  useDisableCopyPaste();
  usePreventInspectElement();
  const { enterFullScreen } = useFullScreenMode();

  // Fetch quiz data from the backend when the component mounts
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchAllMcqs();
        console.log("Fetched quiz data:", response);
        const shuffledQuizData = shuffleQuizData(response);
        setQuizData(shuffledQuizData); // Assuming the API response is the array of questions
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load quiz data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const startQuiz = () => {
    setIsQuizStarted(true);
    enterFullScreen();
  };

  // Render the loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  // Render error if data fetching failed
  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.QuizPage}>
      <Header />

      {!isQuizStarted ? (
        <div className={styles.startQuiz}>
          <h1 className={styles.welcomeText}>Welcome to HireLens</h1>

          <Button variant="contained" color="primary" onClick={startQuiz}>
            Start Quiz
          </Button>
        </div>
      ) : (
        <QuizQuestion quizData={quizData} />
      )}
    </div>
  );
};

export default QuizPage;
