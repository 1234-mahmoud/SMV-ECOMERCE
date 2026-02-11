import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const localToken = localStorage.getItem("token");

  // لو مفيش تسجيل دخول
  if (!isAuthenticated && !localToken) {
    return <Navigate to="/login" replace />;
  }

  // لو فيه Role مطلوب والمستخدم مش نفس الـ role
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
