import React from 'react';
import {
  ScopingData,
  UserState,
  SFModule,
  SFModuleState,
  ModuleInScope,
  UserMode,
} from '../types/scoping';
import { Cpu, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface SFModuleReadinessScreenProps {
  data: ScopingData;
  userState: UserState;
  onUpdateSFModuleState: (module: string, patch: Partial<SFModuleState>) => void;
  userMode: UserMode;
}

export const SFModuleReadinessScreen: React.FC<SFModuleReadinessScreenProps> = ({
  data,
  userState,
  onUpdateSFModuleState,
  userMode,
}) => {
  const isReadOnly = userMode === 'respondent';

  // Counts of modules in scope
  const inScopeCount = (data.sfModules || []).filter(
    (m) => (userState.sfModules[m.module]?.inScope || 'Yes') === 'Yes'
  ).length;

  const missingDateCount = (data.sfModules || []).filter((m) => {
    const planned = userState.sfModules[m.module]?.plannedGoLive?.trim();
    return !planned;
  }).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1B998B] uppercase tracking-wider">
              System Architecture
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              SAP SuccessFactors Ecosystem
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#14213D] dark:text-white mt-1">
            SAP SuccessFactors Module Readiness
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Track module dependencies for Qualtrics EX touchpoints. Employee Central (EC) and Performance &amp; Goals
            (PMGM) are already live; assess readiness and go-live schedules for Recruiting (RCM), Onboarding (ONB), and LMS.
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200">
            <div className="text-[10px] uppercase font-bold tracking-wider">In-Scope Modules</div>
            <div className="text-lg font-mono font-bold">{inScopeCount} of {data.sfModules?.length || 0}</div>
          </div>

          {missingDateCount > 0 && (
            <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
              <div className="text-[10px] uppercase font-bold tracking-wider">Dates Needed</div>
              <div className="text-lg font-mono font-bold">{missingDateCount} pending</div>
            </div>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Client Respondent Mode active: SAP Module readiness is view-only. Switch to <strong>Consultant Mode</strong> to edit.
          </span>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4 min-w-[160px]">SuccessFactors Module</th>
                <th className="py-3 px-4 min-w-[120px]">Live Status</th>
                <th className="py-3 px-4 min-w-[130px]">In Scope?</th>
                <th className="py-3 px-4 min-w-[150px]">Planned Go-Live</th>
                <th className="py-3 px-4 min-w-[200px]">EX Relevance &amp; Trigger</th>
                <th className="py-3 px-4 min-w-[200px]">Key Architecture Question</th>
                <th className="py-3 px-4 min-w-[180px]">Consultant Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data.sfModules || []).map((m) => {
                const state: SFModuleState = userState.sfModules[m.module] || {
                  status: m.status,
                  plannedGoLive: m.status.toLowerCase().includes('live') ? 'Already Live' : '',
                  inScope: m.status.toLowerCase().includes('live') ? 'Yes' : 'Phase 2',
                  notes: '',
                };

                const isLive = m.status.toLowerCase().includes('live');
                const hasNoDate = !state.plannedGoLive?.trim() && !isLive;

                return (
                  <tr
                    key={m.module}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Module Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#1B998B] shrink-0" />
                        <span>{m.module}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          isLive
                            ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isLive ? <CheckCircle2 className="w-3 h-3 text-[#1B998B]" /> : <Clock className="w-3 h-3" />}
                        {m.status}
                      </span>
                    </td>

                    {/* In Scope Select */}
                    <td className="py-3.5 px-4">
                      <label htmlFor={`in-scope-${m.module}`} className="sr-only">
                        In Scope status for {m.module}
                      </label>
                      <select
                        id={`in-scope-${m.module}`}
                        disabled={isReadOnly}
                        value={state.inScope}
                        onChange={(e) =>
                          onUpdateSFModuleState(m.module, {
                            inScope: e.target.value as ModuleInScope,
                          })
                        }
                        className={`text-xs font-semibold py-1 px-2 rounded-md border focus:ring-1 focus:ring-[#1B998B] ${
                          state.inScope === 'Yes'
                            ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/50 dark:text-teal-200 border-teal-200 dark:border-teal-800'
                            : state.inScope === 'Phase 2'
                            ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200 border-blue-200 dark:border-blue-800'
                            : state.inScope === 'No'
                            ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                            : 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        <option value="Yes">Yes (In Scope)</option>
                        <option value="Phase 2">Phase 2</option>
                        <option value="To discuss">To discuss</option>
                        <option value="No">No</option>
                      </select>
                    </td>

                    {/* Planned Go-Live */}
                    <td className="py-3.5 px-4">
                      {isLive ? (
                        <span className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                          Active &amp; Operational
                        </span>
                      ) : (
                        <div className="space-y-1">
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={state.plannedGoLive}
                            onChange={(e) =>
                              onUpdateSFModuleState(m.module, {
                                plannedGoLive: e.target.value,
                              })
                            }
                            placeholder="YYYY-MM-DD or Quarter"
                            className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 font-mono"
                          />
                          {hasNoDate && (
                            <span className="inline-block text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                              Date needed
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* EX Relevance & Trigger */}
                    <td className="py-3.5 px-4 space-y-1 text-slate-600 dark:text-slate-400">
                      <p className="line-clamp-2">{m.exRelevance}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        Trigger: {m.dataTrigger}
                      </p>
                    </td>

                    {/* Key Architecture Question */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 italic">
                      {m.confirmQuestion}
                    </td>

                    {/* Consultant Notes */}
                    <td className="py-3.5 px-4">
                      <textarea
                        rows={2}
                        disabled={isReadOnly}
                        value={state.notes}
                        onChange={(e) =>
                          onUpdateSFModuleState(m.module, { notes: e.target.value })
                        }
                        placeholder="Add module notes..."
                        className="w-full text-xs p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
