import { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
 // Import the AttemptedQuiz interface
import styles from "./ViewAttemptedQuizModal.module.scss";
import { AttemptedQuiz } from "../../interfaces/AttemptedQUiz";

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
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>View Attempted Quiz</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Quiz Candidate: {data.owner.userName}</Typography>
        <Typography variant="body1">Email: {data.owner.email}</Typography>
        <Typography variant="body1">
          Obtained Marks: {data.obtainedMarks} / {data.totalMarks}
        </Typography>

        <Typography variant="h6" className={styles.sectionTitle}>
          Quiz Results:
        </Typography>
        <List>
          {data.results.map((result) => (
            <ListItem key={result._id} className={styles.listItem}>
              <ListItemText
                primary={result.question}
                secondary={
                  <>
                    <Typography>
                      <strong>User's Answer:</strong>{" "}
                      {result.userAnswerText.text}
                      {result.isCorrect ? " ✅" : " ❌"}
                    </Typography>
                    <Typography>
                      <strong>Correct Answer:</strong>{" "}
                      {result.correctAnswerText.text}
                    </Typography>
                    <Typography>
                      <strong>Time Spent:</strong> {result.timeSpent} seconds
                    </Typography>
                  </>
                }
              />
            </ListItem>
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
