import React, { FC } from "react";
import styles from "./QuestionListItem.module.scss";
import { QuizData } from "../QuizQuestion/QuizQuestion";
import { Button } from "@mui/material";

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
      </div>
      <Button
        variant="contained"
        color="primary"
        className={styles.editButton}
        onClick={onEdit}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className={styles.deleteButton}
        onClick={onDelete} // Handle delete action
      >
        Delete
      </Button>
    </div>
  );
};
export default QuestionListItem;
