import React from 'react';
import { AlertTriangle, FileDown } from 'lucide-react';

interface StorageBannerProps {
  isBlocked: boolean;
  onExportClick: () => void;
}

export const StorageBanner: React.FC<StorageBannerProps> = ({ isBlocked, onExportClick }) => {
  if (!isBlocked) return null;

  return (
    <div className="bg-amber-500 text-slate-900 px-4 py-2.5 text-xs font-semibold flex items-center justify-between gap-4 shadow-xs z-30">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-slate-950" />
        <span>
          Changes are not saved. Export JSON to keep your work.
        </span>
      </div>
      <button
        type="button"
        onClick={onExportClick}
        className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded text-[11px] font-bold shadow-2xs transition-colors shrink-0 flex items-center gap-1"
      >
        <FileDown className="w-3.5 h-3.5" />
        <span>Export Now</span>
      </button>
    </div>
  );
};
