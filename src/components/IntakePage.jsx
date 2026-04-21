import { useState, useRef } from "react";

function TermsModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div>
            <p className="text-white font-bold text-sm">TAIGA | HAIG GROUP – Complimentary Gap Assessment</p>
            <p className="text-slate-400 text-xs mt-0.5">Disclaimer and Terms and Conditions</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-xl leading-none cursor-pointer transition-colors">✕</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 text-slate-300 text-xs leading-relaxed flex flex-col gap-4">
          <p className="text-yellow-400 font-semibold">IMPORTANT: READ CAREFULLY BEFORE PROCEEDING</p>

          <div>
            <p className="text-white font-semibold mb-1">1. Nature of the Service</p>
            <p>The complimentary gap assessment provided by TAIGA | HAIG GROUP is a high-level, automated analysis only. It is not exhaustive, not guaranteed to identify every gap (critical or otherwise), and is offered free of charge solely to demonstrate the capabilities of the TAIGA Control Tower platform. The assessment may miss material gaps that could be identified later during remediation or by independent review.</p>
          </div>

          <div>
            <p className="text-white font-semibold mb-1">2. No Warranty or Guarantee</p>
            <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITH NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TAIGA | HAIG GROUP AND ITS MEMBERS, OFFICERS, AND AGENTS EXPRESSLY DISCLAIM ANY AND ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, OR NON-INFRINGEMENT.</p>
          </div>

          <div>
            <p className="text-white font-semibold mb-1">3. Client Responsibility and Assumption of Risk</p>
            <p className="mb-1">You, the client, remain solely and exclusively responsible for:</p>
            <ul className="list-disc list-inside flex flex-col gap-0.5 text-slate-400">
              <li>Final validation of all findings</li>
              <li>Implementation of any remediation</li>
              <li>Achieving and maintaining compliance with all applicable laws, regulations, and standards (including but not limited to ISO 42001, EU AI Act, NIST AI RMF, GDPR, HIPAA, and all U.S. state laws)</li>
              <li>Any regulatory, legal, financial, or other consequences arising from your AI systems</li>
            </ul>
            <p className="mt-1">You assume all risk associated with reliance on the gap assessment.</p>
          </div>

          <div>
            <p className="text-white font-semibold mb-1">4. Limitation of Liability</p>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, TAIGA | HAIG GROUP'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS COMPLIMENTARY GAP ASSESSMENT SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS ($100.00), REGARDLESS OF THE LEGAL THEORY (CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE). IN NO EVENT SHALL TAIGA | HAIG GROUP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, REGULATORY FINES, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
          </div>

          <div>
            <p className="text-white font-semibold mb-1">5. Indemnification</p>
            <p>You agree to indemnify, defend, and hold harmless TAIGA | HAIG GROUP, its members (including TAIGA LLC, Jesse Hart / HAIG, and Shelby Chollett), officers, employees, and agents from and against any and all claims, losses, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the gap assessment, your AI systems, or your failure to achieve compliance.</p>
          </div>

          <div>
            <p className="text-white font-semibold mb-1">6. No Legal or Professional Advice</p>
            <p>Nothing in the gap assessment, dashboard, or any related communication constitutes legal, regulatory, audit, or professional advice. You must consult your own qualified legal and compliance professionals.</p>
          </div>

          <div>
            <p className="text-white font-semibold mb-1">7. Governing Law</p>
            <p>These Terms shall be governed exclusively by the laws of the State of Minnesota, without regard to conflict of laws principles. Any dispute shall be resolved exclusively in the state or federal courts located in Ramsey County, Minnesota.</p>
          </div>

          <div>
            <p className="text-white font-semibold mb-1">8. Entire Agreement</p>
            <p>These Terms constitute the entire agreement between you and TAIGA | HAIG GROUP regarding the complimentary gap assessment and supersede all prior understandings.</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-3">
            <p className="text-white font-semibold mb-1">Acceptance</p>
            <p className="mb-1">By clicking "I Accept" you confirm that:</p>
            <ul className="list-disc list-inside flex flex-col gap-0.5 text-slate-400">
              <li>You have read, understood, and agree to be legally bound by the above Disclaimer and Terms and Conditions.</li>
              <li>You are authorized to bind your organization to these terms.</li>
              <li>You proceed at your own risk and release TAIGA | HAIG GROUP from all liability to the fullest extent permitted by law.</li>
            </ul>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-800 shrink-0">
          <button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl text-sm transition-colors cursor-pointer">Close</button>
        </div>
      </div>
    </div>
  );
}
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

  const [page, setPage] = useState(1);
  const [form, setForm] = useState(() => {
    const token = sessionStorage.getItem("token");
    let email = "";
    try { email = JSON.parse(atob(token.split(".")[1])).email ?? ""; } catch {}
    return { ...DEV_DEFAULTS, contactName: user?.name ?? "", contactEmail: email };
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showTerms, setShowTerms] = useState(false);

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

  function goTo(n) {
    if (n === 2) {
      if (!form.companyName.trim()) { setError("Company name is required."); return; }
      if (!form.systemName.trim())  { setError("System name is required."); return; }
      if (!form.systemDescription.trim()) { setError("Please describe your AI system."); return; }
    }
    if (n === 3) {
      if (!form.aihcsResponse) { setError("Please answer the AIHCS policy question."); return; }
    }
    if (n === 4) {
      if (!form.industry) { setError("Please select your industry."); return; }
    }
    setError("");
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files);
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      return [...prev, ...selected.filter((f) => !existing.has(f.name))];
    });
    e.target.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.contactName.trim()) { setError("Your name is required."); return; }
    if (!form.contactEmail.trim()) { setError("Email address is required."); return; }
    if (!form.agreed) { setError("Please agree to the Terms of Service to continue."); return; }
    setError("");
    setLoading(true);
    setLoadingStep(0);

    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();

      const { companyName, systemName, systemDescription, aiType, decisionImpact,
               existingDocs, dataTypes, infrastructure, scaleEstimate,
               aihcsResponse, aihcsDetail, geography, usStates, industry,
               sectorRegs, additionalContext,
               contactName, contactTitle, contactEmail } = form;

      const payload = {
        companyName,
        systemName,
        systemDescription,
        aiType: aiType || "",
        decisionImpact: decisionImpact || "",
        existingDocs: Array.isArray(existingDocs) ? existingDocs.join(",") : "",
        dataTypes: Array.isArray(dataTypes) ? dataTypes.join(",") : "",
        infrastructure: infrastructure || "",
        scaleEstimate: scaleEstimate || "",
        aihcsResponse,
        aihcsDetail: aihcsDetail || "",
        geography: Array.isArray(geography) ? geography.join(",") : "",
        usStates: Array.isArray(usStates) ? usStates.join(",") : "",
        industry: industry || "",
        sectorRegs: Array.isArray(sectorRegs) ? sectorRegs.join(",") : "",
        additionalContext: additionalContext || "",
        contactName: contactName || "",
        contactTitle: contactTitle || "",
        contactEmail: contactEmail || "",
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
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

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
              Tell us what your AI system actually does — we map it against every applicable framework and identify specific gaps.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* ── PAGE 1 ── */}
            {page === 1 && (<>

            {/* Card 1 — Describe Your AI System */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">1</div>
                <div>
                  <p className="text-white font-semibold text-sm">Describe Your AI System</p>
                  <p className="text-slate-500 text-xs mt-0.5">Be specific — the more detail you provide, the more accurate your gap assessment will be.</p>
                </div>
              </div>
              <Input label="Company Name" required placeholder="e.g. Acme Corporation" value={form.companyName} onChange={set("companyName")} />
              <Input label="System Name" required placeholder="e.g. Customer Risk Analyzer, Clinical Document AI" value={form.systemName} onChange={set("systemName")} />
              <Textarea
                label="What does your AI system do?" required
                hint="Describe core functionality, purpose, who uses it, and what decisions or outputs it produces."
                placeholder="e.g. We built a SaaS platform that uses GPT-4 to analyze patient records, flag potential drug interactions, and generate clinical summary reports for physicians..."
                value={form.systemDescription} onChange={set("systemDescription")}
              />
              <SelectField
                label="Primary AI Technology"
                options={[
                  { value: "llm_api_openai",    label: "Third-party LLM API — OpenAI (GPT-4, etc.)" },
                  { value: "llm_api_claude",    label: "Third-party LLM API — Anthropic (Claude)" },
                  { value: "llm_api_gemini",    label: "Third-party LLM API — Google (Gemini)" },
                  { value: "llm_api_other",     label: "Third-party LLM API — Other provider" },
                  { value: "llm_hosted",        label: "Self-hosted / Open-source LLM (Llama, Mistral, etc.)" },
                  { value: "ml_classification", label: "ML Classification / Prediction model" },
                  { value: "ml_recommendation", label: "Recommendation / Ranking system" },
                  { value: "computer_vision",   label: "Computer Vision / Image analysis" },
                  { value: "nlp_custom",        label: "Custom NLP / Text processing" },
                  { value: "multiple",          label: "Multiple AI types combined" },
                  { value: "other",             label: "Other / Not sure" },
                ]}
                placeholder="Select the primary AI type..."
                value={form.aiType} onChange={set("aiType")}
              />
              <Textarea
                label="What decisions does the AI influence?"
                hint="Who is affected? Are decisions automated or human-reviewed?"
                placeholder="e.g. The AI generates loan approval recommendations. Human underwriters review all recommendations and make the final credit decision."
                value={form.decisionImpact} onChange={set("decisionImpact")}
              />
            </div>

            {/* Card 2 — Existing Documentation */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">2</div>
                <div>
                  <p className="text-white font-semibold text-sm">Existing Documentation</p>
                  <p className="text-slate-500 text-xs mt-0.5">What documentation already exists? Select all that apply, even if incomplete or informal.</p>
                </div>
              </div>
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

            {/* Page 1 nav */}
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-500 text-xs">Page 1 of 2</span>
              <button type="button" onClick={() => goTo(2)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
                Continue →
              </button>
            </div>

            </>)}

            {/* ── PAGE 2 ── */}
            {page === 2 && (<>

            {/* Card 3 — Data Your System Processes */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">3</div>
                <div>
                  <p className="text-white font-semibold text-sm">Data Your System Processes</p>
                  <p className="text-slate-500 text-xs mt-0.5">Select all categories your AI accesses, processes, stores, or transmits.</p>
                </div>
              </div>
              <CheckboxGrid
                options={[
                  { value: "personal_data",   label: "Personal / PII data" },
                  { value: "health_data",     label: "Health / Medical data (PHI)" },
                  { value: "financial_data",  label: "Financial / Payment data" },
                  { value: "biometric",       label: "Biometric data" },
                  { value: "children_data",   label: "Children's data (under 13/16)" },
                  { value: "employee_data",   label: "Employee / HR data" },
                  { value: "genetic_data",    label: "Genetic data" },
                  { value: "behavioral_data", label: "Behavioral / Profiling data" },
                  { value: "location_data",   label: "Location / Geolocation data" },
                  { value: "public_data",     label: "Publicly available data only" },
                  { value: "no_personal",     label: "No personal data" },
                ]}
                selected={form.dataTypes}
                onToggle={toggleArray("dataTypes")}
              />
            </div>

            {/* Card 4 — System Architecture & Infrastructure */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">4</div>
                <div>
                  <p className="text-white font-semibold text-sm">System Architecture &amp; Infrastructure</p>
                  <p className="text-slate-500 text-xs mt-0.5">How is your system built and deployed?</p>
                </div>
              </div>
              <Textarea
                label="Cloud / Infrastructure"
                hint="Where does the system run? Who hosts the data? Include cloud providers, integrations, third-party dependencies."
                placeholder="e.g. AWS (us-east-1) for compute and storage, Anthropic API for Claude model calls, Snowflake for analytics, Auth0 for authentication. All data at rest encrypted AES-256."
                value={form.infrastructure} onChange={set("infrastructure")}
              />
              <div>
                <label className="block text-slate-300 text-sm mb-2">Deployment Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "development", label: "Development / Pre-launch" },
                    { value: "pilot",       label: "Pilot / Limited users" },
                    { value: "production",  label: "Production / Live" },
                    { value: "enterprise",  label: "Enterprise / Large scale" },
                  ].map(({ value, label }) => {
                    const on = form.deploymentStage === value;
                    return (
                      <button key={value} type="button" onClick={() => setForm((f) => ({ ...f, deploymentStage: value }))}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                          on ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                        }`}>
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          on ? "border-indigo-500 bg-indigo-600" : "border-slate-600"
                        }`}>{on && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <SelectField
                label="Scale — approximate users / records processed"
                options={[
                  { value: "internal_only", label: "Internal use only (employees)" },
                  { value: "lt_1k",         label: "Fewer than 1,000 users" },
                  { value: "1k_10k",        label: "1,000 – 10,000 users" },
                  { value: "10k_100k",      label: "10,000 – 100,000 users" },
                  { value: "100k_1m",       label: "100,000 – 1 million users" },
                  { value: "gt_1m",         label: "Over 1 million users" },
                  { value: "unknown",       label: "Unknown / Not tracked" },
                ]}
                placeholder="Select scale..."
                value={form.scaleEstimate} onChange={set("scaleEstimate")}
              />
            </div>

            {/* Card 5 — Human-AI Interaction (AIHCS) */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">5</div>
                <div>
                  <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-1">AIHCS — Human AI Capital Standard</p>
                  <p className="text-white font-semibold text-sm">Human-AI Interaction</p>
                  <p className="text-slate-500 text-xs mt-0.5">How does your workforce actually use AI day to day? This dimension is assessed separately by the AIHCS framework.</p>
                </div>
              </div>
              <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-lg px-4 py-3 text-slate-300 text-xs leading-relaxed">
                <span className="text-indigo-400 font-semibold">Why this matters: </span>
                The AIHCS measures whether your workforce uses AI in ways that preserve human expertise and judgment — or whether AI dependency is eroding skills that make your organization valuable. No other compliance framework currently measures this.
              </div>
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Do you have policies or procedures governing how employees use AI at work? <span className="text-indigo-400">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: "yes_formal",   label: "Yes — formal written policies in place" },
                    { value: "yes_informal", label: "Yes — informal guidelines, but nothing formally documented" },
                    { value: "in_progress",  label: "In progress — currently developing policies" },
                    { value: "no",           label: "No — no AI usage policies for employees" },
                  ].map(({ value, label }) => {
                    const on = form.aihcsResponse === value;
                    return (
                      <button key={value} type="button" onClick={() => setForm((f) => ({ ...f, aihcsResponse: value }))}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                          on ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                        }`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          on ? "border-indigo-500 bg-indigo-600" : "border-slate-600"
                        }`}>{on && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <Textarea
                label="Describe your human-AI interaction practices (optional)"
                hint="How do employees use AI tools? Are outputs reviewed before use? Is there training on responsible AI? Any measurement of AI dependency?"
                placeholder="e.g. Employees use Claude and Copilot for drafting. All AI-generated content must be reviewed and approved by a human before sending to clients. We have no formal training or dependency measurement in place yet."
                value={form.aihcsDetail} onChange={set("aihcsDetail")}
              />
            </div>

            {/* Page 2 nav */}
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => goTo(1)}
                className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                ← Back
              </button>
              <span className="text-slate-500 text-xs">Page 2 of 3</span>
              <button type="button" onClick={() => goTo(3)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
                Continue →
              </button>
            </div>

            </>)}

            {/* ── PAGE 3 ── */}
            {page === 3 && (<>

            {/* Card 6 — Geographic Scope */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">6</div>
                <div>
                  <p className="text-white font-semibold text-sm">Geographic Scope</p>
                  <p className="text-slate-500 text-xs mt-0.5">Where does your organization operate and where are your users or data subjects located?</p>
                </div>
              </div>
              <CheckboxGrid
                options={[
                  { value: "united_states",    label: "United States" },
                  { value: "european_union",   label: "European Union" },
                  { value: "united_kingdom",   label: "United Kingdom" },
                  { value: "canada",           label: "Canada" },
                  { value: "australia",        label: "Australia / New Zealand" },
                  { value: "asia_pacific",     label: "Asia-Pacific" },
                  { value: "latin_america",    label: "Latin America" },
                  { value: "middle_east_africa", label: "Middle East / Africa" },
                  { value: "global",           label: "Global / Worldwide" },
                ]}
                selected={form.geography}
                onToggle={toggleArray("geography")}
              />
              {form.geography.includes("united_states") && (
                <div className="mt-2">
                  <p className="text-slate-300 text-sm font-medium mb-1">
                    Which U.S. states do you operate in or have users?
                    <span className="text-slate-500 font-normal"> — used to assess applicable state AI and privacy laws</span>
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {[
                      ["AL","Alabama"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],["CO","Colorado"],
                      ["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],["HI","Hawaii"],
                      ["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],["KS","Kansas"],["KY","Kentucky"],
                      ["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],["MA","Massachusetts"],["MI","Michigan"],
                      ["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],["MT","Montana"],["NE","Nebraska"],
                      ["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],["NY","New York"],["NC","North Carolina"],
                      ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
                      ["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],["VA","Virginia"],
                      ["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],["nationwide","All / Nationwide"],
                    ].map(([code, name]) => {
                      const on = form.usStates.includes(code);
                      return (
                        <button key={code} type="button" onClick={() => toggleArray("usStates")(code)}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                            on ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300" : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
                          }`}>
                          <div className={`w-3 h-3 rounded border-2 flex items-center justify-center shrink-0 ${
                            on ? "bg-indigo-600 border-indigo-600" : "border-slate-600"
                          }`}>{on && <span className="text-white text-[8px] font-bold">✓</span>}</div>
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Card 7 — Industry & Sector Regulations */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">7</div>
                <div>
                  <p className="text-white font-semibold text-sm">Industry &amp; Sector Regulations</p>
                  <p className="text-slate-500 text-xs mt-0.5">Your industry determines which sector-specific regulations apply to your AI system.</p>
                </div>
              </div>
              <SelectField
                label="Primary Industry" required
                options={[
                  { value: "healthcare",    label: "Healthcare / Life sciences / Pharma" },
                  { value: "financial",     label: "Financial services / Banking / Fintech" },
                  { value: "insurance",     label: "Insurance" },
                  { value: "legal",         label: "Legal / Legal technology" },
                  { value: "hr",            label: "HR / Recruiting / Employment" },
                  { value: "education",     label: "Education / EdTech" },
                  { value: "government",    label: "Government / Public sector" },
                  { value: "defense",       label: "Defense / Critical infrastructure" },
                  { value: "retail",        label: "E-commerce / Retail / Consumer" },
                  { value: "media",         label: "Media / Entertainment / Publishing" },
                  { value: "saas",          label: "SaaS / Technology / Software" },
                  { value: "manufacturing", label: "Manufacturing / Industrial" },
                  { value: "energy",        label: "Energy / Utilities" },
                  { value: "transportation",label: "Transportation / Logistics" },
                  { value: "real_estate",   label: "Real estate" },
                  { value: "other",         label: "Other" },
                ]}
                placeholder="Select your industry..."
                value={form.industry} onChange={set("industry")}
              />
              <div>
                <label className="block text-slate-300 text-sm mb-1">Applicable sector-specific regulations</label>
                <p className="text-slate-500 text-xs italic mb-2">Select all that currently apply or may apply.</p>
                <CheckboxGrid
                  options={[
                    { value: "hipaa",       label: "HIPAA (US healthcare)" },
                    { value: "21cfr11",     label: "21 CFR Part 11 (FDA regulated)" },
                    { value: "pci_dss",     label: "PCI DSS (payment cards)" },
                    { value: "sox",         label: "SOX (public company)" },
                    { value: "fedramp",     label: "FedRAMP / FISMA (government)" },
                    { value: "dora",        label: "DORA (EU financial)" },
                    { value: "gxp",         label: "GxP / GCP (clinical trials)" },
                    { value: "none_sector", label: "None of the above" },
                  ]}
                  selected={form.sectorRegs}
                  onToggle={toggleArray("sectorRegs")}
                />
              </div>
            </div>

            {/* Page 3 nav */}
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => goTo(2)}
                className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                ← Back
              </button>
              <span className="text-slate-500 text-xs">Page 3 of 4</span>
              <button type="button" onClick={() => goTo(4)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
                Continue →
              </button>
            </div>

            </>)}

            {/* ── PAGE 4 ── */}
            {page === 4 && (<>

            {/* Card 9 — Upload Supporting Documentation */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">9</div>
                <div>
                  <p className="text-white font-semibold text-sm">Upload Supporting Documentation</p>
                  <p className="text-slate-500 text-xs mt-0.5">Upload anything that helps us understand your system. The more context we have, the more precise your assessment.</p>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-300 text-xs leading-relaxed">
                <span className="text-white font-semibold">Upload anything relevant:</span> Architecture diagrams, existing policies, privacy notices, security docs, vendor agreements, product specs, slide decks, org charts — any format accepted. All files are handled confidentially.
              </div>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="text-3xl opacity-50">📁</span>
                <p className="text-slate-300 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-slate-500 text-xs">PDF, Word, Excel, PowerPoint, Images, Text — any format</p>
                <input
                  ref={fileRef} type="file" multiple className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.xlsx,.xls,.pptx,.csv,.json"
                  onChange={handleFileChange}
                />
              </div>
              {files.length > 0 && (
                <ul className="flex flex-col gap-1">
                  {files.map((f) => (
                    <li key={f.name} className="flex items-center justify-between text-xs text-slate-300 bg-slate-800 rounded-lg px-3 py-1.5">
                      <span>📄 {f.name} <span className="text-slate-500">({(f.size / 1024).toFixed(1)} KB)</span></span>
                      <button type="button" onClick={() => setFiles((prev) => prev.filter((x) => x.name !== f.name))} className="text-slate-500 hover:text-red-400 ml-3 cursor-pointer">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Card 10 — Contact Information */}
            <div className="bg-slate-900 rounded-2xl border border-slate-700/50 p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">10</div>
                <div>
                  <p className="text-white font-semibold text-sm">Contact Information</p>
                  <p className="text-slate-500 text-xs mt-0.5">Contact details for your assessment report and follow-up.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Your Name" required placeholder="Jane Smith" value={form.contactName} onChange={set("contactName")} />
                <Input label="Job Title" placeholder="Chief Technology Officer" value={form.contactTitle} onChange={set("contactTitle")} />
              </div>
              <Input label="Email Address" required type="email" placeholder="jane@example.com" value={form.contactEmail} onChange={set("contactEmail")} />
              <Textarea
                label="Anything else we should know? (optional)"
                hint="Specific concerns, compliance deadlines, recent audit findings, or context about your situation."
                placeholder="e.g. We have a SOC 2 audit scheduled in 90 days and need to understand our AI-specific gaps before then. We recently expanded to EU users and aren’t sure what EU AI Act obligations apply."
                value={form.additionalContext} onChange={set("additionalContext")}
              />
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-start gap-2">
                <span className="text-yellow-400 text-sm shrink-0">⚠️</span>
                <p className="text-yellow-200/80 text-xs leading-relaxed">
                  <span className="font-semibold">Important:</span> This is a high-level automated gap assessment only. It may miss critical gaps. You are fully responsible for final validation and compliance. Click "I Accept" to proceed at your own risk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, agreed: !f.agreed }))}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                  form.agreed ? "bg-indigo-600/20 border-indigo-500/60" : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  form.agreed ? "bg-indigo-600 border-indigo-600" : "border-slate-600"
                }`}>{form.agreed && <span className="text-white text-[10px] font-bold">✓</span>}</div>
                <span className="text-slate-300 text-xs leading-relaxed">
                  I Accept — I have read and agree to the{" "}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); setShowTerms(true); }}
                    onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), setShowTerms(true))}
                    className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                  >
                    Disclaimer and Terms &amp; Conditions
                  </span>
                  . I understand this assessment is confidential and I proceed at my own risk.
                </span>
              </button>
            </div>

            {/* Page 4 nav */}
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => goTo(3)}
                className="text-slate-400 hover:text-white text-sm transition-colors cursor-pointer">
                ← Back
              </button>
              <span className="text-slate-500 text-xs">Page 4 of 4</span>
              <button type="submit" disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer">
                {loading ? "Running Assessment…" : "Start Gap Assessment →"}
              </button>
            </div>

            </>)}

          </form>
        </div>
      </div>
    </div>
  );
}
