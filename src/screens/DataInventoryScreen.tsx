import React from 'react';
import {
  ScopingData,
  UserState,
  DataField,
  DataFieldState,
  FieldECStatus,
  FieldApproval,
  FieldSensitivity,
  UserMode,
} from '../types/scoping';
import { Database, ShieldAlert, AlertCircle, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

interface DataInventoryScreenProps {
  data: ScopingData;
  userState: UserState;
  onUpdateDataFieldState: (attribute: string, patch: Partial<DataFieldState>) => void;
  userMode: UserMode;
}

export const DataInventoryScreen: React.FC<DataInventoryScreenProps> = ({
  data,
  userState,
  onUpdateDataFieldState,
  userMode,
}) => {
  const isReadOnly = userMode === 'respondent';

  // Calculate unapproved high-sensitivity fields count
  const unapprovedHighCount = (data.dataFields || []).filter((f) => {
    if (f.sensitivity !== 'High') return false;
    const approval = userState.dataFields[f.attribute]?.approvedToShare || 'Pending legal review';
    return approval !== 'Yes';
  }).length;

  const totalHighCount = (data.dataFields || []).filter((f) => f.sensitivity === 'High').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1B998B] uppercase tracking-wider">
              Data Governance &amp; Privacy
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Employee Central Master Attributes
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#14213D] dark:text-white mt-1">
            Data Inventory &amp; Employee Directory Schema
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Inventory participant attributes sourced from SAP Employee Central (EC) for Qualtrics EX reporting,
            demographic slicing, and hierarchy construction. Track availability, quality, and legal data sharing approval.
          </p>
        </div>

        {/* Counter Pill/Card */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`px-4 py-2.5 rounded-lg border flex items-center gap-2.5 ${
              unapprovedHighCount > 0
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
                : 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200'
            }`}
          >
            {unapprovedHighCount > 0 ? (
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
            )}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider">
                High-Sensitivity Legal Review
              </div>
              <div className="text-xs font-bold font-mono tabular-nums">
                {unapprovedHighCount > 0
                  ? `${unapprovedHighCount} not yet approved`
                  : `All ${totalHighCount} approved`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReadOnly && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Client Respondent Mode active: Data inventory attributes are view-only. Switch to <strong>Consultant Mode</strong> to modify approvals or ratings.
          </span>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-semibold">
                <th className="py-3 px-4 min-w-[170px]">Attribute Name</th>
                <th className="py-3 px-4 min-w-[120px]">EC Area</th>
                <th className="py-3 px-4 min-w-[100px]">Sensitivity</th>
                <th className="py-3 px-4 min-w-[130px]">Available in EC?</th>
                <th className="py-3 px-4 min-w-[120px]">Data Quality (1–5)</th>
                <th className="py-3 px-4 min-w-[160px]">Approved to Share?</th>
                <th className="py-3 px-4 min-w-[180px]">Needed For / Purpose</th>
                <th className="py-3 px-4 min-w-[160px]">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data.dataFields || []).map((f) => {
                const state: DataFieldState = userState.dataFields[f.attribute] || {
                  availableInEC: 'Yes',
                  quality: 4,
                  approvedToShare: f.sensitivity === 'High' ? 'Pending legal review' : 'Yes',
                  notes: '',
                };

                const isHigh = f.sensitivity === 'High';
                const isPending = state.approvedToShare !== 'Yes';

                return (
                  <tr
                    key={f.attribute}
                    className={`transition-colors ${
                      isHigh
                        ? 'bg-amber-50/30 dark:bg-amber-950/15 hover:bg-amber-50/60 dark:hover:bg-amber-950/25'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Attribute */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {isHigh && (
                          <span title="High Sensitivity Attribute">
                            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                          </span>
                        )}
                        <span>{f.attribute}</span>
                      </div>
                    </td>

                    {/* EC Area */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {f.ecArea}
                    </td>

                    {/* Sensitivity Chip */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border ${
                          f.sensitivity === 'High'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300 border-red-200 dark:border-red-900'
                            : f.sensitivity === 'Medium'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {f.sensitivity}
                      </span>
                    </td>

                    {/* Available in EC Select */}
                    <td className="py-3.5 px-4">
                      <label htmlFor={`ec-avail-${f.attribute}`} className="sr-only">
                        EC availability for {f.attribute}
                      </label>
                      <select
                        id={`ec-avail-${f.attribute}`}
                        disabled={isReadOnly}
                        value={state.availableInEC}
                        onChange={(e) =>
                          onUpdateDataFieldState(f.attribute, {
                            availableInEC: e.target.value as FieldECStatus,
                          })
                        }
                        className="text-xs py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-800 dark:text-slate-200 font-medium focus:ring-1 focus:ring-[#1B998B]"
                      >
                        <option value="Yes">Yes</option>
                        <option value="Partly">Partly</option>
                        <option value="No">No</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </td>

                    {/* Quality 1 to 5 */}
                    <td className="py-3.5 px-4">
                      <label htmlFor={`quality-${f.attribute}`} className="sr-only">
                        Data quality rating for {f.attribute}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <select
                          id={`quality-${f.attribute}`}
                          disabled={isReadOnly}
                          value={state.quality}
                          onChange={(e) =>
                            onUpdateDataFieldState(f.attribute, {
                              quality: Number(e.target.value),
                            })
                          }
                          className="text-xs py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-800 dark:text-slate-200 font-mono"
                        >
                          <option value={1}>1 / 5 (Poor)</option>
                          <option value={2}>2 / 5 (Fair)</option>
                          <option value={3}>3 / 5 (Good)</option>
                          <option value={4}>4 / 5 (Very Good)</option>
                          <option value={5}>5 / 5 (Excellent)</option>
                        </select>
                      </div>
                    </td>

                    {/* Approved to Share */}
                    <td className="py-3.5 px-4">
                      <label htmlFor={`approved-${f.attribute}`} className="sr-only">
                        Approval to share for {f.attribute}
                      </label>
                      <select
                        id={`approved-${f.attribute}`}
                        disabled={isReadOnly}
                        value={state.approvedToShare}
                        onChange={(e) =>
                          onUpdateDataFieldState(f.attribute, {
                            approvedToShare: e.target.value as FieldApproval,
                          })
                        }
                        className={`text-xs font-semibold py-1 px-2 rounded-md border focus:ring-1 focus:ring-[#1B998B] ${
                          state.approvedToShare === 'Yes'
                            ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-200 border-teal-200 dark:border-teal-800'
                            : state.approvedToShare === 'Pending legal review'
                            ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                            : 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-200 border-red-200 dark:border-red-800'
                        }`}
                      >
                        <option value="Yes">Yes (Approved)</option>
                        <option value="Pending legal review">Pending legal review</option>
                        <option value="No">No (Blocked)</option>
                      </select>
                    </td>

                    {/* Needed For & Purpose */}
                    <td className="py-3.5 px-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{f.neededFor}</div>
                      <div className="text-[11px] text-slate-500">{f.purpose}</div>
                    </td>

                    {/* Notes */}
                    <td className="py-3.5 px-4">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={state.notes}
                        onChange={(e) =>
                          onUpdateDataFieldState(f.attribute, { notes: e.target.value })
                        }
                        placeholder="Privacy notes..."
                        className="w-full text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100"
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
