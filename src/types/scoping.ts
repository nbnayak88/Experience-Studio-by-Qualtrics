export type Priority = 'P1' | 'P2' | 'P3';
export type NeededBy = 'Week 2' | 'Week 4' | 'Week 8' | 'Post go-live';
export type QuestionStatus = 'Not started' | 'In progress' | 'Answered' | 'Follow-up needed' | 'Not applicable';
export type ScopeDecision = 'Wave 1 (go-live)' | 'Phase 2' | 'Out of scope' | 'To discuss';
export type ModuleInScope = 'Yes' | 'No' | 'Phase 2' | 'To discuss';
export type FieldSensitivity = 'Low' | 'Medium' | 'High';
export type FieldECStatus = 'Yes' | 'No' | 'Partly' | 'Unknown';
export type FieldApproval = 'Yes' | 'No' | 'Pending legal review';
export type UseCaseFit = 'High' | 'Medium-High' | 'Medium' | 'Low-Medium';
export type UserMode = 'consultant' | 'respondent';

export interface ScopingMeta {
  title: string;
  context: string;
  projectStart: string; // YYYY-MM-DD
}

export interface Section {
  code: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  section: string;
  sectionName: string;
  useCases: string[];
  priority: Priority;
  owner: string;
  neededBy: NeededBy;
  responseType: string;
  question: string;
  why: string;
  kickoff: boolean;
  keyLabel: string;
}

export interface UseCase {
  name: string;
  covers: string;
  sfTrigger: string;
  dependsOn: string;
  fit: UseCaseFit;
  fitReason: string;
}

export interface SFModule {
  module: string;
  status: string;
  exRelevance: string;
  touchpoint: string;
  dataTrigger: string;
  confirmQuestion: string;
}

export interface DataField {
  attribute: string;
  ecArea: string;
  purpose: string;
  sensitivity: FieldSensitivity;
  neededFor: string;
}

export interface PlanPhase {
  phase: string;
  startWeek: number;
  endWeek: number;
  activities: string[] | string;
}

export interface Risk {
  risk: string;
  likelihood: number; // 1-5
  impact: number;     // 1-5
  mitigation: string;
  owner: string;
}

export interface Stakeholder {
  role: string;
  why: string;
  involvement: string;
}

export interface ScopingData {
  meta: ScopingMeta;
  sections: Section[];
  questions: Question[];
  useCases: UseCase[];
  sfModules: SFModule[];
  dataFields: DataField[];
  plan: PlanPhase[];
  risks: Risk[];
  stakeholders: Stakeholder[];
  owners: string[];
  tagToUseCase: Record<string, string | null>;
}

// User state models
export interface QuestionState {
  response: string;
  status: QuestionStatus;
  respondent: string;
  followUp: string;
  updatedAt: string;
}

export interface UseCaseState {
  scopeDecision: ScopeDecision;
  businessOwner: string;
  audience: string;
  annualVolume: string;
  comments: string;
}

export interface SFModuleState {
  status: string;
  plannedGoLive: string;
  inScope: ModuleInScope;
  notes: string;
}

export interface DataFieldState {
  availableInEC: FieldECStatus;
  quality: number; // 1-5
  approvedToShare: FieldApproval;
  notes: string;
}

export interface RiskState {
  likelihood: number;
  impact: number;
}

export interface StakeholderState {
  name: string;
  email: string;
  availability: string;
}

export interface PlanState {
  projectStart: string;
  holidayStart: string;
  holidayEnd: string;
}

export interface UserState {
  questions: Record<string, QuestionState>;
  useCases: Record<string, UseCaseState>;
  sfModules: Record<string, SFModuleState>;
  dataFields: Record<string, DataFieldState>;
  risks: Record<string, RiskState>; // indexed by risk id / index
  plan: PlanState;
  stakeholders: Record<string, StakeholderState>; // indexed by role
}

export interface AppFullBundle {
  version: string;
  exportedAt: string;
  data: ScopingData;
  userState: UserState;
}
