export default function FrameworkBreakdown({ frameworksTriggered, frameworkCoverage, activeTab, onTabChange }) {
  if (!frameworksTriggered?.length) return null;

  function pct(fw) {
    return frameworkCoverage?.[fw]?.pct_compliant ?? null;
  }

  function dotColor(p) {
    if (p === null) return "bg-slate-500";
    if (p < 50) return "bg-red-500";
    if (p < 75) return "bg-yellow-400";
    return "bg-green-500";
  }

  function pillClass(active) {
    return `flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
      active
        ? "bg-slate-700 border-slate-500 text-white"
        : "bg-slate-900/40 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:border-slate-600"
    }`;
  }

  const showAihcs = frameworksTriggered.includes("AIHCS");

  return (
    <div className="px-4 py-2.5 border-b border-slate-700/50 shrink-0">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => onTabChange("all")} className={pillClass(activeTab === "all")}>
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          All Frameworks
        </button>

        {frameworksTriggered.filter((fw) => fw !== "AIHCS").map((fw) => {
          const p = pct(fw);
          return (
            <button key={fw} onClick={() => onTabChange(fw)} className={pillClass(activeTab === fw)}>
              <span className={`w-2 h-2 rounded-full ${dotColor(p)}`} />
              {fw}
              {p !== null && (
                <span className={`text-[10px] font-bold ${
                  activeTab === fw
                    ? p < 50 ? "text-red-400" : p < 75 ? "text-yellow-400" : "text-green-400"
                    : "text-slate-500"
                }`}>
                  {p}%
                </span>
              )}
            </button>
          );
        })}

        {showAihcs && (
          <button onClick={() => onTabChange("AIHCS")} className={pillClass(activeTab === "AIHCS")}>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            AIHCS
          </button>
        )}
      </div>
    </div>
  );
}
