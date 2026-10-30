import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { validateScopingJson } from '../utils/scopingLogic';
import { ScopingData, UserState } from '../types/scoping';
import { createDefaultUserState } from '../utils/storage';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: ScopingData, state?: UserState) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onDataLoaded }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pasteText, setPasteText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleProcessRawJson = (rawContent: string) => {
    setErrorMessage(null);
    try {
      const parsed = JSON.parse(rawContent);

      // Check if it's a full bundle (with userState) or just ScopingData
      if (parsed.version && parsed.data && parsed.userState) {
        const validation = validateScopingJson(parsed.data);
        if (!validation.valid || !validation.data) {
          setErrorMessage(validation.error || 'Invalid scoping dataset structure in bundle.');
          return;
        }
        onDataLoaded(validation.data, parsed.userState);
        onClose();
        return;
      }

      // Standard ScopingData JSON
      const validation = validateScopingJson(parsed);
      if (!validation.valid || !validation.data) {
        setErrorMessage(validation.error || 'Invalid scoping dataset structure.');
        return;
      }

      onDataLoaded(validation.data, createDefaultUserState(validation.data));
      onClose();
    } catch (err: any) {
      setErrorMessage(`JSON parse error: ${err.message || 'Malformed JSON syntax'}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleProcessRawJson(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleProcessRawJson(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Import Scoping Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Load Qualtrics & SAP SuccessFactors scoping questions, modules, and plan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4 flex gap-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveTab('upload');
              setErrorMessage(null);
            }}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#1B998B] text-[#1B998B]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Upload File / Drag & Drop
          </button>
          <button
            onClick={() => {
              setActiveTab('paste');
              setErrorMessage(null);
            }}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-[#1B998B] text-[#1B998B]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Paste Raw JSON
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Import validation failed</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {activeTab === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-colors ${
                isDragging
                  ? 'border-[#1B998B] bg-[#1B998B]/5'
                  : 'border-slate-300 dark:border-slate-700 hover:border-[#1B998B] bg-slate-50/50 dark:bg-slate-900/30'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#1B998B] mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Drag and drop your JSON scoping file here
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Supports up to ~200+ questions, sections, use cases, modules, and plan
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#14213D] hover:bg-[#1E293B] dark:bg-[#1B998B] dark:hover:bg-[#168074] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors">
                <FileText className="w-4 h-4" />
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-3">
              <label htmlFor="json-paste-area" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Paste scoping JSON payload:
              </label>
              <textarea
                id="json-paste-area"
                rows={9}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder='{"meta": {...}, "questions": [...], "useCases": [...]}'
                className="w-full p-3 font-mono text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#1B998B]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleProcessRawJson(pasteText)}
                  disabled={!pasteText.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-[#1B998B] hover:bg-[#168074] disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  Load Pasted Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
