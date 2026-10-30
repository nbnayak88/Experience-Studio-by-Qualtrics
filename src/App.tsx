import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ScopingData,
  UserState,
  UserMode,
  QuestionState,
  UseCaseState,
  SFModuleState,
  DataFieldState,
  RiskState,
  PlanState,
  StakeholderState,
} from './types/scoping';
import { DEMO_SCOPING_DATA } from './data/demoData';
import { EXPERIENCE_DOMAINS, ExperienceDomain } from './data/experienceTemplates';
import {
  loadSavedData,
  saveScopingData,
  loadSavedState,
  saveUserState,
  createDefaultUserState,
  isStorageBlocked,
} from './utils/storage';
import { calculateDashboardMetrics, calculateReadinessGates } from './utils/scopingLogic';
import { HeaderBar } from './components/HeaderBar';
import { Navigation, ScreenId } from './components/Navigation';
import { StorageBanner } from './components/StorageBanner';
import { EmptyState } from './components/EmptyState';
import { ImportModal } from './components/ImportModal';

// Screens
import { DashboardScreen } from './screens/DashboardScreen';
import { UseCaseMapScreen } from './screens/UseCaseMapScreen';
import { QuestionnaireScreen } from './screens/QuestionnaireScreen';
import { SFModuleReadinessScreen } from './screens/SFModuleReadinessScreen';
import { DataInventoryScreen } from './screens/DataInventoryScreen';
import { PlanAndRisksScreen } from './screens/PlanAndRisksScreen';
import { StakeholdersScreen } from './screens/StakeholdersScreen';
import { ExportScreen } from './screens/ExportScreen';

