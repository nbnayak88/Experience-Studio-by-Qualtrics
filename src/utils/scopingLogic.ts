import {
  Question,
  QuestionState,
  UseCaseState,
  ScopingData,
  Priority,
  NeededBy,
  QuestionStatus,
  ScopeDecision,
} from '../types/scoping';

/**
 * Checks whether a question is considered relevant based on use case scope decisions.
 * Rule: A question is relevant if ANY of its useCases tags maps through tagToUseCase
 * to a use case that is not "Out of scope", or if any tag maps to null (cross-cutting, e.g. "ALL").
 * A question whose tags all map to use cases marked "Out of scope" is out of scope.
 */
export function isQuestionRelevant(
  question: Question,
  tagToUseCase: Record<string, string | null>,
  useCaseStates: Record<string, UseCaseState>
): boolean {
  if (!question.useCases || question.useCases.length === 0) {
    return true;
  }

  // Check each tag
  let hasRelevantTag = false;

  for (const tag of question.useCases) {
    const useCaseName = tagToUseCase[tag];

    // If tag maps to null (like "ALL"), it's cross-cutting -> immediately relevant
    if (useCaseName === null || useCaseName === undefined) {
      return true;
    }

    const state = useCaseStates[useCaseName];
    const decision: ScopeDecision = state ? state.scopeDecision : 'Wave 1 (go-live)';

    if (decision !== 'Out of scope') {
      hasRelevantTag = true;
    }
  }

  return hasRelevantTag;
}

/**
 * Checks if question is answered or closed
 */
export function isQuestionClosed(status?: QuestionStatus): boolean {
  return status === 'Answered' || status === 'Not applicable';
}

/**
 * Calculates per-section question completion stats
 */
export function calculateSectionProgress(
  sectionCode: string,
  questions: Question[],
  questionStates: Record<string, QuestionState>,
  tagToUseCase: Record<string, string | null>,
  useCaseStates: Record<string, UseCaseState>,
  includeOutOfScope: boolean = false
) {
  const sectionQuestions = questions.filter((q) => {
    if (q.section !== sectionCode) return false;
    if (!includeOutOfScope && !isQuestionRelevant(q, tagToUseCase, useCaseStates)) {
      return false;
    }
    return true;
  });

  const total = sectionQuestions.length;
  if (total === 0) {
    return { total: 0, completed: 0, percentage: 100, openP1: 0 };
  }

  let completed = 0;
  let openP1 = 0;

  for (const q of sectionQuestions) {
    const state = questionStates[q.id];
    const status = state?.status || 'Not started';
    if (isQuestionClosed(status)) {
      completed++;
    } else if (q.priority === 'P1') {
      openP1++;
    }
  }

  const percentage = Math.round((completed / total) * 100);
  return { total, completed, percentage, openP1 };
}

/**
 * Calculates readiness gates:
 * - "Design-ready": when every P1 question with neededBy "Week 2" is Answered or Not applicable.
 * - "Build-ready": when every P1 with neededBy "Week 2" or "Week 4" is Answered or Not applicable.
 */
export function calculateReadinessGates(
  questions: Question[],
  questionStates: Record<string, QuestionState>,
  tagToUseCase: Record<string, string | null>,
  useCaseStates: Record<string, UseCaseState>,
  includeOutOfScope: boolean = false
) {
  const relevantQuestions = questions.filter((q) =>
    includeOutOfScope ? true : isQuestionRelevant(q, tagToUseCase, useCaseStates)
  );

  const p1Week2 = relevantQuestions.filter(
    (q) => q.priority === 'P1' && q.neededBy === 'Week 2'
  );
  const p1Week4 = relevantQuestions.filter(
    (q) => q.priority === 'P1' && q.neededBy === 'Week 4'
  );
  const p1Week2And4 = relevantQuestions.filter(
    (q) => q.priority === 'P1' && (q.neededBy === 'Week 2' || q.neededBy === 'Week 4')
  );

  const openP1Week2 = p1Week2.filter((q) => !isQuestionClosed(questionStates[q.id]?.status));
  const openP1Week4 = p1Week4.filter((q) => !isQuestionClosed(questionStates[q.id]?.status));
  const openP1Week2And4 = p1Week2And4.filter((q) => !isQuestionClosed(questionStates[q.id]?.status));

  return {
    isDesignReady: p1Week2.length > 0 ? openP1Week2.length === 0 : true,
    designRemaining: openP1Week2.length,
    designTotal: p1Week2.length,
    isBuildReady: p1Week2And4.length > 0 ? openP1Week2And4.length === 0 : true,
    buildRemaining: openP1Week2And4.length,
    buildTotal: p1Week2And4.length,
    openP1Week2Count: openP1Week2.length,
    openP1Week4Count: openP1Week4.length,
  };
}

