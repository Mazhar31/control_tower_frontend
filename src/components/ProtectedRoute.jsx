import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const { user, logout } = useAuth();

  if (!user || !isTokenValid(user.token)) {
    if (user) logout(); // clear stale session
    return <Navigate to="/login" replace />;
  }

  return children;
}
