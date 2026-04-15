import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    return token ? { token, name, role } : null;
  });

  const [assessment, setAssessment] = useState(() => {
    try { return JSON.parse(localStorage.getItem("assessment") ?? "null"); }
    catch { return null; }
  });

  const [assessmentId, setAssessmentId] = useState(() => {
    return localStorage.getItem("assessmentId") ?? null;
  });

  function login(token, name, role) {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    setUser({ token, name, role });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("assessment");
    localStorage.removeItem("assessmentId");
    setUser(null);
    setAssessment(null);
    setAssessmentId(null);
  }

  function saveAssessment(data, id) {
    localStorage.setItem("assessment", JSON.stringify(data));
    localStorage.setItem("assessmentId", String(id));
    setAssessment(data);
    setAssessmentId(id);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, assessment, assessmentId, saveAssessment }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
