const SEV_STYLE = {
  Critical: "bg-red-600/20 text-red-400 border border-red-500/40",
  High:     "bg-orange-500/20 text-orange-400 border border-orange-500/40",
  Medium:   "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40",
  Low:      "bg-green-500/20 text-green-400 border border-green-500/40",
};

function filename(path) {
  return path ? path.split("/").pop() : "—";
}

export default function GapTable({ gaps, activeFramework, resolvedIds = new Set(), onResolve }) {
  const isAll = activeFramework === "all";

  if (!gaps.length) {
    return (
      <div className="flex items-center justify-center h-24 text-slate-500 text-sm">
        No findings for this framework.
      </div>
    );
  }

  // Show resolved gaps at the bottom, dimmed
  const unresolved = gaps.filter((g) => !resolvedIds.has(g.finding_id));
  const resolved = gaps.filter((g) => resolvedIds.has(g.finding_id));
  const ordered = [...unresolved, ...resolved];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/60">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-700/60 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-800/40">
            <th className="px-3 py-2 font-medium whitespace-nowrap">Gap ID</th>
            <th className="px-3 py-2 font-medium">Title</th>
            <th className="px-3 py-2 font-medium whitespace-nowrap">Severity</th>
            {isAll
              ? <th className="px-3 py-2 font-medium">Frameworks</th>
              : <th className="px-3 py-2 font-medium whitespace-nowrap">Article / Clause</th>
            }
            <th className="px-3 py-2 font-medium whitespace-nowrap">Template</th>
            <th className="px-3 py-2 font-medium whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((gap) => {
            const isResolved = resolvedIds.has(gap.finding_id);
            const fwKeys = Object.keys(gap.framework_map ?? {});
            const crossCount = fwKeys.length;
            const clauses = !isAll && gap.framework_map?.[activeFramework]
              ? gap.framework_map[activeFramework].join(", ")
              : "—";

            return (
              <tr key={gap.finding_id} className={`border-b border-slate-700/40 transition-colors ${
                isResolved ? "opacity-40" : "hover:bg-slate-700/20"
              }`}>
                <td className={`px-3 py-2.5 font-mono text-slate-400 text-xs whitespace-nowrap ${isResolved ? "line-through" : ""}`}>{gap.finding_id}</td>
                <td className="px-3 py-2.5 max-w-[200px]">
                  <p className={`text-slate-200 font-medium text-xs ${isResolved ? "line-through" : ""}`}>{gap.title}</p>
                  {!isResolved && crossCount >= 3 && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                      ⚡ Closes gaps in {crossCount} frameworks
                    </span>
                  )}
                  {isResolved && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/20 text-green-400 border border-green-500/40">
                      ✓ Resolved
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isResolved ? "opacity-40" : ""} ${SEV_STYLE[gap.severity] ?? ""}`}>
                    {gap.severity}
                  </span>
                </td>
                {isAll ? (
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {fwKeys.map((fw) => (
                        <span key={fw} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                          {fw}
                        </span>
                      ))}
                    </div>
                  </td>
                ) : (
                  <td className="px-3 py-2.5 text-slate-300 text-xs whitespace-nowrap">{clauses}</td>
                )}
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-700/60 text-slate-300 border border-slate-600/40">
                    {filename(gap.remediation_template)}
                  </span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <button
                    onClick={() => onResolve(gap.finding_id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                      isResolved
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white"
                    }`}
                  >
                    {isResolved ? "Undo" : "Resolve"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
