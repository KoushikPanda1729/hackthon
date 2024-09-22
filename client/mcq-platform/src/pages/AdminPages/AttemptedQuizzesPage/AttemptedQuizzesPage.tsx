import { FC, useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { fetchAttemptedQuizzes } from "../../../services/api/questionService"; // Example API service
import styles from "./AttemptedQuizzesPage.module.scss";
import { AttemptedQuiz } from "../../../interfaces/AttemptedQUiz";
import AttemptedQuizListItem from "../../../components/AttemptedQuizListItem/AttemptedQuizListItem";
import ViewAttemptedQuizModal from "../../../components/ViewAttemptedQuizModal/ViewAttemptedQuizModal";

const AttemptedQuizzesPage: FC = () => {
  const [attemptedQuizzes, setAttemptedQuizzes] = useState<AttemptedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<AttemptedQuiz | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetchAttemptedQuizzes();
      console.log(response); // Assuming an API call
      setAttemptedQuizzes(response);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to load attempted quizzes. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewModal = (data: AttemptedQuiz) => {
    setModalData(data);
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    fetchData(); // Refresh the data after closing the modal (for create or update)
  };

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
        <AttemptedQuizListItem
          key={quiz._id}
          quiz={quiz}
          onView={() => handleViewModal(quiz)}
        />
      ))}

      <ViewAttemptedQuizModal
        open={openModal}
        handleClose={handleCloseModal}
        data={modalData}
      />
    </div>
  );
};

export default AttemptedQuizzesPage;
