import React, { FC, useEffect } from "react";
import styles from "./QuestionListItem.module.scss";
import { QuizData } from "../QuizQuestion/QuizQuestion";

interface QuestionListItemProps {
  quizData: QuizData;
}

const QuestionListItem: FC<QuestionListItemProps> = ({ quizData }) => {
  return (
    <div className={styles.QuestionListItem}>
      <h3>{quizData.question}</h3>
    </div>
  );
};
export default QuestionListItem;
