import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/AuthPages/LoginPage/LoginPage";
import SignUpPage from "./pages/AuthPages/SignUpPage/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import QuizPage from "./pages/UserPages/QuizPage/QuizPage";
import AdminPage from "./pages/AdminPages/AdminPage/AdminPage";
import { AuthProvider } from "./contexts/AuthContext";
import PublicRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/login",
      element: <PublicRoute />, // Protect login page with PublicRoute
      children: [{ index: true, element: <LoginPage /> }],
    },
    {
      path: "/sign-up",
      element: <PublicRoute />, // Protect sign-up page with PublicRoute
      children: [{ index: true, element: <SignUpPage /> }],
    },

    // Protected Routes for users
    {
      path: "/",
      element: <ProtectedRoute />, // Protect routes based on the user role
      children: [
        { path: "quiz-page", element: <QuizPage key="quiz-page" /> },
        // More user routes can be added here
      ],
    },

    // Protected Routes for admins
    {
      path: "/",
      element: <ProtectedRoute />, // Protect admin routes
      children: [{ path: "admin", element: <AdminPage key="admin-page" /> }],
    },

    // Fallback: redirect to login if no match
    { path: "*", element: <Navigate to="/login" /> },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
