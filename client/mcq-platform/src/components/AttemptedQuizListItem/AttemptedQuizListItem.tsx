import React, { FC } from "react";
import styles from "./AttemptedQuizListItem.module.scss";
import { AttemptedQuiz } from "../../interfaces/AttemptedQUiz";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface AttemptedQuizListItemProps {
  quiz: AttemptedQuiz;
  onView: () => void;
}

const AttemptedQuizListItem: FC<AttemptedQuizListItemProps> = ({
  quiz,
  onView,
}) => (
  <div className={styles.AttemptedQuizListItem}>
    <div className={styles.Item}>
      <h4>{quiz.owner.userName}</h4>

      <div className={styles.category}>
        {quiz.obtainedMarks} out of {quiz.totalMarks}
      </div>
    </div>
    <Button
      className={styles.viewButton}
      variant="contained"
      color="primary"
      onClick={onView}
      startIcon={<VisibilityIcon />} // Add the eye icon here
    >
      View
    </Button>
    {/* <Button
      variant="contained"
      color="secondary"
      className={styles.deleteButton}
      onClick={onDelete} // Handle delete action
    >
      Delete
    </Button> */}
  </div>
);

export default AttemptedQuizListItem;
