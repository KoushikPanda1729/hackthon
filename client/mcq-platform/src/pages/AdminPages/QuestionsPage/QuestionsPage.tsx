import { FC, useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import QuestionListItem from "../../../components/QuestionListItem/QuestionListItem";
import { fetchAllMcqs, deleteMCQ } from "../../../services/api/questionService";
import styles from "./QuestionsPage.module.scss";
import CreateQuestionModal from "../../../components/CreateQuestionModal/CreateQuestionModal";
import { QuizData } from "../../../interfaces/QuizData";

const QuestionsPage: FC = () => {
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<QuizData | null>(null); // Track which question is being edited

  const fetchQuizData = async () => {
    try {
      const response = await fetchAllMcqs();
      setQuizData(response); // Assuming the API response is the array of questions
      setIsLoading(false);
    } catch (error) {
      setError("Failed to load quiz data. Please try again.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData(); // Fetch data when the component loads
  }, []);

  const handleOpenCreateModal = () => {
    setEditData(null); // Clear the edit data for creating a new question
    setOpenModal(true); // Open the modal
  };

  const handleOpenEditModal = (data: QuizData) => {
    setEditData(data); // Set the question data to be edited
    setOpenModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    fetchQuizData(); // Refresh the data after closing the modal (for create or update)
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMCQ(id); // API call to delete MCQ
      fetchQuizData(); // Refresh the list after deletion
    } catch (error) {
      setError("Failed to delete the question. Please try again.");
    }
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
    <div className={styles.QuestionsPage}>
      <Button
        variant="contained"
        className={styles.createButton}
        onClick={handleOpenCreateModal} // Open modal for creating a new question
      >
        Create New Question
      </Button>
      {quizData.map((item) => (
        <QuestionListItem
          key={item._id}
          quizData={item}
          onEdit={() => handleOpenEditModal(item)} // Pass the data to the modal for editing
          onDelete={() => handleDelete(item._id)} // Pass the delete handler
        />
      ))}

      {/* Modal for creating/editing question */}
      <CreateQuestionModal
        open={openModal}
        handleClose={handleCloseModal}
        editData={editData} // Pass edit data if available
      />
    </div>
  );
};

export default QuestionsPage;
