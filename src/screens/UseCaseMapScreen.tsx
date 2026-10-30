import React from 'react';
import {
  ScopingData,
  UserState,
  UseCase,
  UseCaseState,
  ScopeDecision,
  UserMode,
  UseCaseFit,
} from '../types/scoping';
import { Layers, CheckCircle, Info, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface UseCaseMapScreenProps {
  data: ScopingData;
  userState: UserState;
  onUpdateUseCaseState: (name: string, patch: Partial<UseCaseState>) => void;
  userMode: UserMode;
  includeOutOfScope: boolean;
  setIncludeOutOfScope: (val: boolean) => void;
}

export const UseCaseMapScreen: React.FC<UseCaseMapScreenProps> = ({
  data,
  userState,
  onUpdateUseCaseState,
  userMode,
  includeOutOfScope,
  setIncludeOutOfScope,
}) => {
  const isReadOnly = userMode === 'respondent';

  // Count Wave 1 use cases
  const wave1Count = (data.useCases || []).filter(
    (uc) => (userState.useCases[uc.name]?.scopeDecision || 'Wave 1 (go-live)') === 'Wave 1 (go-live)'
  ).length;

  const getFitStyle = (fit: UseCaseFit) => {
    switch (fit) {
      case 'High':
        return 'text-emerald-800 dark:text-lime-300 bg-lime-50 dark:bg-emerald-950/60 border-lime-300 dark:border-emerald-700 font-bold';
      case 'Medium-High':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'Medium':
        return 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
      case 'Low-Medium':
        return 'text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-800';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Out-of-Scope Global Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider">
              Scope Alignment
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Wave 1 Target Roadmap
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Experience Use Case Mapping &amp; Strategic Fit
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Decide which journey touchpoints launch in Wave 1 vs Phase 2. Questions mapped strictly to
            use cases marked &ldquo;Out of scope&rdquo; are dimmed and excluded from progress calculations.
          </p>
        </div>

        {/* Relevance rule toggle */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-slate-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-slate-200 dark:border-emerald-900/40">
          <label htmlFor="out-of-scope-toggle" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            Include out-of-scope questions
          </label>
          <input
            id="out-of-scope-toggle"
            type="checkbox"
            checked={includeOutOfScope}
            onChange={(e) => setIncludeOutOfScope(e.target.checked)}
            className="w-4 h-4 text-lime-600 rounded border-slate-300 focus:ring-lime-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Wave 1 Summary Strip with Lime to Green Gradient */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-lime-500/30 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-400/20 to-emerald-500/30 border border-lime-400/40 flex items-center justify-center text-lime-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-lime-400 font-bold">
              Wave 1 Go-Live Baseline
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {wave1Count} of {data.useCases?.length || 0} Use Cases Selected for Wave 1 Launch
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Target Delivery: 3–4 Months</span>
          <span className="text-slate-500">·</span>
          <span>Core System Integration Active</span>
        </div>
      </div>

      {isReadOnly && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Client Respondent Mode active: Scope decisions can only be edited in <strong>Consultant Mode</strong>.
          </span>
        </div>
      )}

      {/* Use Cases Cards Grid */}
      <div className="space-y-4">
        {(data.useCases || []).map((uc) => {
          const state: UseCaseState = userState.useCases[uc.name] || {
            scopeDecision: 'Wave 1 (go-live)',
            businessOwner: '',
            audience: '',
            annualVolume: '',
            comments: '',
          };

          const isOut = state.scopeDecision === 'Out of scope';

          return (
            <div
              key={uc.name}
              className={`p-5 rounded-xl bg-white dark:bg-[#111827] border transition-all ${
                isOut
                  ? 'opacity-60 border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 shadow-2xs'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {uc.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${getFitStyle(
                        uc.fit
                      )}`}
                    >
                      Fit: {uc.fit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {uc.covers}
                  </p>
                </div>

                {/* Scope Decision Dropdown */}
                <div className="shrink-0 flex items-center gap-2">
                  <label htmlFor={`scope-dec-${uc.name}`} className="sr-only">
                    Scope Decision for {uc.name}
                  </label>
                  <select
                    id={`scope-dec-${uc.name}`}
                    value={state.scopeDecision}
                    disabled={isReadOnly}
                    onChange={(e) =>
                      onUpdateUseCaseState(uc.name, {
                        scopeDecision: e.target.value as ScopeDecision,
                      })
                    }
                    className={`text-xs font-semibold py-1.5 px-3 rounded-lg border focus:ring-2 focus:ring-[#1B998B] focus:outline-none ${
                      state.scopeDecision === 'Wave 1 (go-live)'
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700'
                        : state.scopeDecision === 'Phase 2'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                        : state.scopeDecision === 'Out of scope'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                    }`}
                  >
                    <option value="Wave 1 (go-live)">Wave 1 (go-live)</option>
                    <option value="Phase 2">Phase 2</option>
                    <option value="Out of scope">Out of scope</option>
                    <option value="To discuss">To discuss</option>
                  </select>
                </div>
              </div>

              {/* Integration Touchpoints & Fit Rationale */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 text-xs border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                    SuccessFactors Trigger:
                  </span>
                  <span>{uc.sfTrigger}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                    Data Dependencies:
                  </span>
                  <span>{uc.dependsOn}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
                    Scoping Fit Rationale:
                  </span>
                  <span>{uc.fitReason}</span>
                </div>
              </div>

              {/* Editable Scope Attributes (Consultant Mode) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
                <div>
                  <label
                    htmlFor={`owner-${uc.name}`}
                    className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Business Owner
                  </label>
                  <input
                    id={`owner-${uc.name}`}
                    type="text"
                    disabled={isReadOnly}
                    value={state.businessOwner}
                    onChange={(e) =>
                      onUpdateUseCaseState(uc.name, { businessOwner: e.target.value })
                    }
                    placeholder="e.g. Head of Talent"
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`aud-${uc.name}`}
                    className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Target Audience
                  </label>
                  <input
                    id={`aud-${uc.name}`}
                    type="text"
                    disabled={isReadOnly}
                    value={state.audience}
                    onChange={(e) =>
                      onUpdateUseCaseState(uc.name, { audience: e.target.value })
                    }
                    placeholder="e.g. All regular salaried"
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`vol-${uc.name}`}
                    className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Estimated Annual Volume
                  </label>
                  <input
                    id={`vol-${uc.name}`}
                    type="text"
                    disabled={isReadOnly}
                    value={state.annualVolume}
                    onChange={(e) =>
                      onUpdateUseCaseState(uc.name, { annualVolume: e.target.value })
                    }
                    placeholder="e.g. 5,000 pulses/year"
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`notes-${uc.name}`}
                    className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                  >
                    Scope Comments &amp; Decisions
                  </label>
                  <input
                    id={`notes-${uc.name}`}
                    type="text"
                    disabled={isReadOnly}
                    value={state.comments}
                    onChange={(e) =>
                      onUpdateUseCaseState(uc.name, { comments: e.target.value })
                    }
                    placeholder="Specific pilot notes..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
