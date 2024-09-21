import { FC } from "react";
import styles from "./ResultPage.module.scss";
import { Typography } from "@mui/material";

interface ResultPageProps {}

const ResultPage: FC<ResultPageProps> = () => (
  <div className={styles.ResultPage}>
    <Typography variant="h5">Quiz Completed!</Typography>

    <Typography variant="body1">
      Thank you for completing the quiz. Your responses have been submitted.
    </Typography>
  </div>
);

export default ResultPage;
