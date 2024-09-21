// src/components/ProtectedRoute.tsx
import { FC, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

interface ProtectedRouteProps {}

// Define the ProtectedRoute functional component
const ProtectedRoute: FC<ProtectedRouteProps> = () => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  // Ensure authContext is not undefined before accessing its properties
  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { authState } = authContext;

  // If user is not authenticated, redirect to login
  if (!authState.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based routing
  if (authState.user.role === "user") {
    // If the role is 'user', ensure we are navigating to user routes
    return location.pathname.startsWith("/admin") ? (
      <Navigate to="/quiz-page" />
    ) : (
      <Outlet />
    );
  }

  if (authState.user.role === "admin") {
    // If the role is 'admin', ensure we are navigating to admin routes
    return location.pathname.startsWith("/quiz-page") ? (
      <Navigate to="/admin" />
    ) : (
      <Outlet />
    );
  }

  // Fallback if no role match (this shouldn't happen)
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
