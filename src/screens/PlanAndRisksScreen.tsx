import React, { useState } from 'react';
import {
  ScopingData,
  UserState,
  PlanPhase,
  Risk,
  RiskState,
  PlanState,
  UserMode,
} from '../types/scoping';
import { calculateRiskScore } from '../utils/scopingLogic';
import {
  CalendarDays,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Flag,
} from 'lucide-react';

interface PlanAndRisksScreenProps {
  data: ScopingData;
  userState: UserState;
  onUpdatePlanState: (patch: Partial<PlanState>) => void;
  onUpdateRiskState: (riskIndex: string, patch: Partial<RiskState>) => void;
  userMode: UserMode;
}

export const PlanAndRisksScreen: React.FC<PlanAndRisksScreenProps> = ({
  data,
  userState,
  onUpdatePlanState,
  onUpdateRiskState,
  userMode,
}) => {
  const isReadOnly = userMode === 'respondent';
  const [selectedRiskIndex, setSelectedRiskIndex] = useState<number | null>(null);

  // Dates parsing
  const projectStartDateStr = userState.plan?.projectStart || data.meta?.projectStart || '2026-11-02';
  const holidayStartStr = userState.plan?.holidayStart || '2026-12-20';
  const holidayEndStr = userState.plan?.holidayEnd || '2027-01-03';

  const projectStartDate = new Date(projectStartDateStr);
  const holidayStartDate = new Date(holidayStartStr);
  const holidayEndDate = new Date(holidayEndStr);

  // Generate 16 weeks dates
  const weeks = Array.from({ length: 16 }, (_, i) => {
    const weekNum = i + 1;
    const start = new Date(projectStartDate);
    start.setDate(projectStartDate.getDate() + i * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // Check holiday overlap
    const isHoliday = start <= holidayEndDate && end >= holidayStartDate;

    return {
      weekNum,
      start,
      end,
      isHoliday,
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  // Calculate and sort risks
  const scoredRisks = (data.risks || []).map((r, idx) => {
    const state = userState.risks[idx.toString()];
    const l = state ? state.likelihood : r.likelihood;
    const i = state ? state.impact : r.impact;
    const { score, rating } = calculateRiskScore(l, i);
    return {
      index: idx,
      risk: r.risk,
      mitigation: r.mitigation,
      owner: r.owner,
      likelihood: l,
      impact: i,
      score,
      rating,
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* SECTION 1: 16-WEEK GANTT & ROADMAP */}
      <div className="space-y-4">
        {/* Header & Date Controls */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1B998B] uppercase tracking-wider">
                16-Week Delivery Schedule
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Qualtrics EX &amp; SAP SuccessFactors
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#14213D] dark:text-white mt-1">
              Project Delivery Gantt &amp; Blackout Windows
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              16-week delivery schedule from initial requirements to Wave 1 Go-Live.
              Holiday blackout periods shade overlapping weeks to prevent unrealistic survey launches.
            </p>
          </div>

          {/* Date Config Inputs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 text-xs">
            <div>
              <label
                htmlFor="proj-start-input"
                className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >
                Project Start:
              </label>
              <input
                id="proj-start-input"
                type="date"
                disabled={isReadOnly}
                value={projectStartDateStr}
                onChange={(e) => onUpdatePlanState({ projectStart: e.target.value })}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 font-mono text-xs"
              />
            </div>

            <div>
              <label
                htmlFor="holiday-start-input"
                className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >
                Holiday Start:
              </label>
              <input
                id="holiday-start-input"
                type="date"
                disabled={isReadOnly}
                value={holidayStartStr}
                onChange={(e) => onUpdatePlanState({ holidayStart: e.target.value })}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 font-mono text-xs"
              />
            </div>

            <div>
              <label
                htmlFor="holiday-end-input"
                className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >
                Holiday End:
              </label>
              <input
                id="holiday-end-input"
                type="date"
                disabled={isReadOnly}
                value={holidayEndStr}
                onChange={(e) => onUpdatePlanState({ holidayEnd: e.target.value })}
                className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 font-mono text-xs"
              />
            </div>
          </div>
        </div>

        {/* Gantt Chart Matrix */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-gradient-to-r from-lime-400 to-emerald-500" />
                Standard Implementation Phase
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-[#F2A541]" />
                Wave 1 Go-Live Phase
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-amber-100 dark:bg-amber-950/80 border border-amber-300" />
                Holiday Blackout Band
              </span>
            </div>
            <span className="text-slate-400 font-mono tabular-nums">
              16 Weeks Total Duration
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[840px] space-y-3">
              {/* Header row: Weeks and Dates */}
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
                className="gap-1 text-center font-mono text-[10px] pb-1 border-b border-slate-200 dark:border-slate-800"
              >
                {weeks.map((w) => (
                  <div
                    key={w.weekNum}
                    className={`py-1 px-0.5 rounded-md ${
                      w.isHoliday
                        ? 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div>W{w.weekNum}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{w.label}</div>
                  </div>
                ))}
              </div>

              {/* Phase Bars */}
              {(data.plan || []).map((p, idx) => {
                const isGoLive =
                  p.phase.toLowerCase().includes('go-live') ||
                  p.phase.toLowerCase().includes('launch');

                const startCol = Math.max(1, Math.min(16, p.startWeek));
                const endCol = Math.max(startCol, Math.min(16, p.endWeek));
                const span = endCol - startCol + 1;

                // Activities list
                const activities = Array.isArray(p.activities)
                  ? p.activities
                  : [p.activities];

                return (
                  <div key={idx} className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-2">
                        {isGoLive ? (
                          <Flag className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Layers className="w-3.5 h-3.5 text-[#1B998B]" />
                        )}
                        <span>{p.phase}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-normal">
                        Weeks {p.startWeek}–{p.endWeek}
                      </span>
                    </div>

                    {/* Gantt Bar Grid */}
                    <div
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
                      className="gap-1 h-8 items-center bg-slate-50 dark:bg-slate-900/50 rounded-lg p-1 border border-slate-100 dark:border-slate-800 relative"
                    >
                      {/* Holiday background overlays */}
                      {weeks.map((w, wIdx) => (
                        <div
                          key={wIdx}
                          className={`h-full rounded-xs ${
                            w.isHoliday
                              ? 'bg-amber-100/40 dark:bg-amber-950/30 border-x border-amber-200/50 dark:border-amber-800/30'
                              : ''
                          }`}
                        />
                      ))}

                      {/* Active Phase Bar */}
                      <div
                        style={{
                          gridColumnStart: startCol,
                          gridColumnEnd: `span ${span}`,
                        }}
                        className={`absolute inset-y-1 rounded-md px-2 flex items-center justify-between text-[11px] font-bold shadow-xs truncate transition-all ${
                          isGoLive
                            ? 'bg-[#F2A541] text-white hover:brightness-105'
                            : 'bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-950 font-extrabold hover:brightness-105'
                        }`}
                      >
                        <span className="truncate">{p.phase}</span>
                        <span className="font-mono text-[10px] ml-1 shrink-0 opacity-90">
                          {span}w
                        </span>
                      </div>
                    </div>

                    {/* Key Activities */}
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-500 dark:text-slate-400 pl-2">
                      {activities.map((act, aIdx) => (
                        <span
                          key={aIdx}
                          className="after:content-['·'] after:ml-1 last:after:content-['']"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 5x5 RISK HEAT MAP & RISK REGISTER */}
      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F2A541] uppercase tracking-wider">
                Risk Management
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                5x5 Severity Matrix (Score = Likelihood × Impact)
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#14213D] dark:text-white mt-1">
              Implementation Risk Register &amp; Heat Map
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              High: Score ≥ 15 (Critical escalations), Medium: 8–14 (Active mitigation required), Low: ≤ 7.
              Click any risk chip in the heat map to inspect and update its mitigation strategy.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-2.5 py-1.5 rounded-lg">
              {scoredRisks.filter((r) => r.rating === 'High').length} High Risks
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 px-2.5 py-1.5 rounded-lg">
              {scoredRisks.filter((r) => r.rating === 'Medium').length} Medium
            </span>
          </div>
        </div>

        {/* 5x5 Heat Map & Side Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 5x5 Matrix Grid (7 columns) */}
          <div className="lg:col-span-7 p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <span>5x5 Likelihood vs. Impact Heat Map</span>
              <span className="text-[10px] text-slate-400 normal-case">
                Y: Likelihood (1-5) · X: Impact (1-5)
              </span>
            </div>

            <div className="space-y-1">
              {/* Rows: Likelihood from 5 down to 1 */}
              {[5, 4, 3, 2, 1].map((likelihood) => (
                <div key={likelihood} className="flex items-center gap-1.5">
                  <div className="w-8 text-[11px] font-mono font-bold text-slate-500 text-right shrink-0">
                    L{likelihood}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 flex-1">
                    {[1, 2, 3, 4, 5].map((impact) => {
                      const score = likelihood * impact;
                      const inCellRisks = scoredRisks.filter(
                        (r) => r.likelihood === likelihood && r.impact === impact
                      );

                      let cellColor =
                        score >= 15
                          ? 'bg-red-500/20 border-red-400/40 text-red-950 dark:text-red-200'
                          : score >= 8
                          ? 'bg-amber-500/20 border-amber-400/40 text-amber-950 dark:text-amber-200'
                          : 'bg-emerald-500/15 border-emerald-400/30 text-emerald-950 dark:text-emerald-200';

                      return (
                        <div
                          key={impact}
                          className={`min-h-[52px] p-1 rounded-md border flex flex-col justify-between transition-colors ${cellColor}`}
                        >
                          <div className="text-[10px] font-mono text-slate-400 dark:text-slate-400 text-right leading-none">
                            {score}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {inCellRisks.map((r) => (
                              <button
                                key={r.index}
                                type="button"
                                onClick={() => setSelectedRiskIndex(r.index)}
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded shadow-2xs font-mono transition-transform hover:scale-105 ${
                                  selectedRiskIndex === r.index
                                    ? 'bg-slate-900 text-white ring-2 ring-white'
                                    : 'bg-white text-slate-900 border border-slate-300'
                                }`}
                                title={`[R${r.index + 1}] ${r.risk}`}
                              >
                                R{r.index + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* X-axis labels: Impact 1 to 5 */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="w-8 shrink-0" />
                <div className="grid grid-cols-5 gap-1.5 flex-1 text-center font-mono text-[10px] font-bold text-slate-500">
                  <div>I1 Negligible</div>
                  <div>I2 Minor</div>
                  <div>I3 Moderate</div>
                  <div>I4 Major</div>
                  <div>I5 Critical</div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Risk Card / Legend (5 columns) */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Risk Detail Inspector
            </h3>

            {selectedRiskIndex !== null ? (
              (() => {
                const r = scoredRisks.find((x) => x.index === selectedRiskIndex);
                if (!r) return null;

                return (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        Risk ID: R{r.index + 1}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          r.rating === 'High'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-300'
                            : r.rating === 'Medium'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                            : 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-300'
                        }`}
                      >
                        Score: {r.score} ({r.rating} Severity)
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {r.risk}
                    </h4>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Owner:
                        </span>
                        <span className="text-slate-600 dark:text-slate-400">{r.owner}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                          Mitigation Strategy:
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">
                          {r.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-6 text-center text-xs text-slate-500">
                Click any risk chip (e.g. <strong>R1</strong>) in the heat map or table below to inspect details.
              </div>
            )}
          </div>
        </div>

        {/* Risk Register Editable Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Full Risk Register (Sorted by Severity Score)
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {scoredRisks.length} Risks Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4 w-12 font-mono">ID</th>
                  <th className="py-3 px-4 min-w-[240px]">Risk Description</th>
                  <th className="py-3 px-4 min-w-[100px]">Likelihood (1–5)</th>
                  <th className="py-3 px-4 min-w-[100px]">Impact (1–5)</th>
                  <th className="py-3 px-4 min-w-[100px]">Score &amp; Rating</th>
                  <th className="py-3 px-4 min-w-[240px]">Mitigation Strategy</th>
                  <th className="py-3 px-4 min-w-[140px]">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scoredRisks.map((r) => {
                  return (
                    <tr
                      key={r.index}
                      onClick={() => setSelectedRiskIndex(r.index)}
                      className={`cursor-pointer transition-colors ${
                        selectedRiskIndex === r.index
                          ? 'bg-slate-100 dark:bg-slate-800/80'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">
                        R{r.index + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        {r.risk}
                      </td>

                      {/* Likelihood select */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <label htmlFor={`like-sel-${r.index}`} className="sr-only">Likelihood for R{r.index + 1}</label>
                        <select
                          id={`like-sel-${r.index}`}
                          disabled={isReadOnly}
                          value={r.likelihood}
                          onChange={(e) =>
                            onUpdateRiskState(r.index.toString(), {
                              likelihood: Number(e.target.value),
                            })
                          }
                          className="py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] font-mono text-xs"
                        >
                          <option value={1}>1 (Rare)</option>
                          <option value={2}>2 (Unlikely)</option>
                          <option value={3}>3 (Possible)</option>
                          <option value={4}>4 (Likely)</option>
                          <option value={5}>5 (Almost Certain)</option>
                        </select>
                      </td>

                      {/* Impact select */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <label htmlFor={`imp-sel-${r.index}`} className="sr-only">Impact for R{r.index + 1}</label>
                        <select
                          id={`imp-sel-${r.index}`}
                          disabled={isReadOnly}
                          value={r.impact}
                          onChange={(e) =>
                            onUpdateRiskState(r.index.toString(), {
                              impact: Number(e.target.value),
                            })
                          }
                          className="py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] font-mono text-xs"
                        >
                          <option value={1}>1 (Negligible)</option>
                          <option value={2}>2 (Minor)</option>
                          <option value={3}>3 (Moderate)</option>
                          <option value={4}>4 (Major)</option>
                          <option value={5}>5 (Critical)</option>
                        </select>
                      </td>

                      {/* Score & Rating */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${
                            r.rating === 'High'
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-300 dark:border-red-800'
                              : r.rating === 'Medium'
                              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                              : 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800'
                          }`}
                        >
                          {r.score} · {r.rating}
                        </span>
                      </td>

                      {/* Mitigation */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {r.mitigation}
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {r.owner}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
