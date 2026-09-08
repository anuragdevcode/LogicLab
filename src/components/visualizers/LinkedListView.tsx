import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { LINKED_LIST_CAPACITY } from '@/engines';

const LinkedListView: React.FC = () => {
  const llMode = useAppStore((s) => s.llMode);
  const llData = useAppStore((s) => s.llData);
  const llActivePointer = useAppStore((s) => s.llActivePointer);
  const llPrevPointer = useAppStore((s) => s.llPrevPointer);
  const llNarrative = useAppStore((s) => s.llNarrative);

  const isDoubly = llMode === 'doubly';
  const isCircular = llMode === 'circular';

  const getActionBadge = (badge?: string, isError?: boolean) => {
    if (isError) {
      return { label: badge || 'ERROR', bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300' };
    }
    switch (badge) {
      case 'INSERT HEAD':
      case 'INSERT TAIL':
      case 'INSERT AT':
        return { label: badge, bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' };
      case 'DELETE':
      case 'DELETE HEAD':
      case 'DELETE TAIL':
        return { label: badge, bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300' };
      case 'TRAVERSE':
        return { label: 'TRAVERSE', bg: 'bg-sky-500/20 border-sky-500/50 text-sky-300' };
      case 'FOUND':
        return { label: 'FOUND', bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' };
      case 'REVERSED':
      case 'REVERSING':
        return { label: badge, bg: 'bg-purple-500/20 border-purple-500/50 text-purple-300' };
      case 'CAPACITY':
        return { label: 'CAPACITY', bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300' };
      case 'PARADIGM':
        return { label: 'MODE', bg: 'bg-blue-500/20 border-blue-500/50 text-blue-300' };
      case 'SAMPLE':
        return { label: 'SAMPLE', bg: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' };
      case 'CLEARED':
        return { label: 'CLEARED', bg: 'bg-slate-700/40 border-slate-600/40 text-slate-300' };
      default:
        return { label: badge || 'READY', bg: 'bg-slate-700/30 border-slate-600/40 text-slate-300' };
    }
  };

  const badgeInfo = getActionBadge(llNarrative?.badge, llNarrative?.isError);

  return (
    <div className="viz-area relative w-full h-full bg-surface flex flex-col items-center justify-between p-4 select-none overflow-x-auto overflow-y-auto">
      {/* Top Status Narrative Banner */}
      <div className="w-full flex justify-center py-1 flex-shrink-0 z-10">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-secondary/90 backdrop-blur-md border border-white/10 text-xs font-mono max-w-xl shadow-sm"
        >
          <motion.span
            key={badgeInfo.label}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${badgeInfo.bg}`}
          >
            {badgeInfo.label}
          </motion.span>
          <span className="text-textSecondary truncate">
            {llNarrative?.reason || 'Ready. Insert, delete, search, or reverse nodes using the controls above.'}
          </span>
        </motion.div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-5xl my-auto py-4">
        {/* Structure Invariants Header */}
        <div className="flex items-center justify-between w-full max-w-3xl px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-textPrimary tracking-tight">
              {isDoubly
                ? 'Doubly Linked List'
                : isCircular
                ? 'Circular Linked List'
                : 'Singly Linked List'}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-textSecondary font-mono text-[11px]">
              Nodes: {llData.length} / {LINKED_LIST_CAPACITY} max
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-surface-secondary border border-white/10 text-textSecondary">
              {isDoubly
                ? 'Bidirectional (prev ⇄ next)'
                : isCircular
                ? 'Ring (Tail.next = Head)'
                : 'Unidirectional (next →)'}
            </span>
          </div>
        </div>

        {/* Horizontal Chain Visualization Track */}
        <div className="relative w-full max-w-4xl min-h-[160px] flex flex-col items-center justify-center p-4 bg-surface-secondary/30 rounded-xl border border-white/5 shadow-inner">
          {llData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2 text-textSecondary/50 font-mono text-xs py-8"
            >
              <span>[ Empty Linked List: Head = null ]</span>
              <span className="text-[11px] text-textSecondary/40">
                Use "+ Head", "+ Tail", or "Preset" above to populate nodes
              </span>
            </motion.div>
          ) : (
            <div className="flex items-center flex-wrap md:flex-nowrap justify-center gap-y-6 py-4">
              {/* Head Indicator */}
              <div className="flex items-center mr-2 font-mono text-xs">
                {isDoubly && (
                  <span className="px-1.5 py-0.5 rounded bg-surface-secondary border border-white/10 text-textSecondary/60 text-[10px] mr-1.5 font-bold">
                    NULL
                  </span>
                )}
                {isDoubly && <span className="text-textSecondary/40 mr-1.5">⇄</span>}
                <div className="flex flex-col items-center">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                    Head
                  </span>
                  <span className="text-emerald-400/60 text-xs">↓</span>
                </div>
              </div>

              {/* Node Chain */}
              <AnimatePresence mode="popLayout">
                {llData.map((val, idx) => {
                  const isActive = llActivePointer === idx;
                  const isPrev = llPrevPointer === idx;
                  const isHead = idx === 0;
                  const isTail = idx === llData.length - 1;

                  return (
                    <motion.div
                      key={`node-${idx}-${val}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.7, y: 20 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                      className="flex items-center"
                    >
                      {/* Node Box Column */}
                      <div className="flex flex-col items-center">
                        {/* Dynamic Pointers Row */}
                        <div className="h-5 flex items-center justify-center gap-1 mb-1">
                          {isActive && (
                            <motion.span
                              layoutId="llActiveTag"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              className="px-1.5 py-0.2 rounded bg-sky-500 text-slate-950 font-mono text-[9px] font-bold shadow-md animate-pulse"
                            >
                              CURR
                            </motion.span>
                          )}
                          {isPrev && !isActive && (
                            <motion.span
                              layoutId="llPrevTag"
                              className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9px] font-bold"
                            >
                              PREV
                            </motion.span>
                          )}
                          {isTail && !isHead && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[9px] font-medium">
                              TAIL
                            </span>
                          )}
                        </div>

                        {/* Node Card */}
                        <div
                          className={`flex items-center border rounded-lg overflow-hidden shadow-md transition-all duration-200 ${
                            isActive
                              ? 'bg-sky-500/15 border-sky-400 shadow-sky-500/20 scale-105'
                              : isPrev
                              ? 'bg-amber-500/10 border-amber-400/50'
                              : 'bg-surface-secondary border-white/10 hover:border-white/20'
                          }`}
                        >
                          {/* Prev Pointer Slot for Doubly */}
                          {isDoubly && (
                            <div className="px-1.5 py-2.5 bg-surface-tertiary/40 border-r border-white/10 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80" title="prev pointer" />
                            </div>
                          )}

                          {/* Data Value Slot */}
                          <div className="px-3.5 py-2 flex flex-col items-center justify-center min-w-[48px]">
                            <span
                              className={`font-mono text-sm font-bold ${
                                isActive
                                  ? 'text-sky-300'
                                  : isPrev
                                  ? 'text-amber-300'
                                  : 'text-textPrimary'
                              }`}
                            >
                              {val}
                            </span>
                            <span className="font-mono text-[9px] text-textSecondary/50 mt-0.5">
                              [{idx}]
                            </span>
                          </div>

                          {/* Next Pointer Slot */}
                          <div className="px-1.5 py-2.5 bg-surface-tertiary/40 border-l border-white/10 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" title="next pointer" />
                          </div>
                        </div>
                      </div>

                      {/* Connecting Arrows */}
                      {idx < llData.length - 1 ? (
                        <div className="flex items-center mx-1.5 text-textSecondary/60 font-mono text-sm">
                          {isDoubly ? (
                            <span className="text-purple-400/80 text-xs px-0.5 font-bold">⇄</span>
                          ) : (
                            <span className="text-accent/80 text-sm px-0.5">→</span>
                          )}
                        </div>
                      ) : (
                        /* Tail Termination Arrow */
                        <div className="flex items-center ml-1.5 font-mono text-xs">
                          {isCircular ? (
                            <div className="flex items-center gap-1 text-accent font-bold px-1">
                              <span>↳</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="text-textSecondary/50 mr-1.5 font-mono">→</span>
                              <span className="px-2 py-1 rounded bg-surface-secondary/80 border border-white/10 font-mono text-[10px] text-textSecondary/70 font-semibold">
                                NULL
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Circular Feedback Loopback Arc */}
          {isCircular && llData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-2xl mt-1 flex items-center justify-center"
            >
              <div className="w-full border-t border-dashed border-accent/40 relative flex items-center justify-center h-4">
                <span className="absolute -top-2.5 px-2 py-0.5 bg-surface text-[10px] font-mono text-accent font-semibold rounded border border-accent/30 shadow-sm flex items-center gap-1">
                  <span>Tail.next ↺ Head</span>
                  <span className="text-emerald-400">({llData[0]})</span>
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Constraints Strip */}
      <div className="w-full max-w-4xl border-t border-white/5 pt-2 flex items-center justify-between text-[11px] font-mono text-textSecondary flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-amber-400/90 font-medium">Constraints:</span>
          <span>Max Capacity: {LINKED_LIST_CAPACITY} Nodes</span>
          <span className="text-white/10">•</span>
          <span>Index Bounds: 0..{llData.length}</span>
          <span className="text-white/10">•</span>
          <span>Domain: 0..999</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>Random Access: Sequential O(n)</span>
          <span className="text-white/10">•</span>
          <span className="text-emerald-400">Head Ops: O(1)</span>
        </div>
      </div>
    </div>
  );
};

export default LinkedListView;
