import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";
import { FRAMEWORKS } from "../data/mockData";

const FRAMEWORK_META = {
  "EU AI Act":                        { icon: "🇪🇺", desc: "European Union AI regulation for high-risk systems" },
  "ISO 42001":                        { icon: "🤖", desc: "AI management system standard" },
  "NIST AI RMF":                      { icon: "🏛️", desc: "NIST AI Risk Management Framework" },
  "NIST CSF":                         { icon: "🔐", desc: "NIST Cybersecurity Framework" },
  "ISO 27001":                        { icon: "🛡️", desc: "Information security management" },
  "SOC 2":                            { icon: "☁️", desc: "Service organization controls for cloud" },
  "PCI DSS":                          { icon: "💳", desc: "Payment card industry data security" },
  "ISO 9001":                         { icon: "✅", desc: "Quality management systems" },
  "21 CFR Part 11":                   { icon: "🧬", desc: "FDA electronic records & signatures" },
  "GDPR":                             { icon: "🔒", desc: "EU General Data Protection Regulation" },
  "HIPAA":                            { icon: "🏥", desc: "Health information privacy & security" },
  "US State AI and Privacy Regulations": { icon: "🗽", desc: "US state-level AI & privacy laws" },
  "AIHCS":                            { icon: "⚕️", desc: "AI in Healthcare Standards" },
};

export default function FrameworkSelectPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggle(fw) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(fw) ? next.delete(fw) : next.add(fw);
      return next;
    });
  }

  function selectAll() { setSelected(new Set(FRAMEWORKS)); }
  function clearAll() { setSelected(new Set()); }

  async function handleContinue() {
    if (selected.size === 0) { setError("Please select at least one framework."); return; }
    setError("");
    setLoading(true);
    try {
      await client.post("/frameworks/select", { frameworks: [...selected] });
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.detail ?? "Failed to save frameworks.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
        <div>
          <h1 className="text-lg font-bold">TAIGA Compliance Platform</h1>
          <p className="text-slate-500 text-xs mt-0.5">Powered by TAIGA</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Hi, <span className="text-white font-medium">{user?.name}</span></span>
          <button onClick={() => { logout(); navigate("/login"); }} className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors">
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto">
        <div className="w-full max-w-3xl">
          {/* Title */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white">Select Compliance Frameworks</h2>
            <p className="text-slate-400 text-sm mt-2">
              Choose the frameworks applicable to your organisation. A single gap assessment will be mapped across all selected frameworks.
            </p>
          </div>

          {/* Select controls */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">{selected.size} of {FRAMEWORKS.length} selected</span>
            <div className="flex gap-3">
              <button onClick={selectAll} className="text-indigo-400 hover:text-indigo-300 text-xs cursor-pointer transition-colors">Select All</button>
              <span className="text-slate-700">|</span>
              <button onClick={clearAll} className="text-slate-500 hover:text-slate-300 text-xs cursor-pointer transition-colors">Clear</button>
            </div>
          </div>

          {/* Framework grid */}
          <div className="grid grid-cols-1 gap-2 mb-6">
            {FRAMEWORKS.map((fw) => {
              const meta = FRAMEWORK_META[fw];
              const isSelected = selected.has(fw);
              return (
                <button
                  key={fw}
                  onClick={() => toggle(fw)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600/20 border-indigo-500/60 shadow-sm shadow-indigo-500/10"
                      : "bg-slate-900 border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-600"
                  }`}>
                    {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  {/* Icon */}
                  <span className="text-xl shrink-0">{meta.icon}</span>
                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isSelected ? "text-white" : "text-slate-200"}`}>{fw}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{meta.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="text-xs text-indigo-400 font-medium shrink-0">Selected</span>
                  )}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={loading || selected.size === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer"
          >
            {loading ? "Saving…" : `Continue to Assessment →`}
          </button>
        </div>
      </div>
    </div>
  );
}
