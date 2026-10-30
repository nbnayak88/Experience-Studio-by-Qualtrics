import { ScopingData, UserState, Question } from '../types/scoping';
import { calculateReadinessGates, calculateDashboardMetrics, calculateRiskScore } from './scopingLogic';

/**
 * Initiates browser download of a text/json file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escapes a cell for CSV formatting
 */
function escapeCsv(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates CSV string of all questions with responses, status and metadata
 */
export function generateQuestionsCsv(data: ScopingData, state: UserState): string {
  const headers = [
    'Question ID',
    'Section Code',
    'Section Name',
    'Priority',
    'Kickoff',
    'Needed By',
    'Owner',
    'Use Cases',
    'Key Label',
    'Question Text',
    'Why We Ask',
    'Response Type',
    'Status',
    'Response Text',
    'Respondent',
    'Follow-up Needed',
    'Last Updated',
  ];

  const rows = (data.questions || []).map((q) => {
    const qState = state.questions[q.id] || {
      response: '',
      status: 'Not started',
      respondent: '',
      followUp: '',
      updatedAt: '',
    };

    return [
      escapeCsv(q.id),
      escapeCsv(q.section),
      escapeCsv(q.sectionName),
      escapeCsv(q.priority),
      escapeCsv(q.kickoff ? 'Yes' : 'No'),
      escapeCsv(q.neededBy),
      escapeCsv(q.owner),
      escapeCsv(q.useCases ? q.useCases.join(', ') : ''),
      escapeCsv(q.keyLabel),
      escapeCsv(q.question),
      escapeCsv(q.why),
      escapeCsv(q.responseType),
      escapeCsv(qState.status),
      escapeCsv(qState.response),
      escapeCsv(qState.respondent),
      escapeCsv(qState.followUp),
      escapeCsv(qState.updatedAt || 'Not recorded'),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generates an executive Markdown Scoping Brief
 */
export function generateScopingBriefMarkdown(data: ScopingData, state: UserState): string {
  const gates = calculateReadinessGates(data.questions, state.questions, data.tagToUseCase, state.useCases);
  const metrics = calculateDashboardMetrics(data.questions, state.questions, data.tagToUseCase, state.useCases);

  // Group use cases by scope decision
  const wave1: string[] = [];
  const phase2: string[] = [];
  const outOfScope: string[] = [];
  const toDiscuss: string[] = [];

  for (const uc of data.useCases || []) {
    const dec = state.useCases[uc.name]?.scopeDecision || 'Wave 1 (go-live)';
    if (dec === 'Wave 1 (go-live)') wave1.push(uc.name);
    else if (dec === 'Phase 2') phase2.push(uc.name);
    else if (dec === 'Out of scope') outOfScope.push(uc.name);
    else toDiscuss.push(uc.name);
  }

  // Open P1 questions
  const openP1List = (data.questions || []).filter((q) => {
    if (q.priority !== 'P1') return false;
    const status = state.questions[q.id]?.status;
    return status !== 'Answered' && status !== 'Not applicable';
  });

  // Top risks (score >= 8, sorted descending)
  const riskList = (data.risks || [])
    .map((r, idx) => {
      const rState = state.risks[idx.toString()];
      const l = rState ? rState.likelihood : r.likelihood;
      const i = rState ? rState.impact : r.impact;
      const { score, rating } = calculateRiskScore(l, i);
      return { ...r, score, rating, l, i };
    })
    .sort((a, b) => b.score - a.score);

  return `# Experience Scoping & Readiness Brief
Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
Project: ${data.meta?.title || 'Experience Scope Studio'}

---

## 1. Executive Summary & Context
${data.meta?.context || 'Qualtrics EX implementation alongside SAP SuccessFactors.'}

- **Implementation Timeline**: Targeted go-live within 16 weeks (Project Start: ${state.plan?.projectStart || data.meta?.projectStart}).
- **Questionnaire Progress**: ${metrics.closed} of ${metrics.total} questions answered or resolved (${metrics.completionPercent}% complete).
- **Design Readiness**: ${gates.isDesignReady ? '✅ DESIGN-READY (All Week 2 P1 items closed)' : `⚠️ PENDING (${gates.designRemaining} Week 2 P1 questions open)`}
- **Build Readiness**: ${gates.isBuildReady ? '✅ BUILD-READY (All Week 2 & 4 P1 items closed)' : `⚠️ PENDING (${gates.buildRemaining} Week 2/4 P1 questions open)`}

---

## 2. Use Case Scope Decisions

### Wave 1 Go-Live (Targeted for 3-4 Month Launch)
${wave1.length > 0 ? wave1.map((name) => `- **${name}**`).join('\n') : '- None currently assigned to Wave 1'}

### Phase 2 Expansion
${phase2.length > 0 ? phase2.map((name) => `- **${name}**`).join('\n') : '- None currently planned for Phase 2'}

### Out of Scope / Deferred
${outOfScope.length > 0 ? outOfScope.map((name) => `- **${name}**`).join('\n') : '- None marked out of scope'}

### Under Discussion
${toDiscuss.length > 0 ? toDiscuss.map((name) => `- **${name}**`).join('\n') : '- None pending discussion'}

---

## 3. Critical Open P1 Questions (${openP1List.length} Remaining)

${
  openP1List.length === 0
    ? 'All P1 scoping questions have been answered or marked not applicable.'
    : openP1List
        .map(
          (q) => `### [${q.id}] ${q.keyLabel}
- **Question**: ${q.question}
- **Owner**: ${q.owner} | **Needed By**: ${q.neededBy} ${q.kickoff ? '| **Kick-off Priority**: ⭐ Yes' : ''}
- **Why We Ask**: ${q.why}
`
        )
        .join('\n')
}

---

## 4. Key Risk Register & Mitigations (Highest Priority)

| Risk Description | Likelihood | Impact | Score | Severity | Mitigation Strategy | Owner |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
${riskList
  .slice(0, 5)
  .map(
    (r) =>
      `| ${r.risk.replace(/\|/g, '-')} | ${r.l}/5 | ${r.i}/5 | **${r.score}** | ${r.rating} | ${r.mitigation.replace(/\|/g, '-')} | ${r.owner} |`
  )
  .join('\n')}

---

## 5. SuccessFactors Module Readiness Overview
${(data.sfModules || [])
  .map((m) => {
    const s = state.sfModules[m.module];
    const planned = s?.plannedGoLive || 'Date needed';
    const scope = s?.inScope || 'To discuss';
    return `- **${m.module}**: Status: *${m.status}* | Qualtrics Scope: **${scope}** | Planned Date: **${planned}**
  - *EX Relevance*: ${m.exRelevance}
  - *Data Trigger*: ${m.dataTrigger}`;
  })
  .join('\n\n')}

---

*Note: SAP and Qualtrics product options change often. Validate with SAP and Qualtrics before committing.*
`;
}
