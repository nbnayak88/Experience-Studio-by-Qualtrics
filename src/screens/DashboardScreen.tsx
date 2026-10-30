import React from 'react';
import {
  ScopingData,
  UserState,
  Question,
  UserMode,
} from '../types/scoping';
import {
  calculateDashboardMetrics,
  calculateReadinessGates,
  calculateSectionProgress,
  getNextBestQuestions,
  getOpenQuestionsByOwner,
} from '../utils/scopingLogic';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Compass,
} from 'lucide-react';

interface DashboardScreenProps {
  data: ScopingData;
  userState: UserState;
  userMode: UserMode;
  selectedOwner: string;
  includeOutOfScope: boolean;
  onNavigateToQuestion: (questionId: string) => void;
  onNavigateToScreen: (screenId: any) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  data,
  userState,
  includeOutOfScope,
  onNavigateToQuestion,
  onNavigateToScreen,
}) => {
  const metrics = calculateDashboardMetrics(
    data.questions,
    userState.questions,
    data.tagToUseCase,
    userState.useCases,
    includeOutOfScope
  );

  const gates = calculateReadinessGates(
    data.questions,
    userState.questions,
    data.tagToUseCase,
    userState.useCases,
    includeOutOfScope
  );

  const nextBestQuestions = getNextBestQuestions(
    data.questions,
    userState.questions,
    data.tagToUseCase,
    userState.useCases,
    includeOutOfScope,
    10
  );

  const ownerBreakdown = getOpenQuestionsByOwner(
    data.questions,
    userState.questions,
    data.tagToUseCase,
    userState.useCases,
    includeOutOfScope
  );

  // Use Case scope counts
  const scopeCounts = {
    'Wave 1 (go-live)': 0,
    'Phase 2': 0,
    'Out of scope': 0,
    'To discuss': 0,
  };

  for (const uc of data.useCases || []) {
    const dec = userState.useCases[uc.name]?.scopeDecision || 'Wave 1 (go-live)';
    if (scopeCounts[dec] !== undefined) {
      scopeCounts[dec]++;
    }
  }

  // Sort owners by open questions descending
  const sortedOwners = Object.entries(ownerBreakdown)
    .sort(([, a], [, b]) => b.open - a.open)
    .slice(0, 8);

  const maxOwnerOpen = Math.max(1, ...sortedOwners.map(([, v]) => v.open));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Project Context */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider">
              Experience Implementation Scoping
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              16-Week Roadmap Target
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {data.meta?.title || 'Experience Scoping Studio'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl line-clamp-2">
            {data.meta?.context}
          </p>
        </div>

        {/* Readiness Badges */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
          {/* Design-Ready Badge */}
          <div
            className={`px-3.5 py-2.5 rounded-lg border flex items-center gap-2.5 ${
              gates.isDesignReady
                ? 'bg-lime-50 dark:bg-emerald-950/50 border-lime-300 dark:border-emerald-800 text-emerald-900 dark:text-lime-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}
          >
            {gates.isDesignReady ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-lime-400 shrink-0" />
            ) : (
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider">
                {gates.isDesignReady ? 'Design-Ready' : 'Design Pending'}
              </div>
              <div className="text-xs font-mono tabular-nums">
                {gates.isDesignReady
                  ? 'All Wk 2 P1 items answered'
                  : `${gates.designRemaining} Wk 2 P1 remaining`}
              </div>
            </div>
          </div>

          {/* Build-Ready Badge */}
          <div
            className={`px-3.5 py-2.5 rounded-lg border flex items-center gap-2.5 ${
              gates.isBuildReady
                ? 'bg-lime-50 dark:bg-emerald-950/50 border-lime-300 dark:border-emerald-800 text-emerald-900 dark:text-lime-200'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {gates.isBuildReady ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-lime-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
            )}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider">
                {gates.isBuildReady ? 'Build-Ready' : 'Build Pending'}
              </div>
              <div className="text-xs font-mono tabular-nums">
                {gates.isBuildReady
                  ? 'All Wk 2 & 4 P1 answered'
                  : `${gates.buildRemaining} Wk 2/4 P1 remaining`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Total Questions */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Scoping Questions</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#14213D] dark:text-white font-mono tabular-nums">
              {metrics.total}
            </span>
            <span className="text-xs text-slate-400">active items</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {includeOutOfScope ? 'Including out-of-scope items' : 'Relevant in-scope use cases'}
          </div>
        </div>

        {/* Tile 2: Percent Answered */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Answered or Not Applicable</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-lime-600 dark:text-lime-400 font-mono tabular-nums">
              {metrics.completionPercent}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({metrics.closed}/{metrics.total})
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lime-400 to-emerald-500"
              style={{ width: `${metrics.completionPercent}%` }}
            />
          </div>
        </div>

        {/* Tile 3: Open P1 Count */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Open P1 Questions</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
                metrics.openP1 > 0 ? 'text-[#E63946]' : 'text-teal-600'
              }`}
            >
              {metrics.openP1}
            </span>
            <span className="text-xs text-slate-400">high priority</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {metrics.openP1 === 0 ? 'All high priority resolved' : 'Blocking technical architecture'}
          </div>
        </div>

        {/* Tile 4: Open P1 due Week 2 */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Open P1 Due Week 2</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${
                metrics.openP1Week2 > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-teal-600'
              }`}
            >
              {metrics.openP1Week2}
            </span>
            <span className="text-xs text-slate-400">due in Week 2</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {metrics.openP1Week2 === 0 ? 'Design gate requirements satisfied' : 'Required for sprint kick-off'}
          </div>
        </div>
      </div>

      {/* Scope Decisions Summary Strip */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-lime-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Use Case Scope Decisions Summary
            </h3>
          </div>
          <button
            onClick={() => onNavigateToScreen('usecases')}
            className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
          >
            <span>Manage Use Cases</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-lime-50/70 dark:bg-emerald-950/40 border border-lime-300 dark:border-emerald-800">
            <div className="text-[11px] font-semibold text-emerald-800 dark:text-lime-300">Wave 1 (Go-Live)</div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
              {scopeCounts['Wave 1 (go-live)']}
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">3-4 month delivery</div>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <div className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">Phase 2</div>
            <div className="text-xl font-extrabold text-blue-900 dark:text-blue-100 font-mono tabular-nums mt-1">
              {scopeCounts['Phase 2']}
            </div>
            <div className="text-[10px] text-blue-700 dark:text-blue-400 mt-0.5">Post-launch roadmap</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Out of Scope</div>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200 font-mono tabular-nums mt-1">
              {scopeCounts['Out of scope']}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Questions excluded by default</div>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">To Discuss</div>
            <div className="text-xl font-extrabold text-amber-900 dark:text-amber-100 font-mono tabular-nums mt-1">
              {scopeCounts['To discuss']}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">Pending alignment</div>
          </div>
        </div>
      </div>

      {/* Grid: Per-Section Progress & Open Questions by Owner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-Section Progress */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Per-Section Scoping Progress
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {data.sections?.length || 0} sections
            </span>
          </div>

          <div className="space-y-4">
            {(data.sections || []).map((sec) => {
              const prog = calculateSectionProgress(
                sec.code,
                data.questions,
                userState.questions,
                data.tagToUseCase,
                userState.useCases,
                includeOutOfScope
              );

              return (
                <div key={sec.code} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        [{sec.code}]
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {sec.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 font-mono tabular-nums">
                      {prog.openP1 > 0 && (
                        <span className="text-[10px] text-red-600 font-bold">
                          {prog.openP1} P1 open
                        </span>
                      )}
                      <span className="text-slate-500 dark:text-slate-400">
                        {prog.completed}/{prog.total}
                      </span>
                      <span className="font-bold text-[#14213D] dark:text-white w-9 text-right">
                        {prog.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-300"
                      style={{ width: `${prog.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Open Questions by Owner (Bar Chart) */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Open Questions by Role / Owner
              </h3>
            </div>
            <button
              onClick={() => onNavigateToScreen('stakeholders')}
              className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline"
            >
              View Stakeholders
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {sortedOwners.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No open questions remaining!</p>
            ) : (
              sortedOwners.map(([owner, counts]) => {
                const barWidth = Math.round((counts.open / maxOwnerOpen) * 100);

                return (
                  <div key={owner} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {owner}
                      </span>
                      <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                        {counts.openP1 > 0 && (
                          <span className="text-[10px] text-red-600 font-semibold">
                            {counts.openP1} P1
                          </span>
                        )}
                        <span className="text-slate-600 dark:text-slate-400">
                          <strong className="text-slate-900 dark:text-white">{counts.open}</strong> open
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-600"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Next Best Questions: Top 10 Open P1 Questions */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Next Best Questions to Resolve (Top 10 Open P1)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritized by needed-by milestone and kickoff status. Click any row to jump into the questionnaire.
            </p>
          </div>
          <button
            onClick={() => onNavigateToScreen('questionnaire')}
            className="text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Open All Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {nextBestQuestions.length === 0 ? (
          <div className="p-8 text-center rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
            <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-teal-900 dark:text-teal-100">
              Zero Open P1 Scoping Questions!
            </h4>
            <p className="text-xs text-teal-700 dark:text-teal-300 mt-1">
              All high-priority architectural questions are answered or marked not applicable.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {nextBestQuestions.map((q) => {
              return (
                <button
                  key={q.id}
                  onClick={() => onNavigateToQuestion(q.id)}
                  className="w-full text-left py-3 px-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {q.id}
                      </span>
                      {q.kickoff && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 px-1.5 py-0.2 rounded">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Kickoff
                        </span>
                      )}
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {q.owner}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-amber-700 dark:text-amber-400 font-medium">
                        Due: {q.neededBy}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-[#1B998B] transition-colors">
                      {q.question}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {q.why}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-center">
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-[#1B998B] flex items-center gap-1">
                      Answer
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
