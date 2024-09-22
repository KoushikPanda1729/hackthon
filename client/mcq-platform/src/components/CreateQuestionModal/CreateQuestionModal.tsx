import { FC, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { createMCQ, editMCQ } from "../../services/api/questionService";
import { CategoryEnum } from "../../enums/categoryEnum";
import { QuizData } from "../../interfaces/QuizData";
import styles from "./CreateQuestionModal.module.scss";

interface CreateQuestionModalProps {
  open: boolean;
  handleClose: () => void;
  editData?: QuizData | null;
}

const CreateQuestionModal: FC<CreateQuestionModalProps> = ({
  open,
  handleClose,
  editData,
}) => {
  const [question, setQuestion] = useState<string>("");
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [category, setCategory] = useState<string>(CategoryEnum.Coding);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  ); // Track the type of snackbar (success/error)

  const isFormValid = (): boolean => {
    return (
      question.trim() !== "" &&
      answers.every((answer) => answer.trim() !== "") && // Ensure all answers are non-empty
      category.trim() !== "" // Ensure category is selected
    );
  };

  const clearForm = () => {
    setQuestion("");
    setAnswers(["", "", "", ""]);
    setCategory(CategoryEnum.Coding);
    setCorrectAnswer(0);
  };

  useEffect(() => {
    if (editData) {
      setQuestion(editData.question);
      setAnswers(editData.answers.map((ans) => ans.text));
      setCategory(editData.category);
      const correctIndex = editData.answers.findIndex((ans) => ans.isCorrect);
      setCorrectAnswer(correctIndex);
    } else {
      clearForm();
    }
  }, [editData]);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const questionData = {
      question,
      answers: answers.map((answer, index) => ({
        text: answer,
        isCorrect: index === correctAnswer,
      })),
      category,
    };

    try {
      let response;
      if (editData) {
        response = await editMCQ(
          editData._id,
          questionData.question,
          questionData.answers,
          questionData.category
        );
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        clearForm();
      } else {
        response = await createMCQ(
          questionData.question,
          questionData.answers,
          questionData.category
        );
        setSnackbarMessage(response.message);
        setSnackbarSeverity("success");
        clearForm();
      }
      console.log(response);
      setSnackbarOpen(true);
      handleClose();
    } catch (error: any) {
      // Check if the error message indicates a duplicate question
      if (
        error.response?.data?.message ===
        "A question with this text already exists."
      ) {
        setSnackbarMessage(
          "Duplicate question found: " + error.response.data.message
        );
      } else {
        setSnackbarMessage(
          "Error: " + error.response?.data?.message || "Something went wrong."
        );
      }
      setSnackbarSeverity("error"); // Set to error in case of failure
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
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
        <DialogTitle>
          {editData ? "Edit Question" : "Create New Question"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Question"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            margin="dense"
          />

          <RadioGroup
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(Number(e.target.value))}
          >
            {answers.map((answer, index) => (
              <div key={index}>
                <TextField
                  label={`Answer ${index + 1}`}
                  fullWidth
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  margin="dense"
                />
                <FormControlLabel
                  value={index}
                  control={<Radio />}
                  label="Correct Answer"
                />
              </div>
            ))}
          </RadioGroup>

          <FormControl fullWidth margin="dense">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="Category"
            >
              {Object.values(CategoryEnum).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            sx={{
              color: "#333",
              backgroundColor: "rgba(116, 78, 78, 0.2)",
            }}
          >
            Cancel
          </Button>
          <Button
            sx={{
              color: "#fff",
              backgroundColor: "#007bff",
              "&:disabled": {
                color: "#8964644c",
                backgroundColor: "rgba(116, 78, 78, 0.251)",
              },
            }}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!isFormValid()}
          >
            {editData ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity} // Dynamic severity: success or error
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateQuestionModal;