import { Menu } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Storage block check
  const [storageBlocked] = useState<boolean>(() => isStorageBlocked());

  // Active Experience Domain (default EX)
  const [activeDomainId, setActiveDomainId] = useState<string>('ex');

  // Data & User state
  const [data, setData] = useState<ScopingData | null>(() => {
    const saved = loadSavedData();
    return saved || null;
  });

  const [userState, setUserState] = useState<UserState | null>(() => {
    const saved = loadSavedState();
    if (saved) return saved;
    const initialData = loadSavedData();
    if (initialData) {
      return createDefaultUserState(initialData);
    }
    return null;
  });

  // UI Navigation states
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [userMode, setUserMode] = useState<UserMode>('consultant');
  const [selectedOwner, setSelectedOwner] = useState<string>('');
  const [includeOutOfScope, setIncludeOutOfScope] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);

  // Sync selectedOwner default
  useEffect(() => {
    if (data?.owners && data.owners.length > 0 && !selectedOwner) {
      setSelectedOwner(data.owners[0]);
    }
  }, [data, selectedOwner]);

  // Persist data updates
  const handleUpdateData = useCallback((newData: ScopingData) => {
    setData(newData);
    saveScopingData(newData);
  }, []);

  // Persist userState updates
  const handleUpdateUserState = useCallback((newState: UserState) => {
    setUserState(newState);
    saveUserState(newState);
  }, []);

  // Patch Question State
  const handleUpdateQuestionState = useCallback(
    (id: string, patch: Partial<QuestionState>) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const currentQ = prev.questions[id] || {
          response: '',
          status: 'Not started',
          respondent: '',
          followUp: '',
          updatedAt: '',
        };
        const updatedQuestions = {
          ...prev.questions,
          [id]: { ...currentQ, ...patch },
        };
        const nextState = { ...prev, questions: updatedQuestions };
        saveUserState(nextState);
        return nextState;
      });
    },
    []
  );

  // Patch Use Case State
  const handleUpdateUseCaseState = useCallback(
    (name: string, patch: Partial<UseCaseState>) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const current = prev.useCases[name] || {
          scopeDecision: 'Wave 1 (go-live)',
          businessOwner: '',
          audience: '',
          annualVolume: '',
          comments: '',
        };
        const updated = {
          ...prev.useCases,
          [name]: { ...current, ...patch },
        };
        const nextState = { ...prev, useCases: updated };
        saveUserState(nextState);
        return nextState;
      });
    },
    []
  );

  // Patch SF / System Module State
  const handleUpdateSFModuleState = useCallback(
    (module: string, patch: Partial<SFModuleState>) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const current = prev.sfModules[module] || {
          status: 'Planned',
          plannedGoLive: '',
          inScope: 'Yes',
          notes: '',
        };
        const updated = {
          ...prev.sfModules,
          [module]: { ...current, ...patch },
        };
        const nextState = { ...prev, sfModules: updated };
        saveUserState(nextState);
        return nextState;
      });
    },
    []
  );

  // Patch Data Field State
  const handleUpdateDataFieldState = useCallback(
    (attribute: string, patch: Partial<DataFieldState>) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const current = prev.dataFields[attribute] || {
          availableInEC: 'Yes',
          quality: 4,
          approvedToShare: 'Yes',
          notes: '',
        };
        const updated = {
          ...prev.dataFields,
          [attribute]: { ...current, ...patch },
        };
        const nextState = { ...prev, dataFields: updated };
        saveUserState(nextState);
        return nextState;
      });
    },
    []
  );

  // Patch Risk State
  const handleUpdateRiskState = useCallback(
    (riskIndex: string, patch: Partial<RiskState>) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const current = prev.risks[riskIndex] || {
          likelihood: 3,
          impact: 3,
        };
        const updated = {
          ...prev.risks,
          [riskIndex]: { ...current, ...patch },
        };
        const nextState = { ...prev, risks: updated };
        saveUserState(nextState);
        return nextState;
      });
    },
    []
  );

  // Patch Plan State
  const handleUpdatePlanState = useCallback(
    (patch: Partial<PlanState>) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const nextPlan = { ...prev.plan, ...patch };
        const nextState = { ...prev, plan: nextPlan };
        saveUserState(nextState);
        return nextState;
      });
    },
    []
  );

  // Patch Stakeholder State
  const handleUpdateStakeholderState = useCallback(
    (role: string, patch: Partial<StakeholderState>) => {
      setUserState((prev) => {
        if (!prev) return prev;
        const current = prev.stakeholders[role] || {
          name: '',
          email: '',
          availability: 'Regular weekly',
        };
        const updated = {
          ...prev.stakeholders,
          [role]: { ...current, ...patch },
        };
        const nextState = { ...prev, stakeholders: updated };
        saveUserState(nextState);
        return nextState;
      });
    },
    []
  );

  // Load standard template data
  const handleLoadDemoData = useCallback(() => {
    setData(DEMO_SCOPING_DATA);
    const demoState = createDefaultUserState(DEMO_SCOPING_DATA);
    setUserState(demoState);
    saveScopingData(DEMO_SCOPING_DATA);
    saveUserState(demoState);
    setActiveDomainId('ex');
    setCurrentScreen('dashboard');
  }, []);

  // Switch domain template
  const handleSelectDomain = useCallback((domain: ExperienceDomain) => {
    setData(domain.data);
    const domainState = createDefaultUserState(domain.data);
    setUserState(domainState);
    saveScopingData(domain.data);
    saveUserState(domainState);
    setActiveDomainId(domain.id);
    if (domain.data.owners && domain.data.owners.length > 0) {
      setSelectedOwner(domain.data.owners[0]);
    }
  }, []);

  // Reset to default template
  const handleResetToDemo = useCallback(() => {
    if (window.confirm('Reset workspace to the active template dataset? Current unsaved edits will be replaced.')) {
      const activeDomain = EXPERIENCE_DOMAINS.find((d) => d.id === activeDomainId) || EXPERIENCE_DOMAINS[0];
      handleSelectDomain(activeDomain);
    }
  }, [activeDomainId, handleSelectDomain]);

  // Import custom dataset handler
  const handleDataLoaded = useCallback(
    (importedData: ScopingData, importedState?: UserState) => {
      setData(importedData);
      const effectiveState = importedState || createDefaultUserState(importedData);
      setUserState(effectiveState);
      saveScopingData(importedData);
      saveUserState(effectiveState);
      setCurrentScreen('dashboard');
    },
    []
  );

  // Jump from Dashboard to specific question
  const handleNavigateToQuestion = useCallback((questionId: string) => {
    setTargetQuestionId(questionId);
    setCurrentScreen('questionnaire');
  }, []);

  // Compute live progress indicators
  const metrics = useMemo(() => {
    if (!data || !userState) return { completionPercent: 0, openP1: 0, total: 0 };
    return calculateDashboardMetrics(
      data.questions,
      userState.questions,
      data.tagToUseCase,
      userState.useCases,
      includeOutOfScope
    );
  }, [data, userState, includeOutOfScope]);

  // Screen Title for header
  const screenTitleMap: Record<ScreenId, string> = {
    dashboard: 'Executive Scoping Dashboard',
    usecases: 'Use Case Map & Strategic Fit',
    questionnaire: 'Scoping Questionnaire',
    sfmodules: 'Systems & Integrations Readiness',
    datainventory: 'Data Inventory & Governance',
    planandrisks: '16-Week Roadmap & 5x5 Risks',
    stakeholders: 'Stakeholder Directory & Workload',
    export: 'Export & Print Center',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] dark:bg-[#08130E] text-[#1E2922] dark:text-[#E6F4EA]">
      {/* Storage blocked alert */}
      <StorageBanner
        isBlocked={storageBlocked}
        onExportClick={() => setCurrentScreen('export')}
      />

      {/* Top Bar Contract Header */}
      <HeaderBar
        currentScreenName={screenTitleMap[currentScreen]}
        userMode={userMode}
        setUserMode={setUserMode}
        selectedOwner={selectedOwner}
        setSelectedOwner={setSelectedOwner}
        availableOwners={data?.owners || []}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onExportClick={() => setCurrentScreen('export')}
        activeDomainId={activeDomainId}
        onSelectDomain={handleSelectDomain}
      />

      {/* Empty State when no data is loaded yet */}
      {!data || !userState ? (
        <main className="flex-1 flex items-center justify-center p-6">
          <EmptyState
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onLoadDemoData={handleLoadDemoData}
            onSelectDomainPreset={handleSelectDomain}
          />
        </main>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row relative">
          {/* Mobile subheader button to open sidebar */}
          <div className="lg:hidden px-4 py-2 bg-white dark:bg-[#0B1712] border-b border-slate-200 dark:border-emerald-950/60 flex items-center justify-between no-print">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 py-1 px-2.5 rounded-md border border-slate-200 dark:border-emerald-900/40"
            >
              <Menu className="w-4 h-4 text-lime-600" />
              <span>Menu: {screenTitleMap[currentScreen]}</span>
            </button>
            <span className="text-xs font-mono font-bold text-lime-600 dark:text-lime-400">
              {metrics.completionPercent}% Ready
            </span>
          </div>

          {/* Sidebar Navigation */}
          <Navigation
            currentScreen={currentScreen}
            onSelectScreen={setCurrentScreen}
            openP1Count={metrics.openP1}
            totalAnsweredPercentage={metrics.completionPercent}
            userMode={userMode}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onResetToDemo={handleResetToDemo}
            isMobileOpen={isMobileNavOpen}
            setIsMobileOpen={setIsMobileNavOpen}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentScreen === 'dashboard' && (
              <DashboardScreen
                data={data}
                userState={userState}
                userMode={userMode}
                selectedOwner={selectedOwner}
                includeOutOfScope={includeOutOfScope}
                onNavigateToQuestion={handleNavigateToQuestion}
                onNavigateToScreen={setCurrentScreen}
              />
            )}

            {currentScreen === 'usecases' && (
              <UseCaseMapScreen
                data={data}
                userState={userState}
                onUpdateUseCaseState={handleUpdateUseCaseState}
                userMode={userMode}
                includeOutOfScope={includeOutOfScope}
                setIncludeOutOfScope={setIncludeOutOfScope}
              />
            )}

            {currentScreen === 'questionnaire' && (
              <QuestionnaireScreen
                data={data}
                userState={userState}
                onUpdateQuestionState={handleUpdateQuestionState}
                userMode={userMode}
                selectedOwner={selectedOwner}
                includeOutOfScope={includeOutOfScope}
                targetQuestionId={targetQuestionId}
                onClearTargetQuestion={() => setTargetQuestionId(null)}
              />
            )}

            {currentScreen === 'sfmodules' && (
              <SFModuleReadinessScreen
                data={data}
                userState={userState}
                onUpdateSFModuleState={handleUpdateSFModuleState}
                userMode={userMode}
              />
            )}

            {currentScreen === 'datainventory' && (
              <DataInventoryScreen
                data={data}
                userState={userState}
                onUpdateDataFieldState={handleUpdateDataFieldState}
                userMode={userMode}
              />
            )}

            {currentScreen === 'planandrisks' && (
              <PlanAndRisksScreen
                data={data}
                userState={userState}
                onUpdatePlanState={handleUpdatePlanState}
                onUpdateRiskState={handleUpdateRiskState}
                userMode={userMode}
              />
            )}

            {currentScreen === 'stakeholders' && (
              <StakeholdersScreen
                data={data}
                userState={userState}
                onUpdateStakeholderState={handleUpdateStakeholderState}
                userMode={userMode}
                includeOutOfScope={includeOutOfScope}
                onNavigateToOwnerQuestions={(owner) => {
                  setSelectedOwner(owner);
                  setCurrentScreen('questionnaire');
                }}
              />
            )}

            {currentScreen === 'export' && (
              <ExportScreen
                data={data}
                userState={userState}
                onOpenImportModal={() => setIsImportModalOpen(true)}
              />
            )}
          </main>
        </div>
      )}

      {/* Mandatory Footer Note on Every Screen */}
      <footer className="py-3 px-6 border-t border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#08130E] text-center text-[11px] text-slate-500 dark:text-slate-400 shrink-0 space-y-0.5">
        <p>
          SAP and Qualtrics product options change often. Validate with SAP and Qualtrics before committing.
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          Experience Scope Studio supports Employee (EX), Customer (CX), Student (SX), Logistics (LX), Finance (FX), and Project (PX) implementations.
        </p>
      </footer>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onDataLoaded={handleDataLoaded}
      />
    </div>
  );
}