/**
 * Calculates top level dashboard statistics
 */
export function calculateDashboardMetrics(
  questions: Question[],
  questionStates: Record<string, QuestionState>,
  tagToUseCase: Record<string, string | null>,
  useCaseStates: Record<string, UseCaseState>,
  includeOutOfScope: boolean = false
) {
  const targetQuestions = questions.filter((q) =>
    includeOutOfScope ? true : isQuestionRelevant(q, tagToUseCase, useCaseStates)
  );

  const total = targetQuestions.length;
  let closed = 0;
  let openP1 = 0;
  let openP1Week2 = 0;

  for (const q of targetQuestions) {
    const status = questionStates[q.id]?.status || 'Not started';
    if (isQuestionClosed(status)) {
      closed++;
    } else {
      if (q.priority === 'P1') {
        openP1++;
        if (q.neededBy === 'Week 2') {
          openP1Week2++;
        }
      }
    }
  }

  const completionPercent = total > 0 ? Math.round((closed / total) * 100) : 0;

  return {
    total,
    closed,
    completionPercent,
    openP1,
    openP1Week2,
  };
}

/**
 * Next best questions: top 10 open P1 questions, ordered by neededBy then kickoff first
 */
export function getNextBestQuestions(
  questions: Question[],
  questionStates: Record<string, QuestionState>,
  tagToUseCase: Record<string, string | null>,
  useCaseStates: Record<string, UseCaseState>,
  includeOutOfScope: boolean = false,
  limit: number = 10
): Question[] {
  const neededByRank: Record<NeededBy, number> = {
    'Week 2': 1,
    'Week 4': 2,
    'Week 8': 3,
    'Post go-live': 4,
  };

  const openP1Questions = questions.filter((q) => {
    if (q.priority !== 'P1') return false;
    if (!includeOutOfScope && !isQuestionRelevant(q, tagToUseCase, useCaseStates)) {
      return false;
    }
    const status = questionStates[q.id]?.status || 'Not started';
    return !isQuestionClosed(status);
  });

  return openP1Questions
    .sort((a, b) => {
      // 1. Order by neededBy
      const rankA = neededByRank[a.neededBy] ?? 99;
      const rankB = neededByRank[b.neededBy] ?? 99;
      if (rankA !== rankB) return rankA - rankB;

      // 2. Kickoff first
      if (a.kickoff !== b.kickoff) return a.kickoff ? -1 : 1;

      // 3. Section code
      return a.id.localeCompare(b.id);
    })
    .slice(0, limit);
}

/**
 * Open questions count by owner
 */
export function getOpenQuestionsByOwner(
  questions: Question[],
  questionStates: Record<string, QuestionState>,
  tagToUseCase: Record<string, string | null>,
  useCaseStates: Record<string, UseCaseState>,
  includeOutOfScope: boolean = false
): Record<string, { total: number; open: number; openP1: number }> {
  const result: Record<string, { total: number; open: number; openP1: number }> = {};

  for (const q of questions) {
    if (!includeOutOfScope && !isQuestionRelevant(q, tagToUseCase, useCaseStates)) {
      continue;
    }
    const owner = q.owner || 'Unassigned';
    if (!result[owner]) {
      result[owner] = { total: 0, open: 0, openP1: 0 };
    }
    result[owner].total++;

    const status = questionStates[q.id]?.status || 'Not started';
    if (!isQuestionClosed(status)) {
      result[owner].open++;
      if (q.priority === 'P1') {
        result[owner].openP1++;
      }
    }
  }

  return result;
}

