import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import IntakePage from "./components/IntakePage";
import Dashboard from "./components/Dashboard";
import AssessmentHistory from "./components/AssessmentHistory";
import AdminPanel from "./components/AdminPanel";
import ProfilePage from "./components/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/signup"          element={<SignupPage />} />
          <Route path="/intake"          element={<ProtectedRoute><IntakePage /></ProtectedRoute>} />
          <Route path="/dashboard/:id"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/history"         element={<ProtectedRoute><AssessmentHistory /></ProtectedRoute>} />
          <Route path="/admin"           element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*"                element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
