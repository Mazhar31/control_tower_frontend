const R = 80;
const CX = 110;
const CY = 100;
const MAX_DAYS = 90;

function polar(deg, r = R) {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arc(a1, a2, r = R) {
  const s = polar(a1, r), e = polar(a2, r);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

function getStatus(days) {
  if (days <= 0)  return { color: "#ef4444", label: "Overdue" };
  if (days <= 30) return { color: "#eab308", label: "Upcoming" };
  return { color: "#22c55e", label: "On Track" };
}

export default function AuditClockGauge({ daysRemaining, auditDate }) {
  if (daysRemaining === null || daysRemaining === undefined) {
    return (
      <div className="flex flex-col items-center gap-2">
        <svg width="220" height="115" viewBox="0 0 220 115">
          <path d={arc(0, 180)} fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="butt" />
        </svg>
        <p className="text-slate-400 text-[10px] tracking-widest uppercase">Audit Clock</p>
        <p className="text-2xl font-bold text-slate-600">—</p>
        <p className="text-slate-600 text-xs">No audit date set</p>
      </div>
    );
  }
  const clamped = Math.max(0, Math.min(daysRemaining, MAX_DAYS));
  const { color, label } = getStatus(daysRemaining);
  const angle = (clamped / MAX_DAYS) * 180;
  const tip = polar(angle, R - 8);
  const b1 = polar(angle - 90, 8);
  const b2 = polar(angle + 90, 8);

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="115" viewBox="0 0 220 115">
        <path d={arc(0, 180)} fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="butt" />
        <path d={arc(0, 180)} fill="none" stroke={color} strokeWidth="20" strokeLinecap="butt" opacity="0.9" />
        <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`} fill="#f1f5f9" opacity="0.95" />
        <circle cx={CX} cy={CY} r="6" fill="#f1f5f9" />
        {["0d", "45d", "90d"].map((t, i) => {
          const p = polar((i / 2) * 180, R + 14);
          return <text key={t} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#475569">{t}</text>;
        })}
      </svg>
      <p className="text-slate-400 text-[10px] tracking-widest uppercase">Audit Clock</p>
      <p className="text-3xl font-bold text-white mt-0.5">
        {daysRemaining <= 0 ? "Overdue" : `${daysRemaining}d`}
      </p>
      <p className="text-xs font-semibold mt-1" style={{ color }}>{label}</p>
      <p className="text-slate-400 text-[10px] mt-0.5">Due: {auditDate}</p>
    </div>
  );
}
