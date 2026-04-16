import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockLeashResponse } from "../data/mockData";
import client from "../api/client";
import ComplianceGauge from "./ComplianceGauge";
import AuditClockGauge from "./AuditClockGauge";
import TrendGauge from "./TrendGauge";
import FrameworkBreakdown from "./FrameworkBreakdown";
import GapTable from "./GapTable";
import AihcsTab from "./AihcsTab";

const IS_DEV = import.meta.env.DEV;
const AUDIT_DAYS = 47;
const AUDIT_DATE = "Jun 15, 2026";

export default function Dashboard() {
  const { user, logout, assessment: ctxAssessment, assessmentId: ctxId } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [resolvedIds, setResolvedIds] = useState(new Set());

  function toggleResolved(id) {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  useEffect(() => {
    async function load() {
      // If we have the assessment in context and it matches the route id, use it
      if (ctxAssessment && (!id || String(ctxId) === String(id))) {
        setData(ctxAssessment);
        setLoading(false);
        return;
      }
      // Otherwise fetch from backend
      if (id) {
        try {
          const { data: json } = await client.get(`/assess/${id}`);
          setData(json.result);
        } catch {
          if (IS_DEV) {
            setData(mockLeashResponse);
          } else {
            setError("Could not load assessment.");
          }
        }
      } else if (IS_DEV) {
        setData(mockLeashResponse);
      } else {
        navigate("/intake");
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading assessment…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm">{error || "No assessment data found."}</p>
        <button onClick={() => navigate("/intake")} className="text-indigo-400 hover:text-indigo-300 text-sm cursor-pointer">
          Start New Assessment
        </button>
      </div>
    );
  }

  // Derived values
  const coverage = data.framework_coverage ?? {};
  const gaps = data.gap_findings ?? [];
  const openGaps = gaps.filter((g) => !resolvedIds.has(g.finding_id));

  // Recalculate compliance score based on resolved gaps
  const totalGaps = gaps.length;
  const resolvedCount = resolvedIds.size;
  const baseScore = Object.values(coverage).length
    ? Math.round(
        Object.values(coverage)
          .filter((v) => typeof v.pct_compliant === "number")
          .reduce((sum, v, _, arr) => sum + v.pct_compliant / arr.length, 0)
      )
    : 0;
  const complianceScore = totalGaps > 0
    ? Math.min(100, Math.round(baseScore + (resolvedCount / totalGaps) * (100 - baseScore)))
    : baseScore;

  const visibleGaps = activeTab === "all"
    ? gaps
    : activeTab === "AIHCS"
    ? []
    : gaps.filter((g) => g.framework_map && activeTab in g.framework_map);

  // Trend: compare with prior assessment score if available
  const priorScore = null; // placeholder — extend when history comparison is needed
  const trend = priorScore !== null ? complianceScore - priorScore : null;

  const tabPct = activeTab !== "all" && activeTab !== "AIHCS"
    ? coverage[activeTab]?.pct_compliant ?? null
    : null;

  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-white flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight">TAIGA Executive Dashboard</h1>
          <p className="text-slate-500 text-[11px] mt-0.5">
            {data.company_name} · {data.system_name} · Risk Tier:{" "}
            <span className={
              data.risk_tier === "Critical" ? "text-red-400" :
              data.risk_tier === "High" ? "text-orange-400" :
              data.risk_tier === "Medium" ? "text-yellow-400" : "text-green-400"
            }>{data.risk_tier}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-400">Live</span>
          </div>
          {data.report_url && (
            <a
              href={data.report_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
            >
              ⬇ Download Report
            </a>
          )}
          {user && (
            <>
              <span className="text-slate-400 text-xs">
                Hi, <span className="text-white font-medium">{user.name}</span>
              </span>
              <button
                onClick={() => navigate("/intake")}
                className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors cursor-pointer"
              >
                New Assessment
              </button>
              <button
                onClick={() => navigate("/history")}
                className="text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
              >
                History
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="text-slate-400 hover:text-slate-200 text-xs transition-colors cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="text-slate-500 hover:text-slate-300 text-xs transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

        {/* Three gauges */}
        <div className="grid grid-cols-3 divide-x divide-slate-700/50 border-b border-slate-700/50 shrink-0">
          <div className="flex flex-col items-center py-4 bg-slate-900/60">
            <AuditClockGauge daysRemaining={AUDIT_DAYS} auditDate={AUDIT_DATE} />
          </div>
          <div className="flex flex-col items-center py-4 bg-slate-900">
            <ComplianceGauge score={complianceScore} />
          </div>
          <div className="flex flex-col items-center py-4 bg-slate-900/60">
            <TrendGauge trend={trend} period="prior assessment" />
          </div>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-5 divide-x divide-slate-700/50 border-b border-slate-700/50 shrink-0">
          {[
            { label: "High Severity",   value: openGaps.filter(g => g.severity === "High").length,     color: "text-orange-400" },
            { label: "Medium Severity", value: openGaps.filter(g => g.severity === "Medium").length,   color: "text-yellow-400" },
            { label: "Low Severity",    value: openGaps.filter(g => g.severity === "Low").length,      color: "text-green-400"  },
            { label: "Total Open",      value: openGaps.length,                                        color: "text-slate-200"  },
            { label: "Critical",        value: openGaps.filter(g => g.severity === "Critical").length, color: "text-red-400"    },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center justify-center py-3 bg-slate-900/40">
              <p className={`text-2xl font-bold ${color}`}>{value ?? 0}</p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Framework tabs */}
        <FrameworkBreakdown
          frameworksTriggered={data.frameworks_triggered ?? []}
          frameworkCoverage={coverage}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Gap table area */}
        <div className="flex-1 min-h-0 flex flex-col px-4 py-3 overflow-hidden bg-slate-900/20">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              {activeTab === "all" ? "All Frameworks" : activeTab === "AIHCS" ? "AIHCS Controls" : `${activeTab} — Gaps`}
              {tabPct !== null && (
                <span className={`text-sm font-bold ${
                  tabPct < 50 ? "text-red-400" : tabPct < 75 ? "text-yellow-400" : "text-green-400"
                }`}>
                  {tabPct}% compliant
                </span>
              )}
            </h2>
            {activeTab !== "AIHCS" && (
              <span className="text-[11px] text-slate-500">
                {visibleGaps.length} finding{visibleGaps.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {activeTab === "AIHCS" ? (
              <AihcsTab controls={data.shelby_controls} />
            ) : (
              <GapTable gaps={visibleGaps} activeFramework={activeTab} resolvedIds={resolvedIds} onResolve={toggleResolved} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
