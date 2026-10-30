import React, { useState } from 'react';
import { UserMode } from '../types/scoping';
import {
  Shield,
  UserCheck,
  Moon,
  Sun,
  FileDown,
  Info,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { EXPERIENCE_DOMAINS, ExperienceDomain } from '../data/experienceTemplates';

interface HeaderBarProps {
  currentScreenName: string;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  selectedOwner: string;
  setSelectedOwner: (owner: string) => void;
  availableOwners: string[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onExportClick: () => void;
  activeDomainId: string;
  onSelectDomain: (domain: ExperienceDomain) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScreenName,
  userMode,
  setUserMode,
  selectedOwner,
  setSelectedOwner,
  availableOwners,
  isDarkMode,
  toggleDarkMode,
  onExportClick,
  activeDomainId,
  onSelectDomain,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDomainMenu, setShowDomainMenu] = useState(false);

  const activeDomain = EXPERIENCE_DOMAINS.find((d) => d.id === activeDomainId) || EXPERIENCE_DOMAINS[0];

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-slate-200 dark:border-emerald-950/60 bg-white dark:bg-[#08130E] flex items-center justify-between gap-4 md:gap-8 shrink-0 z-20">
      {/* Zone 1: Brand title wordmark, single line with lime to green gradient */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 via-lime-500 to-emerald-600 flex items-center justify-center text-slate-950 font-black text-base tracking-tighter shadow-sm">
          X
        </div>
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap leading-tight">
            Experience Scope Studio
          </span>
          <span className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold tracking-wider uppercase hidden sm:inline">
            Universal Scoping Platform
          </span>
        </div>
      </div>

      {/* Zone 2: Domain selector & breadcrumb */}
      <div className="hidden lg:flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden">
        {/* Experience Domain Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDomainMenu(!showDomainMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-emerald-950/50 hover:bg-slate-200 dark:hover:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800/40 text-slate-800 dark:text-emerald-200 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-500" />
            <span>Domain: {activeDomain.shortCode}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showDomainMenu && (
            <div className="absolute left-0 top-8 w-72 bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-800/50 rounded-xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Experience Domain Template
              </div>
              {EXPERIENCE_DOMAINS.map((domain) => (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => {
                    onSelectDomain(domain);
                    setShowDomainMenu(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start gap-2 ${
                    domain.id === activeDomainId
                      ? 'bg-lime-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-lime-300 font-semibold border border-lime-300 dark:border-emerald-800'
                      : 'hover:bg-slate-100 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-mono font-bold text-[11px] text-lime-600 dark:text-lime-400 shrink-0 mt-0.5">
                    [{domain.shortCode}]
                  </span>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {domain.name}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {domain.tagline}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
        <span className="font-medium text-slate-700 dark:text-slate-200">{currentScreenName}</span>
      </div>

      {/* Zone 3: Actions & Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Mode Selector Segmented Control */}
        <div className="flex items-center bg-slate-100 dark:bg-emerald-950/40 p-0.5 rounded-lg border border-slate-200 dark:border-emerald-900/50">
          <button
            type="button"
            onClick={() => setUserMode('consultant')}
            aria-pressed={userMode === 'consultant'}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              userMode === 'consultant'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Consultant</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setUserMode('respondent');
              if (!selectedOwner && availableOwners.length > 0) {
                setSelectedOwner(availableOwners[0]);
              }
            }}
            aria-pressed={userMode === 'respondent'}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              userMode === 'respondent'
                ? 'bg-gradient-to-r from-lime-500 to-emerald-600 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Respondent</span>
          </button>
        </div>

        {/* Owner selection dropdown in Respondent mode */}
        {userMode === 'respondent' && (
          <div className="relative flex items-center gap-1">
            <label htmlFor="owner-select" className="sr-only">
              Select Your Role / Owner
            </label>
            <select
              id="owner-select"
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="text-xs font-medium py-1 px-2 rounded-md border border-lime-400 dark:border-emerald-700 bg-lime-50 dark:bg-emerald-950/60 text-slate-900 dark:text-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-500 max-w-[150px] truncate"
            >
              {availableOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>

            {/* Convenience disclaimer tooltip */}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Mode convenience notice"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              {showTooltip && (
                <div
                  role="tooltip"
                  className="absolute right-0 top-7 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in border border-slate-700"
                >
                  <p className="font-semibold text-lime-400 mb-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Role Filtering Convenience
                  </p>
                  This mode is a UI convenience for role-focused responding, not a security boundary.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-emerald-950/50 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-lime-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Quick export trigger with gradient lime & green */}
        <button
          type="button"
          onClick={onExportClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
