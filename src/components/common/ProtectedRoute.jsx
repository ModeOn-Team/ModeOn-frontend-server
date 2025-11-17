import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

// 인증이 필요한 라우트 보호 컴포넌트
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user?.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

