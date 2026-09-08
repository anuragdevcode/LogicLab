import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const LABEL_MAP: Record<string, string> = {
  best: 'Best Case',
  avg: 'Average',
  worst: 'Worst Case',
  space: 'Space',
  time: 'Time',
  push: 'Push',
  pop: 'Pop',
  peek: 'Peek',
  enqueue: 'Enqueue',
  dequeue: 'Dequeue',
  front: 'Front',
  insert: 'Insert',
  delete: 'Delete',
  search: 'Search',
  insert_head: 'Insert Head',
  insert_tail: 'Insert Tail',
  extractMin: 'Extract Min',
  extractMax: 'Extract Max',
};

const getComplexityColor = (v: string) => {
  if (v.includes('n²') || v.includes('n³')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  if (v.includes('n log') || v.includes('n·') || v.includes('n^')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
};

const ComplexityTable: React.FC = () => {
  const complexityInfo = useAppStore((s) => s.complexityInfo);
  const algoName = useAppStore((s) => s.algoName);
  const algoMeta = useAppStore((s) => s.algoMeta);

  if (!complexityInfo || Object.keys(complexityInfo).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-textSecondary font-mono text-xs p-4">
        [ No complexity data available ]
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col font-sans text-xs overflow-y-auto space-y-3 select-none">
      {/* Notion-style Page Header & Properties */}
      <div className="space-y-2 pb-2.5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-sans font-bold text-textPrimary tracking-tight">
            {algoName || 'Algorithm Analysis'}
          </span>
          {algoMeta?.category && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-textSecondary">
              {algoMeta.category}
            </span>
          )}
        </div>

        {/* Notion Database Properties Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {Object.entries(complexityInfo).map(([k, v]) => (
            <div key={k} className="flex flex-col bg-white/[0.02] p-2 rounded-md border border-white/5">
              <span className="text-[10px] text-textSecondary/70 uppercase tracking-wider mb-0.5">
                {LABEL_MAP[k] || k}
              </span>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border inline-block w-fit ${getComplexityColor(String(v))}`}>
                {String(v)}
              </span>
            </div>
          ))}
        </div>

        {/* Stability & In-Place Properties */}
        {(algoMeta?.stability !== undefined || algoMeta?.inPlace !== undefined) && (
          <div className="flex items-center gap-2 pt-1">
            {algoMeta?.stability !== undefined && (
              <div className="flex items-center gap-1.5 text-[11px] bg-white/[0.02] px-2 py-1 rounded border border-white/5">
                <span className="text-textSecondary">Stability:</span>
                <span className={algoMeta.stability ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {algoMeta.stability ? 'STABLE' : 'NOT STABLE'}
                </span>
              </div>
            )}
            {algoMeta?.inPlace !== undefined && (
              <div className="flex items-center gap-1.5 text-[11px] bg-white/[0.02] px-2 py-1 rounded border border-white/5">
                <span className="text-textSecondary">Memory:</span>
                <span className={algoMeta.inPlace ? 'text-sky-400 font-bold' : 'text-purple-400 font-bold'}>
                  {algoMeta.inPlace ? 'IN-PLACE' : 'OUT-OF-PLACE'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notion-style Callout 1: Core Intuition */}
      {algoMeta?.description && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-sans text-textSecondary leading-relaxed">
          <div className="w-4 h-4 mt-0.5 text-accent flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-textPrimary">
              Algorithm Invariant
            </div>
            <p>{algoMeta.description}</p>
          </div>
        </div>
      )}

      {/* Notion-style Callout 2: When To Use */}
      {algoMeta?.whenToUse && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-sans text-textSecondary leading-relaxed">
          <div className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-textPrimary">
              When To Use
            </div>
            <p>{algoMeta.whenToUse}</p>
          </div>
        </div>
      )}

      {/* Notion-style Callout 3: Constraints & Preconditions */}
      {algoMeta?.constraints && algoMeta.constraints.length > 0 && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 text-xs font-sans text-textSecondary leading-relaxed">
          <div className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1.5 w-full">
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-300">
              Constraints & Invariants
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
              {algoMeta.constraints.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 font-mono text-[11px] text-textSecondary bg-white/[0.02] px-2 py-1 rounded border border-white/5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 flex-shrink-0" />
                  <span className="truncate">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplexityTable;
