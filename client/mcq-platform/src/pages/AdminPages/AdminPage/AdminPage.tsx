import { FC, useEffect, useState } from "react";
import styles from "./AdminPage.module.scss";
import { Button, CircularProgress } from "@mui/material";
import Header from "../../../components/Header/Header";
import QuestionListItem from "../../../components/QuestionListItem/QuestionListItem";
import { QuizData } from "../../../components/QuizQuestion/QuizQuestion";
import { fetchAllMcqs } from "../../../services/api/questionService";

interface AdminPageProps {}

const AdminPage: FC<AdminPageProps> = () => {
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchAllMcqs();
        console.log("Fetched quiz data:", response);
        setQuizData(response); // Assuming the API response is the array of questions
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load quiz data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, []);
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
    <div className={styles.AdminPage}>
      <Header isAdminPage={true} />
      <div className={styles.adminBox}>
        <Button>Create New Question</Button>
        {/* <form>
        <div>
          <label htmlFor="question">Question</label>
          <input type="text" id="question" name="question" />
        </div>
        <div>
          <label htmlFor="answers">Answers</label>
          <input type="text" id="answers" name="answers" />
        </div>
        <div>
          <label htmlFor="category">Category</label>
          <input type="text" id="category" name="category" />
        </div>
        <button type="submit">Submit</button>
      </form> */}
        {quizData.map((item) => (
          <QuestionListItem quizData={item} />
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
