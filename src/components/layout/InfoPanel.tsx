import React, { useState } from 'react';
import PseudocodeBox from '../ui/PseudocodeBox';
import ComplexityTable from '../ui/ComplexityTable';
import { useAppStore } from '@/store/useAppStore';

const InfoPanel: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const algoName = useAppStore((s) => s.algoName);
  const complexityInfo = useAppStore((s) => s.complexityInfo);

  const bestCase = complexityInfo?.best || complexityInfo?.time || complexityInfo?.push || '';

  return (
    <div className="border-t border-white/10 bg-surface flex flex-col flex-shrink-0 select-none transition-all duration-200">
      {/* Notion-style Drawer Toggle Bar */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="h-[30px] px-4 flex items-center justify-between bg-surface-secondary/70 hover:bg-surface-secondary cursor-pointer border-b border-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-sans">
          <span className="font-semibold text-textPrimary tracking-tight">Analysis & Pseudocode</span>
          {algoName && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-textSecondary font-mono">
              {algoName}
            </span>
          )}
          {bestCase && (
            <span className="hidden sm:inline-block text-[10px] text-accent font-mono">
              {String(bestCase)}
            </span>
          )}
        </div>

        <button
          className="flex items-center gap-1 text-[11px] font-mono text-textSecondary hover:text-textPrimary bg-transparent border-none p-0 cursor-pointer"
          aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
        >
          <span>{collapsed ? 'Expand' : 'Collapse'}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Expandable Drawer Content */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 overflow-hidden transition-all duration-200 ${
          collapsed ? 'h-0 opacity-0' : 'h-48 min-h-[192px] opacity-100'
        }`}
      >
        <div className="border-b md:border-b-0 md:border-r border-white/5 overflow-y-auto">
          <PseudocodeBox />
        </div>
        <div className="overflow-y-auto bg-surface-secondary/20">
          <ComplexityTable />
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
