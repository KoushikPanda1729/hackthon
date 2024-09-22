import { FC } from "react";
import styles from "./ResultPage.module.scss";
import { Typography } from "@mui/material";

interface ResultPageProps {}

const ResultPage: FC<ResultPageProps> = () => (
  <div className={styles.ResultPage}>
    <h4>Quiz Completed!</h4>

    <h6>
      Thank you for completing the quiz. Your responses have been submitted.
    </h6>
  </div>
);

export default ResultPage;
