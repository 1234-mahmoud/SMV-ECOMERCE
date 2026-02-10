import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const localToken = localStorage.getItem("token");

  if (!isAuthenticated && !localToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
