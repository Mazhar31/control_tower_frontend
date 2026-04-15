import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const STEPS = [
  "Uploading document…",
  "Processing document…",
  "Mapping to selected frameworks…",
  "Generating gap assessment…",
  "Preparing dashboard…",
];

function LoadingOverlay({ step }) {
  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-6">
      <div className="relative w-20 h-20">
        <svg className="animate-spin w-20 h-20" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#1e293b" strokeWidth="6" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="#6366f1" strokeWidth="6"
            strokeLinecap="round" strokeDasharray="60 154" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl">🛡️</span>
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-base">{STEPS[step]}</p>
        <p className="text-slate-500 text-xs mt-1">TAIGA · Framework Analysis</p>
        <div className="flex gap-1.5 justify-center mt-3">
          {STEPS.map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              i <= step ? "bg-indigo-500" : "bg-slate-700"
            }`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const { user, logout, saveAssessment } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  function handleFileChange(e) {
    setError("");
    const f = e.target.files[0];
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext)) {
      setError("Only PDF, DOCX, and TXT files are accepted.");
      return;
    }
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { setError("Please select a file before submitting."); return; }

    setLoading(true);
    setLoadingStep(0);
    setError("");

    try {
      // Upload file and kick off analyze in parallel
      const form = new FormData();
      form.append("file", file);

      const analyzePromise = client.post("/upload", form)
        .catch(() => null) // upload failure never blocks analyze
        .then(() => client.post("/analyze"));

      for (let i = 1; i <= 3; i++) {
        await new Promise((r) => setTimeout(r, 700));
        setLoadingStep(i);
      }
      const { data } = await analyzePromise;
      setLoadingStep(4);
      saveAssessment(data.result);

      await new Promise((r) => setTimeout(r, 600));
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.detail ?? "Assessment failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {loading && <LoadingOverlay step={loadingStep} />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white">TAIGA Compliance Platform</h1>
          <p className="text-slate-500 text-xs">Powered by TAIGA</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Hi, <span className="text-white font-medium">{user?.name}</span></span>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Run Gap Assessment</h2>
            <p className="text-slate-400 text-sm mt-1">
              Upload your AI governance document. TAIGA will map gaps across your selected frameworks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-indigo-600/20 flex items-center justify-center transition-colors text-2xl">
                {file ? "📄" : "📁"}
              </div>
              {file ? (
                <div className="text-center">
                  <p className="text-white font-medium text-sm">{file.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-slate-300 text-sm font-medium">Click to select a file</p>
                  <p className="text-slate-500 text-xs mt-0.5">PDF, DOCX or TXT</p>
                </div>
              )}
              <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileChange} />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {loading ? "Running Assessment…" : "Run Gap Assessment →"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="text-slate-500 hover:text-slate-300 text-sm text-center transition-colors cursor-pointer"
            >
              Skip → View Demo Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
