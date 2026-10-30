import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ScopingData,
  UserState,
  Question,
  QuestionState,
  QuestionStatus,
  Priority,
  NeededBy,
  UserMode,
} from '../types/scoping';
import { isQuestionRelevant, calculateSectionProgress } from '../utils/scopingLogic';
import {
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Filter,
  X,
  Keyboard,
  ArrowLeft,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';

interface QuestionnaireScreenProps {
  data: ScopingData;
  userState: UserState;
  onUpdateQuestionState: (id: string, patch: Partial<QuestionState>) => void;
  userMode: UserMode;
  selectedOwner: string;
  includeOutOfScope: boolean;
  targetQuestionId?: string | null;
  onClearTargetQuestion?: () => void;
}

export const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({
  data,
  userState,
  onUpdateQuestionState,
  userMode,
  selectedOwner,
  includeOutOfScope,
  targetQuestionId,
  onClearTargetQuestion,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState<string>('ALL');
  const [selectedNeededBy, setSelectedNeededBy] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [kickoffOnly, setKickoffOnly] = useState(false);
  const [relevantOnly, setRelevantOnly] = useState(true);
  const [showAllForRespondent, setShowAllForRespondent] = useState(false);

  // Pagination & Active Card
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [collapsedWhy, setCollapsedWhy] = useState<Record<string, boolean>>({});

  // Auto-save notification
  const [recentlySavedId, setRecentlySavedId] = useState<string | null>(null);

  // If in respondent mode and not showing all, default owner filter to selectedOwner
  const effectiveOwnerFilter = useMemo(() => {
    if (userMode === 'respondent' && !showAllForRespondent && selectedOwner) {
      return selectedOwner;
    }
    return selectedOwnerFilter;
  }, [userMode, showAllForRespondent, selectedOwner, selectedOwnerFilter]);

  // Unique use case tags in the questions
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    for (const q of data.questions || []) {
      for (const t of q.useCases || []) {
        tags.add(t);
      }
    }
    return Array.from(tags).sort();
  }, [data.questions]);

  // Combined filtering
  const filteredQuestions = useMemo(() => {
    return (data.questions || []).filter((q) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = q.id.toLowerCase().includes(query);
        const matchesText = q.question.toLowerCase().includes(query);
        const matchesWhy = q.why.toLowerCase().includes(query);
        const matchesLabel = q.keyLabel?.toLowerCase().includes(query);
        const matchesOwner = q.owner?.toLowerCase().includes(query);
        if (!matchesId && !matchesText && !matchesWhy && !matchesLabel && !matchesOwner) {
          return false;
        }
      }

      // 2. Section
      if (selectedSection !== 'ALL' && q.section !== selectedSection) {
        return false;
      }

      // 3. Use Case Tag
      if (selectedTag !== 'ALL' && !q.useCases?.includes(selectedTag)) {
        return false;
      }

      // 4. Priority
      if (selectedPriority !== 'ALL' && q.priority !== selectedPriority) {
        return false;
      }

      // 5. Owner
      if (effectiveOwnerFilter !== 'ALL' && q.owner !== effectiveOwnerFilter) {
        return false;
      }

      // 6. Needed By
      if (selectedNeededBy !== 'ALL' && q.neededBy !== selectedNeededBy) {
        return false;
      }

      // 7. Status
      const qStatus = userState.questions[q.id]?.status || 'Not started';
      if (selectedStatus !== 'ALL' && qStatus !== selectedStatus) {
        return false;
      }

      // 8. Kickoff Only
      if (kickoffOnly && !q.kickoff) {
        return false;
      }

      // 9. Relevance Filter
      if (relevantOnly && !includeOutOfScope) {
        if (!isQuestionRelevant(q, data.tagToUseCase, userState.useCases)) {
          return false;
        }
      }

      return true;
    });
  }, [
    data.questions,
    data.tagToUseCase,
    userState.questions,
    userState.useCases,
    searchQuery,
    selectedSection,
    selectedTag,
    selectedPriority,
    effectiveOwnerFilter,
    selectedNeededBy,
    selectedStatus,
    kickoffOnly,
    relevantOnly,
    includeOutOfScope,
  ]);

  // Handle target question navigation from Dashboard
  useEffect(() => {
    if (targetQuestionId) {
      const idx = filteredQuestions.findIndex((q) => q.id === targetQuestionId);
      if (idx !== -1) {
        const targetPage = Math.floor(idx / pageSize) + 1;
        setCurrentPage(targetPage);
        setActiveQuestionIndex(idx);
        setTimeout(() => {
          const el = document.getElementById(`q-card-${targetQuestionId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        // Clear filters if question wasn't found in current filter
        setSelectedSection('ALL');
        setSelectedPriority('ALL');
        setSelectedStatus('ALL');
        setSelectedNeededBy('ALL');
        setSelectedTag('ALL');
        setSelectedOwnerFilter('ALL');
        setKickoffOnly(false);
        setSearchQuery('');
      }
      onClearTargetQuestion?.();
    }
  }, [targetQuestionId, filteredQuestions, pageSize, onClearTargetQuestion]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setActiveQuestionIndex(0);
  }, [
    searchQuery,
    selectedSection,
    selectedTag,
    selectedPriority,
    effectiveOwnerFilter,
    selectedNeededBy,
    selectedStatus,
    kickoffOnly,
    relevantOnly,
  ]);

  // Paginated slice
  const totalPages = Math.ceil(filteredQuestions.length / pageSize) || 1;
  const paginatedQuestions = useMemo(() => {
    if (pageSize >= 999) return filteredQuestions;
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  // Global Keyboard shortcuts: j and k to move next / prev
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input, textarea or select
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'j') {
        e.preventDefault();
        setActiveQuestionIndex((prev) => {
          const next = Math.min(filteredQuestions.length - 1, prev + 1);
          const newPage = Math.floor(next / pageSize) + 1;
          if (newPage !== currentPage) setCurrentPage(newPage);
          const targetQ = filteredQuestions[next];
          if (targetQ) {
            document.getElementById(`q-card-${targetQ.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return next;
        });
      } else if (e.key === 'k') {
        e.preventDefault();
        setActiveQuestionIndex((prev) => {
          const prevIdx = Math.max(0, prev - 1);
          const newPage = Math.floor(prevIdx / pageSize) + 1;
          if (newPage !== currentPage) setCurrentPage(newPage);
          const targetQ = filteredQuestions[prevIdx];
          if (targetQ) {
            document.getElementById(`q-card-${targetQ.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          return prevIdx;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredQuestions, pageSize, currentPage]);

  const toggleWhy = (id: string) => {
    setCollapsedWhy((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFieldSave = (id: string, patch: Partial<QuestionState>) => {
    onUpdateQuestionState(id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    setRecentlySavedId(id);
    setTimeout(() => {
      setRecentlySavedId(null);
    }, 1800);
  };

  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'P1':
        return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800 font-bold';
      case 'P2':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-medium';
      case 'P3':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusColor = (s: QuestionStatus) => {
    switch (s) {
      case 'Answered':
        return 'bg-lime-50 text-lime-900 dark:bg-emerald-950/60 dark:text-lime-200 border-lime-400 dark:border-emerald-700 font-semibold';
      case 'In progress':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 border-blue-300 dark:border-blue-700';
      case 'Follow-up needed':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border-amber-300 dark:border-amber-700';
      case 'Not applicable':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700';
      case 'Not started':
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Left Rail: Section Navigation & Section Completion Stats */}
      <div className="w-full lg:w-64 shrink-0 space-y-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Sections
            </h3>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              {data.sections?.length || 0} Total
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedSection('ALL')}
            className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-between ${
              selectedSection === 'ALL'
                ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-slate-950 shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/50'
            }`}
          >
            <span>All Sections</span>
            <span className="font-mono tabular-nums text-[11px] opacity-80">
              {data.questions?.length || 0}
            </span>
          </button>

          <div className="space-y-1.5 pt-1">
            {(data.sections || []).map((sec) => {
              const prog = calculateSectionProgress(
                sec.code,
                data.questions,
                userState.questions,
                data.tagToUseCase,
                userState.useCases,
                includeOutOfScope
              );
              const isSelected = selectedSection === sec.code;

              return (
                <button
                  key={sec.code}
                  type="button"
                  onClick={() => setSelectedSection(sec.code)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors space-y-1.5 ${
                    isSelected
                      ? 'bg-lime-50/80 dark:bg-emerald-950/60 border-l-3 border-lime-500 font-semibold text-slate-900 dark:text-lime-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-emerald-950/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
                      [{sec.code}]
                    </span>
                    <span className="font-mono tabular-nums text-[11px] text-slate-500">
                      {prog.completed}/{prog.total} ({prog.percentage}%)
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                    {sec.name}
                  </div>
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-lime-400 to-emerald-500"
                      style={{ width: `${prog.percentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Keyboard tip */}
        <div className="hidden lg:flex items-center gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-900/60 text-[11px] text-slate-500 dark:text-slate-400">
          <Keyboard className="w-4 h-4 text-slate-400" />
          <span>
            Press <kbd className="px-1 py-0.5 font-mono bg-white dark:bg-slate-800 border rounded shadow-2xs">j</kbd> and <kbd className="px-1 py-0.5 font-mono bg-white dark:bg-slate-800 border rounded shadow-2xs">k</kbd> to jump questions.
          </span>
        </div>
      </div>

      {/* Main Questionnaire Column */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Filters Bar */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          {/* Top row: search + quick toggles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions by ID, keywords, why, or owner..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B998B]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Respondent role toggle */}
            {userMode === 'respondent' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200">
                <label htmlFor="respondent-show-all" className="cursor-pointer font-medium">
                  Show all questions
                </label>
                <input
                  id="respondent-show-all"
                  type="checkbox"
                  checked={showAllForRespondent}
                  onChange={(e) => setShowAllForRespondent(e.target.checked)}
                  className="w-3.5 h-3.5 text-amber-600 rounded border-amber-300 focus:ring-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 text-xs">
            {/* Priority Filter */}
            <div>
              <label htmlFor="filter-priority" className="sr-only">Priority</label>
              <select
                id="filter-priority"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full py-1.5 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Priority: All</option>
                <option value="P1">P1 (High)</option>
                <option value="P2">P2 (Medium)</option>
                <option value="P3">P3 (Low)</option>
              </select>
            </div>

            {/* Needed By Filter */}
            <div>
              <label htmlFor="filter-needed-by" className="sr-only">Needed By</label>
              <select
                id="filter-needed-by"
                value={selectedNeededBy}
                onChange={(e) => setSelectedNeededBy(e.target.value)}
                className="w-full py-1.5 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Needed By: All</option>
                <option value="Week 2">Week 2</option>
                <option value="Week 4">Week 4</option>
                <option value="Week 8">Week 8</option>
                <option value="Post go-live">Post go-live</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="filter-status" className="sr-only">Status</label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full py-1.5 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Status: All</option>
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Answered">Answered</option>
                <option value="Follow-up needed">Follow-up needed</option>
                <option value="Not applicable">Not applicable</option>
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label htmlFor="filter-owner" className="sr-only">Owner</label>
              <select
                id="filter-owner"
                disabled={userMode === 'respondent' && !showAllForRespondent}
                value={effectiveOwnerFilter}
                onChange={(e) => setSelectedOwnerFilter(e.target.value)}
                className="w-full py-1.5 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-700 dark:text-slate-200 disabled:opacity-60"
              >
                <option value="ALL">Owner: All</option>
                {(data.owners || []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Use Case Tag Filter */}
            <div>
              <label htmlFor="filter-tag" className="sr-only">Use Case Tag</label>
              <select
                id="filter-tag"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full py-1.5 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-700 dark:text-slate-200"
              >
                <option value="ALL">Tag: All</option>
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick toggle chips & Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={kickoffOnly}
                  onChange={(e) => setKickoffOnly(e.target.checked)}
                  className="w-3.5 h-3.5 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                />
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Kick-off questions only
                </span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={relevantOnly}
                  onChange={(e) => setRelevantOnly(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#1B998B] rounded border-slate-300 focus:ring-[#1B998B]"
                />
                <span>Relevant in-scope only</span>
              </label>
            </div>

            <div className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              Showing <strong>{filteredQuestions.length}</strong> of {data.questions?.length || 0} questions
            </div>
          </div>
        </div>

        {/* Question Cards List */}
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">No questions match filters</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search criteria, section, owner, or status filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedQuestions.map((q, idx) => {
              const qState = userState.questions[q.id] || {
                response: '',
                status: 'Not started',
                respondent: '',
                followUp: '',
                updatedAt: '',
              };

              const isRelevant = isQuestionRelevant(q, data.tagToUseCase, userState.useCases);
              const isWhyCollapsed = collapsedWhy[q.id] ?? false;
              const isRecentlySaved = recentlySavedId === q.id;

              return (
                <div
                  key={q.id}
                  id={`q-card-${q.id}`}
                  className={`p-5 rounded-xl bg-white dark:bg-[#111827] border transition-all ${
                    !isRelevant
                      ? 'opacity-60 border-slate-200 dark:border-slate-800'
                      : 'border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      {/* Metadata row */}
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                          {q.id}
                        </span>

                        {q.kickoff && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            Kickoff
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 text-[11px] rounded border ${getPriorityStyle(
                            q.priority
                          )}`}
                        >
                          {q.priority}
                        </span>

                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {q.owner}
                        </span>

                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-amber-700 dark:text-amber-400 font-medium">
                          Needed: {q.neededBy}
                        </span>

                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-slate-400">
                          Type: {q.responseType}
                        </span>

                        {q.useCases && q.useCases.length > 0 && (
                          <>
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                            <span className="font-mono text-[11px] text-[#1B998B]">
                              {q.useCases.join(', ')}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Question Text */}
                      <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mt-1 leading-snug">
                        {q.question}
                      </h4>
                    </div>

                    {/* Status Selector + Saving Badge */}
                    <div className="shrink-0 flex items-center gap-2 self-start">
                      {isRecentlySaved && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B998B] animate-in fade-in">
                          <Check className="w-3.5 h-3.5" />
                          Saved
                        </span>
                      )}

                      <label htmlFor={`status-sel-${q.id}`} className="sr-only">
                        Status for question {q.id}
                      </label>
                      <select
                        id={`status-sel-${q.id}`}
                        value={qState.status}
                        onChange={(e) =>
                          handleFieldSave(q.id, {
                            status: e.target.value as QuestionStatus,
                          })
                        }
                        className={`text-xs font-semibold py-1.5 px-2.5 rounded-lg border focus:ring-2 focus:ring-[#1B998B] focus:outline-none ${getStatusColor(
                          qState.status
                        )}`}
                      >
                        <option value="Not started">Not started</option>
                        <option value="In progress">In progress</option>
                        <option value="Answered">Answered</option>
                        <option value="Follow-up needed">Follow-up needed</option>
                        <option value="Not applicable">Not applicable</option>
                      </select>
                    </div>
                  </div>

                  {/* Collapsible 'Why we ask' */}
                  {q.why && (
                    <div className="pt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleWhy(q.id)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-1"
                      >
                        <Info className="w-3.5 h-3.5 text-[#1B998B]" />
                        <span>Why we ask this</span>
                        {isWhyCollapsed ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronUp className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {!isWhyCollapsed && (
                        <p className="mt-1 pl-5 text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                          {q.why}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Response Textarea (Auto-save on blur) */}
                  <div className="mt-3">
                    <label
                      htmlFor={`response-${q.id}`}
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Response / Scoping Decision:
                    </label>
                    <textarea
                      id={`response-${q.id}`}
                      rows={3}
                      value={qState.response}
                      onChange={(e) =>
                        onUpdateQuestionState(q.id, { response: e.target.value })
                      }
                      onBlur={(e) =>
                        handleFieldSave(q.id, { response: e.target.value })
                      }
                      placeholder="Enter response, architecture choice, or decision details..."
                      className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B998B] leading-relaxed"
                    />
                  </div>

                  {/* Respondent & Follow-up Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <label
                        htmlFor={`respondent-${q.id}`}
                        className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                      >
                        Respondent Name / Role:
                      </label>
                      <input
                        id={`respondent-${q.id}`}
                        type="text"
                        value={qState.respondent}
                        onChange={(e) =>
                          onUpdateQuestionState(q.id, { respondent: e.target.value })
                        }
                        onBlur={(e) =>
                          handleFieldSave(q.id, { respondent: e.target.value })
                        }
                        placeholder="e.g. Jane Doe (IT Architect)"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`followup-${q.id}`}
                        className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1"
                      >
                        Follow-up Action / Notes:
                      </label>
                      <input
                        id={`followup-${q.id}`}
                        type="text"
                        value={qState.followUp}
                        onChange={(e) =>
                          onUpdateQuestionState(q.id, { followUp: e.target.value })
                        }
                        onBlur={(e) =>
                          handleFieldSave(q.id, { followUp: e.target.value })
                        }
                        placeholder="e.g. Schedule workshop on Week 2 Thursday"
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredQuestions.length > 0 && (
          <div className="p-4 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Cards per page:</span>
              <select
                aria-label="Cards per page"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-700 dark:text-slate-200 font-mono tabular-nums"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={999}>All</option>
              </select>
              <span className="text-slate-400 font-mono tabular-nums ml-2">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
