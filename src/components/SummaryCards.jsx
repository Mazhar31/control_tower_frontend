export default function SummaryCards({ counts, openCount, frameworksAtRisk, trend, auditDays }) {
  const cards = [
    {
      label: "Critical Gaps",
      value: counts.critical,
      valueColor: "text-red-400",
      sub: "Immediate action required",
      icon: "⛔",
    },
    {
      label: "High Severity",
      value: counts.high,
      valueColor: "text-yellow-400",
      sub: "Needs prompt attention",
      icon: "⚠️",
    },
    {
      label: "Total Open Gaps",
      value: openCount,
      valueColor: "text-slate-200",
      sub: `${counts.medium} medium · ${counts.low} low`,
      icon: "📋",
    },
    {
      label: "Compliance Trend",
      value: trend > 0 ? `+${trend}%` : trend < 0 ? `${trend}%` : "—",
      valueColor: trend > 0 ? "text-green-400" : trend < 0 ? "text-red-400" : "text-yellow-400",
      sub: "vs. last 30 days",
      icon: trend > 0 ? "📈" : trend < 0 ? "📉" : "➡️",
    },
    {
      label: "Audit Countdown",
      value: auditDays <= 0 ? "Overdue" : `${auditDays}d`,
      valueColor: auditDays <= 0 ? "text-red-400" : auditDays <= 30 ? "text-yellow-400" : "text-green-400",
      sub: auditDays <= 0 ? "Past due date" : auditDays <= 30 ? "Upcoming soon" : "On track",
      icon: "🗓️",
    },
    {
      label: "Frameworks at Risk",
      value: null,
      pills: frameworksAtRisk,
      sub: `${frameworksAtRisk.length} of 3 frameworks`,
      icon: "🏛️",
    },
  ];

  return (
    <div className="grid grid-cols-6 gap-3 px-4 py-3 border-b border-slate-700/50 shrink-0">
      {cards.map((c) => (
        <div key={c.label} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/40 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{c.icon}</span>
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">{c.label}</span>
          </div>
          {c.value !== null ? (
            <p className={`text-xl font-bold ${c.valueColor}`}>{c.value}</p>
          ) : (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {c.pills.map((p) => (
                <span key={p} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-500/20 text-red-400 border border-red-500/30">{p}</span>
              ))}
            </div>
          )}
          <p className="text-slate-500 text-[10px]">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
