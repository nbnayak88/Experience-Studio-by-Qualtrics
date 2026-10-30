import { ScopingData, UserState, AppFullBundle } from '../types/scoping';

const DATA_STORAGE_KEY = 'ex_scope_studio_data_v1';
const STATE_STORAGE_KEY = 'ex_scope_studio_user_state_v1';

let isLocalStorageAvailable = true;
let inMemoryData: ScopingData | null = null;
let inMemoryState: UserState | null = null;

// Test localStorage availability once
try {
  const testKey = '__storage_test__';
  window.localStorage.setItem(testKey, testKey);
  window.localStorage.removeItem(testKey);
  isLocalStorageAvailable = true;
} catch (e) {
  isLocalStorageAvailable = false;
}

export function isStorageBlocked(): boolean {
  return !isLocalStorageAvailable;
}

/**
 * Creates default initial user state for a loaded ScopingData dataset
 */
export function createDefaultUserState(data: ScopingData): UserState {
  const state: UserState = {
    questions: {},
    useCases: {},
    sfModules: {},
    dataFields: {},
    risks: {},
    plan: {
      projectStart: data.meta?.projectStart || '2026-11-02',
      holidayStart: '2026-12-20',
      holidayEnd: '2027-01-03',
    },
    stakeholders: {},
  };

  // Default question states
  for (const q of data.questions || []) {
    state.questions[q.id] = {
      response: '',
      status: 'Not started',
      respondent: '',
      followUp: '',
      updatedAt: '',
    };
  }

  // Default usecase states
  for (const uc of data.useCases || []) {
    state.useCases[uc.name] = {
      scopeDecision: uc.name.includes('Candidate') ? 'Phase 2' : 'Wave 1 (go-live)',
      businessOwner: '',
      audience: 'Global Employees',
      annualVolume: '15,000 responses',
      comments: '',
    };
  }

  // Default sf modules
  for (const sf of data.sfModules || []) {
    const isLive = sf.status.toLowerCase().includes('live');
    state.sfModules[sf.module] = {
      status: sf.status,
      plannedGoLive: isLive ? 'Already Live' : '2027-03-01',
      inScope: isLive ? 'Yes' : 'Phase 2',
      notes: '',
    };
  }

  // Default data fields
  for (const df of data.dataFields || []) {
    state.dataFields[df.attribute] = {
      availableInEC: df.ecArea.toLowerCase().includes('pmgm') ? 'Partly' : 'Yes',
      quality: 4,
      approvedToShare: df.sensitivity === 'High' ? 'Pending legal review' : 'Yes',
      notes: '',
    };
  }

  // Default risks
  (data.risks || []).forEach((r, idx) => {
    state.risks[idx.toString()] = {
      likelihood: r.likelihood || 3,
      impact: r.impact || 3,
    };
  });

  // Default stakeholders
  for (const sh of data.stakeholders || []) {
    state.stakeholders[sh.role] = {
      name: '',
      email: '',
      availability: 'Regular weekly',
    };
  }

  return state;
}

/**
 * Loads ScopingData from storage or in-memory
 */
export function loadSavedData(): ScopingData | null {
  if (!isLocalStorageAvailable) {
    return inMemoryData;
  }
  try {
    const serialized = localStorage.getItem(DATA_STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn('Failed to load scoping data from localStorage:', err);
    return inMemoryData;
  }
}

/**
 * Saves ScopingData to storage or in-memory
 */
export function saveScopingData(data: ScopingData): boolean {
  inMemoryData = data;
  if (!isLocalStorageAvailable) return false;
  try {
    localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.warn('Failed to write scoping data to localStorage:', err);
    isLocalStorageAvailable = false;
    return false;
  }
}

/**
 * Loads UserState from storage or in-memory
 */
export function loadSavedState(): UserState | null {
  if (!isLocalStorageAvailable) {
    return inMemoryState;
  }
  try {
    const serialized = localStorage.getItem(STATE_STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized);
  } catch (err) {
    console.warn('Failed to load user state from localStorage:', err);
    return inMemoryState;
  }
}

/**
 * Saves UserState to storage or in-memory
 */
export function saveUserState(state: UserState): boolean {
  inMemoryState = state;
  if (!isLocalStorageAvailable) return false;
  try {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.warn('Failed to write user state to localStorage:', err);
    isLocalStorageAvailable = false;
    return false;
  }
}

/**
 * Clears all stored data & state
 */
export function clearAllStorage() {
  inMemoryData = null;
  inMemoryState = null;
  if (isLocalStorageAvailable) {
    try {
      localStorage.removeItem(DATA_STORAGE_KEY);
      localStorage.removeItem(STATE_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }
}

/**
 * Exports entire application bundle (data + user edits)
 */
export function createExportBundle(data: ScopingData, userState: UserState): AppFullBundle {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    data,
    userState,
  };
}
