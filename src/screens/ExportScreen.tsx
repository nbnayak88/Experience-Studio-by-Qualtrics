import React, { useState } from 'react';
import { ScopingData, UserState } from '../types/scoping';
import {
  downloadFile,
  generateQuestionsCsv,
  generateScopingBriefMarkdown,
} from '../utils/exportHelpers';
import { createExportBundle } from '../utils/storage';
import {
  FileDown,
  Printer,
  Copy,
  Check,
  FileCode,
  FileSpreadsheet,
  FileText,
  ShieldAlert,
} from 'lucide-react';

interface ExportScreenProps {
  data: ScopingData;
  userState: UserState;
  onOpenImportModal: () => void;
}

export const ExportScreen: React.FC<ExportScreenProps> = ({
  data,
  userState,
  onOpenImportModal,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const markdownBrief = generateScopingBriefMarkdown(data, userState);

  const handleExportJson = () => {
    const bundle = createExportBundle(data, userState);
    const jsonStr = JSON.stringify(bundle, null, 2);
    const filename = `experience-scope-studio-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonStr, filename, 'application/json');
  };

  const handleExportCsv = () => {
    const csvStr = generateQuestionsCsv(data, userState);
    const filename = `experience-scoping-questions-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvStr, filename, 'text/csv;charset=utf-8;');
  };

  const handleExportMarkdown = () => {
    const filename = `experience-scoping-brief-${new Date().toISOString().split('T')[0]}.md`;
    downloadFile(markdownBrief, filename, 'text/markdown;charset=utf-8;');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownBrief);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider">
              Deliverables &amp; Artifacts
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Steering Sign-Off &amp; Backup
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Export Scoping Data, Briefs &amp; Print Reports
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Generate executive deliverables to share with steering committees or backup the complete scoping state.
            Exports support re-importing into Experience Scope Studio at any time.
          </p>
        </div>

        {/* Print button */}
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0B1712] border border-slate-300 dark:border-emerald-800/60 hover:bg-slate-50 dark:hover:bg-emerald-950/40 text-xs font-semibold rounded-lg shadow-xs text-slate-800 dark:text-slate-200 transition-colors shrink-0"
        >
          <Printer className="w-4 h-4 text-lime-600 dark:text-lime-400" />
          <span>Print-Friendly View</span>
        </button>
      </div>

      {/* 3 Primary Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Option A: Full State JSON */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#0B1712] border border-slate-200 dark:border-emerald-900/40 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-lime-50 dark:bg-emerald-950/60 border border-lime-300 dark:border-emerald-800 flex items-center justify-center text-emerald-800 dark:text-lime-300">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              (a) Full State JSON Bundle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete snapshot of both the scoping dataset and every user response, use case scope decision,
              module readiness status, and risk scoring.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-lime-400 via-lime-500 to-emerald-500 hover:from-lime-500 hover:to-emerald-600 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>Download State JSON</span>
            </button>
          </div>
        </div>

        {/* Option B: Questions CSV */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              (b) Questions &amp; Answers CSV
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tabular spreadsheet of all 200 scoping questions with priority, owner, needed-by timeline, response text,
              status, and respondent notes for Excel analysis.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1F2937] text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <FileDown className="w-4 h-4 text-emerald-600" />
              <span>Download Questions CSV</span>
            </button>
          </div>
        </div>

        {/* Option C: Markdown Scoping Brief */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              (c) Scoping Brief Markdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clean executive summary document containing project context, Wave 1 scope decisions, remaining open P1
              questions, and top high-severity risks.
            </p>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleExportMarkdown}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white dark:bg-[#1F2937] text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <FileDown className="w-4 h-4 text-amber-600" />
              <span>Download .md</span>
            </button>
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-2.5 bg-[#14213D] text-white hover:bg-slate-800 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              title="Copy markdown brief to clipboard"
            >
              {copiedMd ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Live Markdown Scoping Brief Preview */}
      <div className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Executive Scoping Brief Preview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live compiled markdown ready for sharing with executive steering committees.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-md"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-lg bg-slate-50 dark:bg-[#0B132B] border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
          {markdownBrief}
        </pre>
      </div>
    </div>
  );
};
