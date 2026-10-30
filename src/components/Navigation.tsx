import React from 'react';
import {
  LayoutDashboard,
  Layers,
  ClipboardList,
  Cpu,
  Database,
  CalendarDays,
  Users,
  FileDown,
  Upload,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { UserMode } from '../types/scoping';

export type ScreenId =
  | 'dashboard'
  | 'usecases'
  | 'questionnaire'
  | 'sfmodules'
  | 'datainventory'
  | 'planandrisks'
  | 'stakeholders'
  | 'export';

interface NavigationProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  openP1Count: number;
  totalAnsweredPercentage: number;
  userMode: UserMode;
  onOpenImportModal: () => void;
  onResetToDemo: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentScreen,
  onSelectScreen,
  openP1Count,
  totalAnsweredPercentage,
  userMode,
  onOpenImportModal,
  onResetToDemo,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const navItems: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'usecases', label: 'Use Case Map', icon: Layers },
    {
      id: 'questionnaire',
      label: 'Questionnaire',
      icon: ClipboardList,
      badge: openP1Count > 0 ? `${openP1Count} P1` : undefined,
    },
    { id: 'sfmodules', label: 'Systems & Integrations', icon: Cpu },
    { id: 'datainventory', label: 'Data Inventory', icon: Database },
    { id: 'planandrisks', label: 'Plan & Risks', icon: CalendarDays },
    { id: 'stakeholders', label: 'Stakeholders', icon: Users },
    { id: 'export', label: 'Export & Print', icon: FileDown },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#08130E] border-r border-slate-200 dark:border-emerald-950/60 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top header on mobile */}
        <div className="p-4 border-b border-slate-200 dark:border-emerald-950/60 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-lime-400 to-emerald-600 text-slate-950 font-black text-xs flex items-center justify-center">
              X
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm">Experience Scope</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-xs px-2 py-1 rounded"
          >
            Close
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 py-2 text-[10px] font-bold text-lime-700 dark:text-lime-400 tracking-wider uppercase">
            Scoping Workspace
          </div>

          <nav className="space-y-0.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectScreen(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-slate-950 stroke-[2.5]'
                          : 'text-slate-400 dark:text-emerald-500/70'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold rounded-sm ${
                        isActive
                          ? 'bg-slate-950 text-white'
                          : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with progress & action triggers */}
        <div className="p-3 border-t border-slate-200 dark:border-emerald-950/60 space-y-3 bg-slate-50/70 dark:bg-emerald-950/20">
          {/* Progress Mini Card */}
          <div className="p-2.5 rounded-lg bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Scoping Readiness</span>
              <span className="font-bold text-slate-900 dark:text-lime-300 font-mono tabular-nums">
                {totalAnsweredPercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, totalAnsweredPercentage))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>{openP1Count} open P1 items</span>
              <span className="capitalize">{userMode}</span>
            </div>
          </div>

          {/* Data Actions */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={onOpenImportModal}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 hover:bg-slate-50 dark:hover:bg-emerald-950/50 rounded-md transition-colors"
            >
              <Upload className="w-3 h-3 text-lime-600 dark:text-lime-400" />
              <span>Import</span>
            </button>
            <button
              type="button"
              onClick={onResetToDemo}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 hover:bg-slate-50 dark:hover:bg-emerald-950/50 rounded-md transition-colors"
              title="Reset workspace to default template data"
            >
              <RefreshCw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
