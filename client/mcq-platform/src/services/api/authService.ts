import axios from "axios";
import { API_BASE_URL } from "../../appConstants";
import { AuthResponse } from "../../interfaces/AuthResponse";
import { User } from "../../interfaces/User";

// Function to log in the user and get the token and user information
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/users/login`,
      {
        email,
        password,
      }
    );

    const { user, accessToken, refreshToken } = response.data.data;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // console.log(response);

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const signUp = async (
  userName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/users/sign-up`,
      {
        userName,
        email,
        password,
      }
    );

    const { user, accessToken, refreshToken } = response.data.data;

    // Store the user and tokens in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    console.log("Sign-up successful:", response.data);

    return response.data;
  } catch (error) {
    console.error("Sign-up failed:", error);
    throw error;
  }
};

// Function to log out the user
export const logout = async () => {
  await axios.post("/api/v1/users/logout");
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Function to get the current authenticated user
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Function to get the current access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// Function to get the current refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Check if the user is authenticated (token exists)
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
