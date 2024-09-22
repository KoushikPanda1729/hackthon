import { FC, useEffect, useState } from "react";
import styles from "./AdminPage.module.scss";
import { Box, Button, CircularProgress, Tab, Tabs } from "@mui/material";
import Header from "../../../components/Header/Header";
import QuestionListItem from "../../../components/QuestionListItem/QuestionListItem";
// import { QuizData } from "../../../components/QuizQuestion/QuizQuestion";
import { fetchAllMcqs } from "../../../services/api/questionService";
import { Outlet, useNavigate } from "react-router-dom";
import { QuizData } from "../../../interfaces/QuizData";

interface AdminPageProps {}

const AdminPage: FC<AdminPageProps> = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [quizData, setQuizData] = useState<QuizData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetchAllMcqs();
        console.log("Fetched quiz data:", response);
        setQuizData(response); // Assuming the API response is the array of questions
        setIsLoading(false);
      } catch (error) {
        setError("Failed to load quiz data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchQuizData();
    setTabIndex(0);
    navigate("/admin/questions");
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);

    // Navigate to the correct tab route
    if (newValue === 0) {
      navigate("/admin/questions");
    } else if (newValue === 1) {
      navigate("/admin/attempted-quizzes");
    }
  };

  // Render the loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <CircularProgress />
      </div>
    );
  }

  // Render error if data fetching failed
  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.AdminPage}>
      <Header isAdminPage={true} />
      {/* <div className={styles.adminBox}>
        <Button>Create New Question</Button>

        {quizData.map((item) => (
          <QuestionListItem quizData={item} />
        ))}
      </div> */}
      <div className={styles.adminBox}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#f97300 !important", // Custom color for the active tab indicator
            },
            "& .MuiTab-root": {
              color: "#fff !important", // Default text color
              fontWeight: "bold !important", // Bold font
              backgroundColor: "#00000000 !important", // Background color
              "&.Mui-selected": {
                color: "#f97300 !important", // Color for selected tab
              },
              "&:hover": {
                color: "#ff5722 !importants", // Hover effect
              },
            },
          }}
        >
          <Tab label="Questions" />
          <Tab label="Attempted Quizzes" />
        </Tabs>

        {/* This renders the child routes like QuestionsPage or AttemptedQuizzesPage */}
        <Box className={styles.tabContent}>
          <Outlet />
        </Box>
      </div>
    </div>
  );
};

export default AdminPage;
