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

export interface Answer {
  text: string;
  isCorrect: boolean;
  _id: string;
}

export interface QuizData {
  _id: string;
  question: string;
  answers: Answer[];
}

interface QuizQuestionProps {
  quizData: QuizData[];
}

const QuizQuestion: FC<QuizQuestionProps> = ({ quizData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    { questionId: string; answerId: string | null }[]
  >([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false); // Track if the quiz is completed

  const questionTime = 10;
  const [timeLeft, setTimeLeft] = useState(questionTime); // questionTime seconds for each question

  // Timer logic
  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Clear the interval when the component unmounts or the question changes
  }, [timeLeft]);

  // Reset timer and selected answer when moving to a new question
  useEffect(() => {
    if (currentQuestion < quizData.length) {
      setTimeLeft(questionTime);
      setSelectedAnswer(null); // Clear the selected answer for the new question
    }
  }, [currentQuestion]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        questionId: quizData[currentQuestion]._id,
        answerId: selectedAnswer,
      },
    ]);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      console.log("Quiz submitted", answers);
    } else {
      setIsQuizComplete(true);
      submitQuiz(answers);
      console.log("Quiz submitted", answers);
    }
  };

  if (isQuizComplete) {
    return <ResultPage />;
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
