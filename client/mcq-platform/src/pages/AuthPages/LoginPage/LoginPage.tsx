import { FC, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
// Import MUI TextField
import { TextField, Button } from "@mui/material";
import styles from "./LoginPage.module.scss";
import Header from "../../../components/Header/Header";

const LoginForm: FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await login(email, password);
      // console.log(response.data);
      if (response.data.user.role === "user") {
        navigate("/quiz-page");
      } else if (response.data.user.role === "admin") {
        navigate("/admin");
      }
      // navigate("/");
    } catch (err: any) {
      // console.log(err.response.data);
      setError(err.response.data.message);
    }
  };

  return (
    <div className={styles.LoginPage}>
      <Header isAuthPage={true} />
      <div className={styles.loginForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <TextField
              className={styles.input}
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              fullWidth
              variant="outlined" // Outlined variant
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e2dfd0", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffffff", // Border color when focused
                  },
                },
                "& label.Mui-focused": {
                  color: "#ffffff", // Label color when focused
                },
                "& label": {
                  color: "#e2dfd0", // Label color
                },
                "& .MuiOutlinedInput-input": {
                  color: "#ffffff",
                },
              }}
            />
          </div>
          <div className={styles.inputField}>
            <TextField
              className={styles.input}
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              fullWidth
              variant="outlined" // Outlined variant
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#e2dfd0", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffffff", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffffff", // Border color when focused
                  },
                },
                "& label.Mui-focused": {
                  color: "#ffffff", // Label color when focused
                },
                "& label": {
                  color: "#e2dfd0", // Label color
                },
                "& .MuiOutlinedInput-input": {
                  color: "#ffffff",
                },
              }}
            />
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.loginButton}
            fullWidth
          >
            Login
          </Button>
        </form>

        <div>
          <Link to="/sign-up" className={styles.link}>
            Don't have an account? <span>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
