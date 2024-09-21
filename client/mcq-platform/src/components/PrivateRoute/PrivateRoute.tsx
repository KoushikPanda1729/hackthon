import { FC, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface PublicRouteProps {}

// Define the PublicRoute functional component
const PublicRoute: FC<PublicRouteProps> = () => {
  const authContext = useContext(AuthContext);

  // Ensure authContext is not undefined before accessing its properties
  if (!authContext) {
    return <Outlet />; // If no context, treat it as not logged in and allow access to login/signup
  }

  const { authState } = authContext;

  // If the user is already logged in, redirect based on their role
  if (authState.user) {
    return authState.user.role === "admin" ? (
      <Navigate to="/admin" />
    ) : (
      <Navigate to="/quiz-page" />
    );
  }

  // If user is not logged in, render the child components (e.g., login or sign-up page)
  return <Outlet />;
};

export default PublicRoute;
