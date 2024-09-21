import React, { FC, useContext, useState } from "react";
import styles from "./SignUpPage.module.scss";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import Header from "../../../components/Header/Header";

interface SignUpPageProps {}

const SignUpPage: FC<SignUpPageProps> = () => {
  const { signUp } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signUp(userName, email, password);
      console.log(response.data);
      if (response.data.user.role === "user") {
        navigate("/quiz-page");
      } else if (response.data.user.role === "admin") {
        navigate("/admin");
      }
    } catch (err: any) {
      console.log(err.response.data);
      setError(err.response.data.data.errorMessage);
    }
  };

  return (
    <div className={styles.SignUpPage}>
      <Header isAuthPage={true} />
      <div className={styles.loginForm}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <TextField
              label="Username"
              type="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              fullWidth
              variant="outlined"
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
              }} // Outlined variant
              // Outlined variant
            />
          </div>
          <div className={styles.inputField}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
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
              }} // Outlined variant
            />
          </div>
          <div className={styles.inputField}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
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
              }} // Outlined variant
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
            Sign Up
          </Button>
        </form>

        <div>
          <Link to="/login" className={styles.link}>
            Already have an Account? <span>Log In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
