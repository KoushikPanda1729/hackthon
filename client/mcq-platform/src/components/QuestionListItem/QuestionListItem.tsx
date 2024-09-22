import { FC } from "react";
import styles from "./QuestionListItem.module.scss";
import { Button } from "@mui/material";
import { QuizData } from "../../interfaces/QuizData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface QuestionListItemProps {
  quizData: QuizData;
  onEdit: () => void;
  onDelete: () => void; // Add onDelete prop
}

const QuestionListItem: FC<QuestionListItemProps> = ({
  quizData,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.QuestionListItem}>
      <div className={styles.Item}>
        <h4>{quizData.question}</h4>

        <div className={styles.category}>{quizData.category}</div>
      </div>
      <Button
        variant="contained"
        color="primary"
        className={styles.editButton}
        onClick={onEdit}
        startIcon={<EditIcon />}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={styles.deleteButton}
        onClick={onDelete} // Handle delete action
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
    </div>
  );
};
export default QuestionListItem;
