import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Divider,
} from "@mui/material";
// Import the AttemptedQuiz interface
import styles from "./ViewAttemptedQuizModal.module.scss";
import { AttemptedQuiz } from "../../interfaces/AttemptedQUiz";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";

interface ViewAttemptedQuizModalProps {
  open: boolean;
  handleClose: () => void;
  data: AttemptedQuiz | null; // Data for the selected quiz
}

const ViewAttemptedQuizModal: FC<ViewAttemptedQuizModalProps> = ({
  open,
  handleClose,
  data,
}) => {
  if (!data) return null; // If no data is passed, return nothing

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl" // Increase the max width of the dialog
      fullWidth // Ensures it takes the full width available based on maxWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "50%", // Customize the width of the dialog (optional)
          maxWidth: "none", // Disable max-width limits
        },
        "& .MuiDialogTitle-root": {
          backgroundColor: "#f5f5f5",
          color: "#333",
          fontWeight: "bold",
        },
        "& .MuiDialogContent-root": {
          padding: "24px",
          backgroundColor: "#fafafa",
        },
        "& .MuiDialogActions-root": {
          padding: "16px 24px",
          backgroundColor: "#fafafa",
          justifyContent: "space-between",
        },
        "& .MuiButton-root": {
          borderRadius: "4px",
        },
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#fff",
          borderRadius: "4px",
        },
        "& .MuiFormControl-root": {
          marginBottom: "16px",
        },
      }}
    >
      <DialogTitle>View Attempted Quiz</DialogTitle>
      <DialogContent dividers>
        <div className={styles.header}>
          <h2>Quiz Candidate: {data.owner.userName}</h2>
          <h4>Email: {data.owner.email}</h4>
          <h4>
            Obtained Marks: {data.obtainedMarks} / {data.totalMarks}
          </h4>
          <h4>Quiz Candidate: {data.owner.userName}</h4>
        </div>

        <h3>Quiz Results:</h3>

        <List>
          {data.results.map((result, index) => (
            <div key={result._id}>
              <ListItem className={styles.listItem}>
                <div className={styles.questionRow}>
                  <div className={styles.questionWrap}>
                    <h4>
                      {index + 1}. {result.question}
                    </h4>
                    <div className={styles.answerRow}>
                      <div className={styles.userAnswer}>
                        <strong>User's Answer:</strong>{" "}
                        <span
                          style={
                            result.isCorrect
                              ? { color: "green" }
                              : { color: "red" }
                          }
                        >
                          {result.userAnswerText.text}
                        </span>
                      </div>
                      <div className={styles.correctAnswer}>
                        <strong>Correct Answer:</strong>{" "}
                        <span>{result.correctAnswerText.text}</span>
                      </div>
                      <div className={styles.timeSpent}>
                        <strong>Time Spent:</strong> {result.timeSpent} seconds
                      </div>
                    </div>
                  </div>
                  <div className={styles.IconWrap}>
                    {result.isCorrect ? (
                      <CheckCircleOutline className={styles.correctIcon} />
                    ) : (
                      <CancelOutlined className={styles.wrongIcon} />
                    )}
                  </div>
                </div>
              </ListItem>
              {index < data.results.length - 1 && (
                <Divider className={styles.divider} />
              )}
            </div>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAttemptedQuizModal;
