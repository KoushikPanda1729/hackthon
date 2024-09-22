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
} from "@mui/material";
import { CategoryEnum, QuizData } from "../QuizQuestion/QuizQuestion";
import { createMCQ, editMCQ } from "../../services/api/questionService";

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
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]); // Array for 4 answers
  const [correctAnswer, setCorrectAnswer] = useState<number>(0); // Track the correct answer
  const [category, setCategory] = useState<string>(CategoryEnum.Coding);

  useEffect(() => {
    if (editData) {
      // If editing, populate the modal with existing data
      setQuestion(editData.question);
      setAnswers(editData.answers.map((ans) => ans.text)); // Map answers to text only
      setCategory(editData.category);
      const correctIndex = editData.answers.findIndex((ans) => ans.isCorrect); // Find index of the correct answer
      setCorrectAnswer(correctIndex); // Set the correct answer index
    } else {
      // If creating new, reset the fields
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCategory(CategoryEnum.Coding);
      setCorrectAnswer(0);
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

    if (editData) {
      const response = await editMCQ(
        editData._id,
        questionData.question,
        questionData.answers,
        questionData.category
      );
      console.log("Updated question:", response);
    } else {
      const response = await createMCQ(
        questionData.question,
        questionData.answers,
        questionData.category
      );
      console.log("Created question:", response);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
        {/* Dropdown for category selection */}
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
                {cat.charAt(0).toUpperCase() + cat.slice(1)} {/* Capitalize */}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editData ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateQuestionModal;
