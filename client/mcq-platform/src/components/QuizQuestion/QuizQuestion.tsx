import { FC, useState, useEffect } from "react";
import {
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import styles from "./QuizQuestion.module.scss";
import { submitQuiz } from "../../services/api/questionService";
import ResultPage from "../../pages/UserPages/ResultPage/ResultPage";
import { QuizResult } from "../../interfaces/QuizResult";
import { QuizData } from "../../interfaces/QuizData";
import { ResultReport } from "../../interfaces/ResultReport";

interface QuizQuestionProps {
  quizData: QuizData[];
}

const QuizQuestion: FC<QuizQuestionProps> = ({ quizData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizResult[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false); // Track if the quiz is completed
  const [resultReport, setResultReport] = useState<ResultReport | null>(null); // Track the result report

  const questionTime = 10;
  const [timeLeft, setTimeLeft] = useState(questionTime); // questionTime seconds for each question

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0 && !isQuizComplete) {
      handleNextQuestion(); // Automatically move to next question when time is up
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    isQuizComplete && clearInterval(timer); // Clear the interval when the quiz is complete

    return () => clearInterval(timer); // Clear the interval when the component unmounts or the question changes
  }, [timeLeft]);

  // Reset timer and selected answer when moving to a new question
  useEffect(() => {
    if (currentQuestion < quizData.length && !isQuizComplete) {
      setTimeLeft(questionTime);
      setSelectedAnswer(null); // Clear the selected answer for the new question
    }
  }, [currentQuestion, isQuizComplete]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = async () => {
    // Include the current question and selected answer in the answers array
    const updatedAnswers: QuizResult[] = [
      ...answers,
      {
        questionId: quizData[currentQuestion]._id,
        answerId: selectedAnswer,
        timeSpent: questionTime - timeLeft,
      },
    ];

    setAnswers(updatedAnswers); // Update the answers state

    // Check if it's the last question
    if (currentQuestion < quizData.length - 1) {
      // Move to the next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // End the quiz and submit answers
      setIsQuizComplete(true);
      const marksData = await submitQuiz(updatedAnswers);
      setResultReport(marksData.data); // Submit the updated answers array
      console.log("Quiz submitted", marksData);
    }
  };

  // Return ResultPage after quiz completion
  if (isQuizComplete && resultReport) {
    return <ResultPage resultReport={resultReport} />;
  }

  const timeLeftPercentage = (timeLeft / questionTime) * 100;

  return (
    <div className={styles.QuizQuestion}>
      <Typography variant="h6" className={styles.questionText}>
        {quizData[currentQuestion].question}
      </Typography>

      <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
        {quizData[currentQuestion].answers.map((answer) => (
          <FormControlLabel
            key={answer._id}
            value={answer._id}
            control={<Radio sx={{ color: "#e2dfd0" }} />}
            label={answer.text}
          />
        ))}
      </RadioGroup>

      <div className={styles.cardFooter}>
        <Box position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={timeLeftPercentage} // The progress value is calculated from the time left
            size={50} // Size of the circle
            thickness={8} // Thickness of the circular progress bar
            sx={{
              color: timeLeft > 3 ? "#f97300" : "#FF0000", // Use custom hex colors
            }}
          />
          <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="caption" component="div">
              {timeLeft}s
            </Typography>
          </Box>
        </Box>

        {currentQuestion === quizData.length - 1 ? (
          <Button
            className={styles.nextButton}
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            className={styles.nextButton}
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
