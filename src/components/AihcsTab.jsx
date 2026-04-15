const LABEL_MAP = {
  // real response keys
  control_01_human_oversight_policy:  "Human Oversight Policy",
  control_02_ai_risk_management:      "AI Risk Management",
  control_03_roles_responsibilities:  "Roles & Responsibilities",
  control_04_output_review_procedure: "Output Review Procedure",
  control_05_change_management:       "Change Management",
  control_06_employee_guidelines:     "Employee AI Guidelines",
  control_07_competency_assessment:   "Competency Assessment",
  control_08_audit_monitoring:        "Audit & Monitoring",
  control_09_financial_controls:      "Financial Controls",
  control_10_dependency_measurement:  "AI Dependency Measurement",
  has_ai_usage_policy:                "AI Usage Policy",
  // mock / legacy keys
  employee_ai_training:               "Employee AI Training",
  ai_output_review_process:           "AI Output Review Process",
  dependency_risk_assessed:           "Dependency Risk Assessed",
};

export default function AihcsTab({ controls }) {
  if (!controls) return <p className="text-slate-500 text-sm p-4">No AIHCS controls data available.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/60">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-700/60 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
            <th className="px-4 py-2 font-medium">Control</th>
            <th className="px-4 py-2 font-medium">Status</th>
            <th className="px-4 py-2 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(controls).map(([key, value]) => (
            <tr key={key} className="border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors">
              <td className="px-4 py-3 text-slate-200 font-medium text-xs">
                {LABEL_MAP[key] ?? key}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {value ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                    ✓ Pass
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                    ✗ Fail
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-xs">
                {!value && (
                  <span className="text-amber-400">
                    Evidence required — remediation guidance available on request.
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
