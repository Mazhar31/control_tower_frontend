import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const AuthContext = createContext(null);

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

function readSession() {
  const token = sessionStorage.getItem("token");
  if (!token || !isTokenValid(token)) {
    sessionStorage.clear();
    return null;
  }
  return {
    token,
    name: sessionStorage.getItem("userName"),
    role: sessionStorage.getItem("userRole"),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const [assessment, setAssessment] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("assessment") ?? "null"); }
    catch { return null; }
  });
  const [assessmentId, setAssessmentId] = useState(() =>
    sessionStorage.getItem("assessmentId") ?? null
  );

  const inactivityTimer = useRef(null);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
    setAssessment(null);
    setAssessmentId(null);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  }, []);

  const resetTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(logout, INACTIVITY_LIMIT);
  }, [logout]);

  // Start/reset inactivity timer on user activity
  useEffect(() => {
    if (!user) return;

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer(); // start timer immediately on login

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [user, resetTimer]);

  function login(token, name, role) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userName", name);
    sessionStorage.setItem("userRole", role);
    setUser({ token, name, role });
  }

  function saveAssessment(data, id) {
    sessionStorage.setItem("assessment", JSON.stringify(data));
    sessionStorage.setItem("assessmentId", String(id));
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
