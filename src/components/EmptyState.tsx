import React from 'react';
import { Upload, Play, ShieldCheck, Layers, Calendar, Sparkles } from 'lucide-react';
import { EXPERIENCE_DOMAINS, ExperienceDomain } from '../data/experienceTemplates';

interface EmptyStateProps {
  onOpenImportModal: () => void;
  onLoadDemoData: () => void;
  onSelectDomainPreset?: (domain: ExperienceDomain) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenImportModal,
  onLoadDemoData,
  onSelectDomainPreset,
}) => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
      {/* Brand Icon: Lime to Green gradient */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 via-lime-500 to-emerald-600 flex items-center justify-center text-slate-950 mb-5 shadow-lg">
        <span className="font-black text-3xl tracking-tighter">X</span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Experience Scope Studio
      </h1>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
        Universal enterprise scoping studio for every type of experience initiative — spanning{' '}
        <strong className="text-lime-700 dark:text-lime-400 font-semibold">Employee (EX)</strong>,{' '}
        <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Customer (CX)</strong>,{' '}
        <strong className="text-teal-700 dark:text-teal-400 font-semibold">Student (SX)</strong>,{' '}
        <strong className="text-lime-600 dark:text-lime-400 font-semibold">Logistics &amp; Supply Chain (LX)</strong>,{' '}
        <strong className="text-green-700 dark:text-green-400 font-semibold">Finance (FX)</strong>, and{' '}
        <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Project (PX)</strong> experiences.
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onOpenImportModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all hover:scale-[1.01]"
        >
          <Upload className="w-4 h-4" />
          <span>Import Custom Scoping JSON</span>
        </button>

        <button
          type="button"
          onClick={onLoadDemoData}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#0B1712] text-slate-800 dark:text-white border border-slate-300 dark:border-emerald-800/60 hover:bg-slate-50 dark:hover:bg-emerald-950/40 text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Play className="w-4 h-4 text-lime-600 dark:text-lime-400" />
          <span>Load Standard Template</span>
        </button>
      </div>

      {/* Select Domain Preset Strips */}
      <div className="mt-10 w-full text-left">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-lime-500" />
          <span>Or Quick-Start by Experience Domain:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EXPERIENCE_DOMAINS.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => {
                if (onSelectDomainPreset) {
                  onSelectDomainPreset(domain);
                } else {
                  onLoadDemoData();
                }
              }}
              className="p-3.5 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 hover:border-lime-500 dark:hover:border-lime-500/70 hover:shadow-sm text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-lime-600 dark:text-lime-400">
                  [{domain.shortCode}]
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-lime-600 dark:group-hover:text-lime-400 font-semibold">
                  Launch &rarr;
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-lime-700 dark:group-hover:text-lime-300 transition-colors">
                {domain.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {domain.tagline}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature highlights grid */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full pt-4 border-t border-slate-200 dark:border-emerald-950/60">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-1.5 text-lime-600 dark:text-lime-400">
            <Layers className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Use Case Mapping
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Prioritize Wave 1 vs Phase 2 experience use cases with dynamic relevance filtering across questions.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Readiness Gates
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Design-Ready and Build-Ready gates tracking open high-priority questions due in Week 2 and Week 4.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-1.5 text-lime-600 dark:text-lime-400">
            <Calendar className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              16-Week Plan &amp; 5x5 Risks
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Interactive Gantt timeline with holiday blackout shading and 5x5 Likelihood &times; Impact heat mapping.
          </p>
        </div>
      </div>
    </div>
  );
};
