import { FC } from "react";
import styles from "./ResultPage.module.scss";
import { ResultReport } from "../../../interfaces/ResultReport";

interface ResultPageProps {
  resultReport: ResultReport;
}

const ResultPage: FC<ResultPageProps> = ({ resultReport }) => (
  <div className={styles.ResultPage}>
    <div className={styles.card}>
      <h2>Quiz Completed!</h2>
      <h4>
        Thank you for completing the quiz. Your responses have been submitted.
      </h4>
      <h1>
        Total marks obtained {resultReport.obtainedMarks} out of{" "}
        {resultReport.totalMarks}
      </h1>
    </div>
  </div>
);

export default ResultPage;
