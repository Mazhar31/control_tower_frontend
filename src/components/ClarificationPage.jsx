import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 5;

const LOADING_STEPS = [
  "Submitting answers…",
  "Running gap assessment…",
  "Receiving framework mappings…",
  "Preparing dashboard…",
];

function LoadingOverlay({ step }) {
  return (
    <div className="fixed inset-0 bg-slate-950/97 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-8">
      <div className="relative w-24 h-24">
        <svg className="animate-spin w-24 h-24" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#1e293b" strokeWidth="7" />
          <circle cx="48" cy="48" r="40" fill="none" stroke="#6366f1" strokeWidth="7"
            strokeLinecap="round" strokeDasharray="70 182" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-3xl">🛡️</span>
      </div>
      <div className="text-center max-w-sm">
        <p className="text-white font-semibold text-lg">{LOADING_STEPS[step]}</p>
        <p className="text-slate-500 text-sm mt-1">TAIGA · Framework Analysis</p>
        <p className="text-slate-600 text-xs mt-2">This may take 10–15 minutes. Please keep this window open.</p>
        <div className="flex gap-2 justify-center mt-4">
          {LOADING_STEPS.map((_, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i < step ? "bg-indigo-500" : i === step ? "bg-indigo-400 animate-pulse" : "bg-slate-700"
            }`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ClarificationPage({ sessionId, questions, round, meta, onComplete }) {
  const { user, logout, saveAssessment } = useAuth();
  const navigate = useNavigate();

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState(() => questions.map(() => ""));
  const answersRef = useRef(answers);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const pageStart = currentPage * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, questions.length);
  const pageQuestions = questions.slice(pageStart, pageEnd);
  const isLastPage = currentPage === totalPages - 1;

  function setAnswer(i, val) {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = val;
      answersRef.current = next;
      return next;
    });
  }

  function handleNext() {
    const current = answersRef.current;
    const start = currentPage * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, questions.length);
    for (let i = start; i < end; i++) {
      if (!current[i].trim()) {
        setError(`Please answer question ${i + 1}.`);
        return;
      }
    }
    setError("");
    setCurrentPage((p) => p + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Validate last page answers
    const current = answersRef.current;
    for (let i = pageStart; i < pageEnd; i++) {
      if (!current[i].trim()) {
        setError(`Please answer question ${i + 1}.`);
        return;
      }
    }
    setError("");
    setLoading(true);
    setLoadingStep(0);

    const stepTimer = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 2));
    }, 180000);

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("answers", JSON.stringify(
        answersRef.current.map((answer, question_index) => ({ question_index, answer }))
      ));
      formData.append("uploaded_file_names", JSON.stringify(meta?.uploaded_file_names ?? []));
      formData.append("nextAuditDate", meta?.nextAuditDate ?? "");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assess/continue`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      clearInterval(stepTimer);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? "Assessment failed.");
      }

      const data = await res.json();

      if (data.status === "questions") {
        setLoading(false);
        onComplete({ type: "questions", payload: data });
        return;
      }

      setLoadingStep(LOADING_STEPS.length - 1);
      saveAssessment(data.result, data.assessment_id);
      await new Promise((r) => setTimeout(r, 600));
      navigate(`/dashboard/${data.assessment_id}`);
    } catch (err) {
      clearInterval(stepTimer);
      setLoading(false);
      setError(err.message ?? "Assessment failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {loading && <LoadingOverlay step={loadingStep} />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
        <div>
          <h1 className="text-lg font-bold">TAIGA Compliance Platform</h1>
          <p className="text-slate-500 text-xs mt-0.5">Powered by TAIGA</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Hi, <span className="text-white font-medium">{user?.name}</span></span>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">

          {/* Header block */}
          <div className="mb-6">
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Clarification Needed</span>
            <h2 className="text-2xl font-bold text-white mt-1">A Few More Questions</h2>
            <p className="text-slate-400 text-sm mt-1">
              To deliver the most accurate gap assessment, we need some clarifications. These are answered in up to 4 rounds.
            </p>
          </div>

          {/* Round + page progress */}
          <div className="flex items-center gap-3 mb-4">
            {[1, 2, 3, 4].map((r) => (
              <div key={r} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                r < round ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300" :
                r === round ? "bg-indigo-600 border-indigo-500 text-white" :
                "bg-slate-800/50 border-slate-700/50 text-slate-600"
              }`}>
                {r < round ? "✓ " : ""}Round {r}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <p className="text-white font-semibold text-sm">
                  Round {round} — Questions {pageStart + 1}–{pageEnd} of {questions.length}
                </p>
                <span className="text-slate-500 text-xs">
                  Part {currentPage + 1} of {totalPages}
                </span>
              </div>

              {pageQuestions.map((q, i) => {
                const globalIndex = pageStart + i;
                return (
                  <div key={globalIndex} className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-sm">
                      <span className="text-indigo-400 font-semibold mr-1.5">{globalIndex + 1}.</span>
                      {q}
                    </label>
                    <textarea
                      rows={2}
                      value={answers[globalIndex]}
                      onChange={(e) => setAnswer(globalIndex, e.target.value)}
                      placeholder="Your answer…"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>
                );
              })}
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                {currentPage > 0 && (
                  <button type="button" onClick={() => { setError(""); setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                    ← Back
                  </button>
                )}
                <span className="text-slate-500 text-xs">Round {round} of up to 4</span>
              </div>
              {isLastPage ? (
                <button type="submit" disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
                  {loading ? "Running Assessment…" : "Submit Answers →"}
                </button>
              ) : (
                <button type="button" onClick={handleNext}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
                  Next Questions →
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
