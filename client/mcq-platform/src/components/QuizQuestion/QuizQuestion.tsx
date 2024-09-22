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
  onQuizComplete: () => void; // New prop for handling quiz completion
}

const QuizQuestion: FC<QuizQuestionProps> = ({ quizData, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizResult[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [resultReport, setResultReport] = useState<ResultReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionTime = 10;
  const [timeLeft, setTimeLeft] = useState(questionTime);

  useEffect(() => {
    if (timeLeft === 0 && !isQuizComplete) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (currentQuestion < quizData.length && !isQuizComplete) {
      setTimeLeft(questionTime);
      setSelectedAnswer(null);
    }
  }, [currentQuestion, isQuizComplete]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = async () => {
    const updatedAnswers: QuizResult[] = [
      ...answers,
      {
        questionId: quizData[currentQuestion]._id,
        answerId: selectedAnswer,
        timeSpent: questionTime - timeLeft,
      },
    ];

    setAnswers(updatedAnswers);

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsQuizComplete(true);
      setIsSubmitting(true);
      const marksData = await submitQuiz(updatedAnswers);
      setIsSubmitting(false);
      setResultReport(marksData.data);
      onQuizComplete(); 
    }
  };

  if (isQuizComplete && resultReport) {
    return <ResultPage resultReport={resultReport} />;
  }

  if (isSubmitting) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
        <h4>Submitting Quiz... please wait</h4>
      </div>
    );
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
            value={timeLeftPercentage}
            size={50}
            thickness={8}
            sx={{ color: timeLeft > 3 ? "#f97300" : "#FF0000" }}
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
