import React from 'react';
import {
  ScopingData,
  UserState,
  Stakeholder,
  StakeholderState,
  UserMode,
} from '../types/scoping';
import { getOpenQuestionsByOwner } from '../utils/scopingLogic';
import { Users, Mail, UserCheck, AlertCircle } from 'lucide-react';

interface StakeholdersScreenProps {
  data: ScopingData;
  userState: UserState;
  onUpdateStakeholderState: (role: string, patch: Partial<StakeholderState>) => void;
  userMode: UserMode;
  includeOutOfScope: boolean;
  onNavigateToOwnerQuestions?: (owner: string) => void;
}

export const StakeholdersScreen: React.FC<StakeholdersScreenProps> = ({
  data,
  userState,
  onUpdateStakeholderState,
  userMode,
  includeOutOfScope,
  onNavigateToOwnerQuestions,
}) => {
  const isReadOnly = userMode === 'respondent';

  // Open questions count by owner
  const ownerStats = getOpenQuestionsByOwner(
    data.questions,
    userState.questions,
    data.tagToUseCase,
    userState.useCases,
    includeOutOfScope
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1B998B] uppercase tracking-wider">
              Project Governance
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Steering Committee &amp; Working Team
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#14213D] dark:text-white mt-1">
            Stakeholder Directory &amp; Scoping Ownership
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Maintain contact and availability records for key Qualtrics EX and SAP SuccessFactors stakeholders.
            Where a stakeholder role maps to scoping questions, their live open question workload is highlighted.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
          <Users className="w-4 h-4 text-[#1B998B]" />
          <span>{data.stakeholders?.length || 0} Stakeholder Roles</span>
        </div>
      </div>

      {isReadOnly && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Client Respondent Mode active: Stakeholder directory is view-only. Switch to <strong>Consultant Mode</strong> to modify contacts.
          </span>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4 min-w-[180px]">Role / Project Function</th>
                <th className="py-3 px-4 min-w-[160px]">Assigned Contact Name</th>
                <th className="py-3 px-4 min-w-[160px]">Contact Email</th>
                <th className="py-3 px-4 min-w-[130px]">Availability</th>
                <th className="py-3 px-4 min-w-[150px]">Open Scoping Workload</th>
                <th className="py-3 px-4 min-w-[200px]">Why Needed in Scoping</th>
                <th className="py-3 px-4 min-w-[180px]">Governance Cadence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data.stakeholders || []).map((sh) => {
                const state: StakeholderState = userState.stakeholders[sh.role] || {
                  name: '',
                  email: '',
                  availability: 'Regular weekly',
                };

                const stats = ownerStats[sh.role];
                const hasStats = Boolean(stats);

                return (
                  <tr
                    key={sh.role}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Role */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#1B998B] shrink-0" />
                        <span>{sh.role}</span>
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={state.name}
                        onChange={(e) =>
                          onUpdateStakeholderState(sh.role, { name: e.target.value })
                        }
                        placeholder="e.g. Jane Doe"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 font-medium"
                      />
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4">
                      <input
                        type="email"
                        disabled={isReadOnly}
                        value={state.email}
                        onChange={(e) =>
                          onUpdateStakeholderState(sh.role, { email: e.target.value })
                        }
                        placeholder="name@company.com"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100"
                      />
                    </td>

                    {/* Availability */}
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={state.availability}
                        onChange={(e) =>
                          onUpdateStakeholderState(sh.role, {
                            availability: e.target.value,
                          })
                        }
                        placeholder="e.g. 2h/week, steering"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100"
                      />
                    </td>

                    {/* Open Workload Match */}
                    <td className="py-3.5 px-4">
                      {hasStats ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-mono text-xs">
                            <span
                              className={`font-bold ${
                                stats.open > 0 ? 'text-[#14213D] dark:text-white' : 'text-teal-600'
                              }`}
                            >
                              {stats.open} open
                            </span>
                            <span className="text-slate-400">/ {stats.total} total</span>
                          </div>

                          {stats.openP1 > 0 && (
                            <span className="inline-block text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950/60 px-1.5 py-0.2 rounded border border-red-200 dark:border-red-900 font-mono">
                              {stats.openP1} P1 blocking
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          No direct question owner match
                        </span>
                      )}
                    </td>

                    {/* Why Needed */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      {sh.why}
                    </td>

                    {/* Involvement */}
                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {sh.involvement}
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
