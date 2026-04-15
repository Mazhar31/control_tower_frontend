const R = 80, CX = 110, CY = 100;

function polar(deg, r = R) {
  const rad = ((deg - 180) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function arc(a1, a2, r = R) {
  const s = polar(a1, r), e = polar(a2, r);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

function scoreColor(score) {
  if (score < 50) return "#ef4444";
  if (score < 75) return "#eab308";
  return "#22c55e";
}

function scoreLabel(score) {
  if (score < 50) return "At Risk";
  if (score < 75) return "Needs Attention";
  return "Compliant";
}

export default function ComplianceGauge({ score }) {
  const color = scoreColor(score);
  const angle = (score / 100) * 180;
  const tip = polar(angle, R - 8);
  const b1 = polar(angle - 90, 8);
  const b2 = polar(angle + 90, 8);

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="115" viewBox="0 0 220 115">
        <path d={arc(0, 180)} fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="butt" />
        <path d={arc(0, angle)} fill="none" stroke={color} strokeWidth="20" strokeLinecap="butt" opacity="0.9" />
        <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`} fill="#f1f5f9" opacity="0.95" />
        <circle cx={CX} cy={CY} r="6" fill="#f1f5f9" />
        {[0, 50, 100].map((v) => {
          const p = polar((v / 100) * 180, R + 14);
          return <text key={v} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#475569">{v}</text>;
        })}
      </svg>
      <p className="text-slate-400 text-[10px] tracking-widest uppercase">Compliance Score</p>
      <p className="text-3xl font-bold text-white mt-0.5">{score}%</p>
      <p className="text-xs font-semibold mt-1" style={{ color }}>{scoreLabel(score)}</p>
    </div>
  );
}
