import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TIER_COLOR = {
  Critical: "text-red-400",
  High: "text-orange-400",
  Medium: "text-yellow-400",
  Low: "text-green-400",
};

export default function AssessmentHistory() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/assess/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
        <div>
          <h1 className="text-lg font-bold">Assessment History</h1>
          <p className="text-slate-500 text-xs mt-0.5">All assessments for your account</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Hi, <span className="text-white font-medium">{user?.name}</span></span>
          <button onClick={() => navigate("/intake")} className="text-indigo-400 hover:text-indigo-300 text-xs cursor-pointer transition-colors">
            New Assessment
          </button>
          <button onClick={() => navigate("/profile")} className="text-indigo-400 hover:text-indigo-300 text-xs cursor-pointer transition-colors">
            Profile
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <p className="text-slate-500 text-sm">Loading…</p>
          ) : history.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500 text-sm mb-4">No assessments yet.</p>
              <button
                onClick={() => navigate("/intake")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Run Your First Assessment →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/dashboard/${a.id}`)}
                  className="w-full text-left bg-slate-900 border border-slate-700/50 rounded-xl p-4 hover:border-indigo-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold text-sm">{a.system_name ?? "Unnamed System"}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{a.company_name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${TIER_COLOR[a.risk_tier] ?? "text-slate-400"}`}>
                        {a.risk_tier ?? "—"}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {a.assessment_date ?? (a.created_at ? a.created_at.slice(0, 10) : "—")}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
