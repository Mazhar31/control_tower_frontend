import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  US_STATES, DEV_DEFAULTS,
  INDUSTRIES, DATA_TYPES, GEOGRAPHIES,
} from "../data/mockData";

const LOADING_STEPS = [
  "Submitting intake…",
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

function SectionLabel({ children }) {
  return <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">{children}</p>;
}

function Input({ label, required, ...props }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm mb-1">
        {label}{required && <span className="text-indigo-400 ml-0.5">*</span>}
      </label>
      <input
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        {...props}
      />
    </div>
  );
}

function Textarea({ label, required, hint, ...props }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm mb-1">
        {label}{required && <span className="text-indigo-400 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-slate-500 text-xs mb-1 italic">{hint}</p>}
      <textarea
        rows={3}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
        {...props}
      />
    </div>
  );
}

function SelectField({ label, required, options, placeholder = "Select…", ...props }) {
  return (
    <div>
      <label className="block text-slate-300 text-sm mb-1">
        {label}{required && <span className="text-indigo-400 ml-0.5">*</span>}
      </label>
      <select
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGrid({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(({ value, label }) => {
        const on = selected.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => onToggle(value)}
            className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
              on
                ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300"
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
              on ? "bg-indigo-600 border-indigo-600" : "border-slate-600"
            }`}>
              {on && <span className="text-white text-[9px] font-bold">✓</span>}
            </div>
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function IntakePage() {
  const { user, logout, saveAssessment } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState(DEV_DEFAULTS);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function toggleArray(field) {
    return (value) => setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((x) => x !== value)
        : [...f[field], value],
    }));
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files);
    const invalid = selected.filter((f) => !["pdf", "docx"].includes(f.name.split(".").pop().toLowerCase()));
    if (invalid.length) { setError("Only PDF and DOCX files are accepted."); return; }
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !existing.has(f.name))];
    });
    setError("");
    e.target.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.companyName || !form.systemName || !form.systemDescription) {
      setError("Company name, system name, and description are required.");
      return;
    }
    if (!form.industry) {
      setError("Please select your industry.");
      return;
    }
    if (!form.geography) {
      setError("Please select a geography.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingStep(0);

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();

      const { companyName, systemName, systemDescription, aiType, decisionImpact,
               existingDocs, industry, geography,
               usStates, aihcsResponse, deploymentStage, dataTypes, additionalContext } = form;

      const payload = {
        companyName,
        systemName,
        systemDescription,
        aiType: aiType || "",
        decisionImpact: decisionImpact || "",
        existingDocs: Array.isArray(existingDocs) ? existingDocs.join(",") : "",
        industry,
        geography,
        usStates: usStates.join(","),
        aihcsResponse,
        deploymentStage,
        dataTypes: Array.isArray(dataTypes) ? dataTypes.join(", ") : dataTypes,
        additionalContext,
      };
      Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
      files.forEach((f) => formData.append("files", f));

      const stepTimer = setInterval(() => {
        setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 2));
      }, 180000); // advance step every 3 min across ~15 min total

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assess`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      clearInterval(stepTimer);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? "Assessment failed.");
      }

      setLoadingStep(LOADING_STEPS.length - 1);
      const data = await res.json();
      saveAssessment(data.result, data.assessment_id);
      await new Promise((r) => setTimeout(r, 600));
      navigate(`/dashboard/${data.assessment_id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message ?? "Assessment failed. Please try again.");
    }
  }

  const showUsStates = form.geography === "United States";

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
          <button
            onClick={() => navigate("/history")}
            className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors cursor-pointer"
          >
            Assessment History
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors cursor-pointer"
          >
            Profile
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">New AI System Assessment</h2>
            <p className="text-slate-400 text-sm mt-1">
              Complete the intake form below. TAIGA will submit your data to The Leash for a full gap assessment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* System Info */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <SectionLabel>System Information</SectionLabel>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company Name" required placeholder="Acme Corp" value={form.companyName} onChange={set("companyName")} />
                <Input label="AI System Name" required placeholder="Customer Analytics AI" value={form.systemName} onChange={set("systemName")} />
              </div>
              <Textarea
                label="System Description" required
                hint="Describe core functionality, purpose, who uses it, and what decisions or outputs it produces."
                placeholder="e.g. ML system that analyzes purchase data for 50,000 customers…"
                value={form.systemDescription} onChange={set("systemDescription")}
              />

              <SelectField
                label="Primary AI Technology"
                options={[
                  { value: "llm_api_openai",     label: "Third-party LLM API — OpenAI (GPT-4, etc.)" },
                  { value: "llm_api_claude",     label: "Third-party LLM API — Anthropic (Claude)" },
                  { value: "llm_api_gemini",     label: "Third-party LLM API — Google (Gemini)" },
                  { value: "llm_api_other",      label: "Third-party LLM API — Other provider" },
                  { value: "llm_hosted",         label: "Self-hosted / Open-source LLM (Llama, Mistral, etc.)" },
                  { value: "ml_classification",  label: "ML Classification / Prediction model" },
                  { value: "ml_recommendation",  label: "Recommendation / Ranking system" },
                  { value: "computer_vision",    label: "Computer Vision / Image analysis" },
                  { value: "nlp_custom",         label: "Custom NLP / Text processing" },
                  { value: "multiple",           label: "Multiple AI types combined" },
                  { value: "other",              label: "Other / Not sure" },
                ]}
                placeholder="Select the primary AI type…"
                value={form.aiType} onChange={set("aiType")}
              />

              <Textarea
                label="What decisions does the AI influence?"
                hint="Who is affected? Are decisions automated or human-reviewed?"
                placeholder="e.g. The AI generates loan approval recommendations. Human underwriters review all recommendations and make the final credit decision."
                value={form.decisionImpact} onChange={set("decisionImpact")}
              />
              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Industry" required
                  options={INDUSTRIES}
                  value={form.industry}
                  onChange={set("industry")}
                />
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Deployment Stage</label>
                  <select
                    value={form.deploymentStage}
                    onChange={set("deploymentStage")}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {["development", "testing", "staging", "production"].map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Textarea
                label="Additional Context"
                hint="Upcoming audits, compliance deadlines, recent audit findings, or special requirements."
                placeholder="e.g. Preparing for HIPAA audit Q3 2026."
                value={form.additionalContext} onChange={set("additionalContext")}
              />
            </div>

            {/* Existing Documentation */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6">
              <SectionLabel>Existing Documentation</SectionLabel>
              <p className="text-slate-500 text-xs mb-3">Select all that apply, even if incomplete or informal.</p>
              <CheckboxGrid
                options={[
                  { value: "system_overview",          label: "System Overview / Architecture" },
                  { value: "privacy_policy",            label: "Privacy Policy" },
                  { value: "security_policy",           label: "Security Policy / Documentation" },
                  { value: "ai_governance_policy",      label: "AI Governance Policy" },
                  { value: "risk_assessment",           label: "Risk Assessment" },
                  { value: "data_processing_agreement", label: "Data Processing Agreement" },
                  { value: "validation_testing",        label: "Validation / Testing Docs" },
                  { value: "incident_response",         label: "Incident Response Plan" },
                  { value: "none",                      label: "None of the above" },
                ]}
                selected={form.existingDocs}
                onToggle={toggleArray("existingDocs")}
              />
            </div>

            {/* Data Types */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6">
              <SectionLabel>Data Types Processed</SectionLabel>
              <p className="text-slate-500 text-xs mb-3">Select all categories your AI accesses, processes, stores, or transmits.</p>
              <CheckboxGrid
                options={DATA_TYPES}
                selected={form.dataTypes}
                onToggle={toggleArray("dataTypes")}
              />
              {form.dataTypes.length > 0 && (
                <p className="text-slate-500 text-xs mt-2">{form.dataTypes.length} selected</p>
              )}
            </div>

            {/* Geography */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <SectionLabel>Geographic Scope</SectionLabel>
              <SelectField
                label="Primary Geography" required
                options={GEOGRAPHIES}
                placeholder="Select primary geography…"
                value={form.geography}
                onChange={set("geography")}
              />

              {/* US States — only shown when United States is selected */}
              {showUsStates && (
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">
                    US States <span className="normal-case text-slate-500 font-normal">— select states where you operate or have users</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {US_STATES.map(({ code, name }) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleArray("usStates")(code)}
                        title={name}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          form.usStates.includes(code)
                            ? "bg-indigo-600/30 border-indigo-500/60 text-indigo-300"
                            : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                  {form.usStates.length > 0 && (
                    <p className="text-slate-500 text-xs mt-2">{form.usStates.length} state(s) selected: {form.usStates.join(", ")}</p>
                  )}
                </div>
              )}
            </div>

            {/* AIHCS */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6">
              <SectionLabel>AIHCS Assessment</SectionLabel>
              <p className="text-slate-400 text-sm mb-3">Do you have policies governing how employees use AI at work?</p>
              <div className="flex flex-col gap-2">
                {[
                  { value: "yes_formal", label: "Yes — formal written policies in place" },
                  { value: "yes_informal", label: "Yes — informal guidelines, nothing formally documented" },
                  { value: "in_progress", label: "In progress — currently developing policies" },
                  { value: "no", label: "No — no AI usage policies for employees" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, aihcsResponse: value }))}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                      form.aihcsResponse === value
                        ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300"
                        : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      form.aihcsResponse === value ? "border-indigo-500 bg-indigo-600" : "border-slate-600"
                    }`}>
                      {form.aihcsResponse === value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6">
              <SectionLabel>Supporting Document (optional)</SectionLabel>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-2xl">📁</span>
                <div className="text-center">
                  <p className="text-slate-300 text-sm">Click to attach files</p>
                  <p className="text-slate-500 text-xs">PDF or DOCX · multiple allowed</p>
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.docx" multiple className="hidden" onChange={handleFileChange} />
              </div>
              {files.length > 0 && (
                <ul className="mt-3 flex flex-col gap-1">
                  {files.map((f) => (
                    <li key={f.name} className="flex items-center justify-between text-xs text-slate-300 bg-slate-800 rounded-lg px-3 py-1.5">
                      <span>📄 {f.name} <span className="text-slate-500">({(f.size / 1024).toFixed(1)} KB)</span></span>
                      <button type="button" onClick={() => setFiles((prev) => prev.filter((x) => x.name !== f.name))} className="text-slate-500 hover:text-red-400 ml-3 cursor-pointer">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {loading ? "Running Assessment…" : "Run Gap Assessment →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
