export default function TrendGauge({ trend, period }) {
  const isPositive = trend > 0;
  const isNeutral = trend === null || trend === undefined;

  const color = isNeutral ? "#94a3b8" : isPositive ? "#22c55e" : "#ef4444";
  const icon = isNeutral ? "➡️" : isPositive ? "📈" : "📉";
  const label = isNeutral ? "No prior data" : isPositive ? `+${trend}% improvement` : `${trend}% decline`;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-4xl">{icon}</span>
      <p className="text-slate-400 text-[10px] tracking-widest uppercase">Compliance Trend</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {isNeutral ? "—" : `${trend > 0 ? "+" : ""}${trend}%`}
      </p>
      <p className="text-xs font-medium" style={{ color }}>{label}</p>
      {period && <p className="text-slate-500 text-[10px]">vs. {period}</p>}
    </div>
  );
}