/**
 * Risk scoring function:
 * Score = likelihood x impact (1-25)
 * High: >= 15
 * Medium: 8 to 14
 * Low: <= 7
 */
export function calculateRiskScore(likelihood: number, impact: number) {
  const clampedL = Math.max(1, Math.min(5, likelihood || 1));
  const clampedI = Math.max(1, Math.min(5, impact || 1));
  const score = clampedL * clampedI;

  let rating: 'High' | 'Medium' | 'Low' = 'Low';
  if (score >= 15) {
    rating = 'High';
  } else if (score >= 8) {
    rating = 'Medium';
  }

  return { score, rating, likelihood: clampedL, impact: clampedI };
}

/**
 * Validate imported scoping JSON and sanitize optional missing keys
 */
export function validateScopingJson(raw: any): { valid: boolean; data?: ScopingData; error?: string } {
  try {
    if (!raw || typeof raw !== 'object') {
      return { valid: false, error: 'The uploaded file is not a valid JSON object.' };
    }

    if (!Array.isArray(raw.questions)) {
      return { valid: false, error: "Missing required 'questions' array in the dataset." };
    }

    if (raw.questions.length === 0) {
      return { valid: false, error: "The 'questions' array is empty." };
    }

    // Verify first question sample
    const sample = raw.questions[0];
    if (!sample.id || !sample.question) {
      return {
        valid: false,
        error: "Question items must contain at least 'id' and 'question' text fields.",
      };
    }

    // Sanitize with defaults for missing optional collections
    const sanitized: ScopingData = {
      meta: {
        title: raw.meta?.title || 'Qualtrics EX Scoping',
        context: raw.meta?.context || 'Qualtrics EX implementation alongside SAP SuccessFactors.',
        projectStart: raw.meta?.projectStart || new Date().toISOString().split('T')[0],
      },
      sections: Array.isArray(raw.sections) ? raw.sections : [],
      questions: raw.questions.map((q: any, idx: number) => ({
        id: q.id || `Q-${idx + 1}`,
        section: q.section || 'GEN',
        sectionName: q.sectionName || q.section || 'General',
        useCases: Array.isArray(q.useCases) ? q.useCases : ['ALL'],
        priority: (['P1', 'P2', 'P3'].includes(q.priority) ? q.priority : 'P2') as Priority,
        owner: q.owner || 'Project Lead',
        neededBy: (['Week 2', 'Week 4', 'Week 8', 'Post go-live'].includes(q.neededBy)
          ? q.neededBy
          : 'Week 4') as NeededBy,
        responseType: q.responseType || 'Free text',
        question: q.question || '',
        why: q.why || '',
        kickoff: Boolean(q.kickoff),
        keyLabel: q.keyLabel || q.id || `Question ${idx + 1}`,
      })),
      useCases: Array.isArray(raw.useCases) ? raw.useCases : [],
      sfModules: Array.isArray(raw.sfModules) ? raw.sfModules : [],
      dataFields: Array.isArray(raw.dataFields) ? raw.dataFields : [],
      plan: Array.isArray(raw.plan) ? raw.plan : [],
      risks: Array.isArray(raw.risks) ? raw.risks : [],
      stakeholders: Array.isArray(raw.stakeholders) ? raw.stakeholders : [],
      owners: Array.isArray(raw.owners)
        ? raw.owners
        : Array.from(new Set(raw.questions.map((q: any) => q.owner || 'Project Lead'))),
      tagToUseCase: typeof raw.tagToUseCase === 'object' && raw.tagToUseCase !== null ? raw.tagToUseCase : { ALL: null },
    };

    // Auto-populate sections if none provided
    if (sanitized.sections.length === 0) {
      const uniqueSections = Array.from(new Set(sanitized.questions.map((q) => q.section)));
      sanitized.sections = uniqueSections.map((sec) => ({
        code: sec,
        name: sanitized.questions.find((q) => q.section === sec)?.sectionName || sec,
        description: `Questions in section ${sec}`,
      }));
    }

    return { valid: true, data: sanitized };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Failed to parse scoping JSON structure.' };
  }
}
