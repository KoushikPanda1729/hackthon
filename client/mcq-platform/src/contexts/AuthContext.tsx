import { createContext, useState, useEffect, ReactNode } from "react";
import {
  signUp as signUpService,
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  getAccessToken,
} from "../services/api/authService";
import { User } from "../interfaces/User";
import { AuthResponse } from "../interfaces/AuthResponse";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType {
  authState: AuthState;
  signUp: (
    userName: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

// Default context with no-op functions
const defaultAuthContext: AuthContextType = {
  authState: {
    user: null,
    accessToken: null,
    refreshToken: null,
  },
  login: async () => {
    throw new Error("login function is not initialized");
  },
  signUp: async () => {
    throw new Error("signUp function is not initialized");
  },
  logout: () => {
    throw new Error("logout function is not initialized");
  },
};

// Initialize AuthContext with a default value
export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: getCurrentUser(),
    accessToken: getAccessToken(),
    refreshToken: localStorage.getItem("refreshToken"),
  });

  // On load, check if user is logged in
  useEffect(() => {
    const user = getCurrentUser();
    const accessToken = getAccessToken();
    const refreshToken = localStorage.getItem("refreshToken");
    if (user && accessToken && refreshToken) {
      setAuthState({ user, accessToken, refreshToken });
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await loginService(email, password);
      const { user, accessToken, refreshToken } = response.data;
      setAuthState({ user, accessToken, refreshToken });
      return response;
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  };

  // Login function
  const signUp = async (userName: string, email: string, password: string) => {
    try {
      const response = await signUpService(userName, email, password);
      const { user, accessToken, refreshToken } = response.data;
      setAuthState({ user, accessToken, refreshToken });
      return response;
    } catch (error) {
      console.error("Failed to SignUp:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    logoutService();
    setAuthState({ user: null, accessToken: null, refreshToken: null });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
