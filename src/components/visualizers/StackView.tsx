import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { STACK_CAPACITY } from '@/engines';
import QueueView from './QueueView';

const StackView: React.FC = () => {
  const algo = useAppStore((s) => s.algo);
  const stackData = useAppStore((s) => s.stackData);
  const minStackData = useAppStore((s) => s.minStackData);
  const stackHighlightIdx = useAppStore((s) => s.stackHighlightIdx);
  const stackNarrative = useAppStore((s) => s.stackNarrative);

  if (algo === 'queue' || algo === 'circular_queue') {
    return <QueueView />;
  }

  const isMinStack = algo === 'min_stack';

  const getActionBadge = (badge?: string, isError?: boolean) => {
    if (isError) {
      return { label: badge || 'ERROR', bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300' };
    }
    switch (badge) {
      case 'PUSH':
        return { label: 'PUSH', bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' };
      case 'POP':
        return { label: 'POP', bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300' };
      case 'PEEK':
        return { label: 'PEEK', bg: 'bg-sky-500/20 border-sky-500/50 text-sky-300' };
      case 'SAMPLE':
        return { label: 'SAMPLE', bg: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' };
      case 'CAPACITY':
        return { label: 'CAPACITY', bg: 'bg-purple-500/20 border-purple-500/50 text-purple-300' };
      case 'CLEAR':
        return { label: 'CLEAR', bg: 'bg-slate-700/40 border-slate-600/40 text-slate-300' };
      default:
        return { label: badge || 'READY', bg: 'bg-slate-700/30 border-slate-600/40 text-slate-300' };
    }
  };

  const badgeInfo = getActionBadge(stackNarrative?.badge, stackNarrative?.isError);
  const topIdx = stackData.length - 1;

  return (
    <div className="viz-area relative w-full h-full bg-surface flex flex-col items-center justify-between p-4 select-none overflow-y-auto">
      {/* Top Status Narrative Banner */}
      <div className="w-full flex justify-center py-1 flex-shrink-0 z-10">
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-secondary/90 backdrop-blur-md border border-white/10 text-xs font-mono max-w-xl shadow-sm">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${badgeInfo.bg}`}>
            {badgeInfo.label}
          </span>
          <span className="text-textSecondary truncate">
            {stackNarrative?.reason || 'Ready. Push, pop, or peek using the controls above.'}
          </span>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="flex-1 flex items-center justify-center gap-12 max-w-3xl w-full my-auto py-2">
        {/* Primary Stack Column */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-44 mb-2 px-1 text-xs">
            <span className="font-semibold text-textPrimary tracking-tight">Main Stack</span>
            <span className="text-[11px] font-mono text-textSecondary">
              Depth: <strong className="text-accent">{stackData.length}</strong> / {STACK_CAPACITY}
            </span>
          </div>

          {/* Fixed Capacity U-Shaped Bucket */}
          <div className="relative w-44 h-[270px] border-b-2 border-l-2 border-r-2 border-white/20 rounded-b-xl bg-surface-secondary/40 p-2 flex flex-col-reverse gap-1.5 shadow-inner">
            {Array.from({ length: STACK_CAPACITY }).map((_, slotIdx) => {
              const item = stackData[slotIdx];
              const isFilled = slotIdx < stackData.length;
              const isTop = slotIdx === topIdx;
              const isHighlighted = stackHighlightIdx === slotIdx;

              return (
                <div
                  key={slotIdx}
                  className={`relative w-full h-7 rounded flex items-center justify-between px-2.5 text-xs font-mono transition-all duration-150 ${
                    isFilled
                      ? isHighlighted
                        ? 'bg-sky-500/25 border-2 border-sky-400 text-sky-200'
                        : isTop
                        ? 'bg-accent/20 border border-accent/60 text-white font-semibold'
                        : 'bg-surface-secondary border border-white/10 text-textPrimary'
                      : 'border border-dashed border-white/5 text-slate-600 bg-white/[0.01]'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 font-normal">[{slotIdx}]</span>
                  <AnimatePresence mode="popLayout">
                    {isFilled ? (
                      <motion.span
                        key={`val-${slotIdx}-${item}`}
                        initial={{ opacity: 0, y: -10, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 25 }}
                        className="font-bold text-sm"
                      >
                        {item}
                      </motion.span>
                    ) : (
                      <span key="empty" className="text-slate-700 text-xs font-normal">—</span>
                    )}
                  </AnimatePresence>

                  {/* TOP Pointer Badge */}
                  {isTop && (
                    <motion.div
                      layoutId="topPointer"
                      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                      className="absolute -right-20 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/20 border border-accent/40 text-accent text-[10px] font-bold font-mono whitespace-nowrap"
                    >
                      <span>← TOP</span>
                    </motion.div>
                  )}
                </div>
              );
            })}

            <AnimatePresence>
              {stackData.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-xs pointer-events-none"
                >
                  [ Empty Stack: top = -1 ]
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Min Stack Column (Rendered when in min_stack mode) */}
        {isMinStack && (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-44 mb-2 px-1 text-xs">
              <span className="font-semibold text-amber-300 tracking-tight">Min Stack</span>
              <span className="text-[11px] font-mono text-textSecondary">
                O(1) Min: <strong className="text-amber-400">{topIdx >= 0 ? minStackData[topIdx] : '—'}</strong>
              </span>
            </div>

            {/* Min Stack Bucket */}
            <div className="relative w-44 h-[270px] border-b-2 border-l-2 border-r-2 border-amber-500/30 rounded-b-xl bg-surface-secondary/40 p-2 flex flex-col-reverse gap-1.5 shadow-inner">
              {Array.from({ length: STACK_CAPACITY }).map((_, slotIdx) => {
                const minVal = minStackData[slotIdx];
                const isFilled = slotIdx < minStackData.length;
                const isTop = slotIdx === topIdx;

                return (
                  <div
                    key={slotIdx}
                    className={`relative w-full h-7 rounded flex items-center justify-between px-2.5 text-xs font-mono transition-all duration-150 ${
                      isFilled
                        ? isTop
                          ? 'bg-amber-500/20 border border-amber-500/50 text-amber-200 font-semibold'
                          : 'bg-surface-secondary/70 border border-amber-500/15 text-amber-300/80'
                        : 'border border-dashed border-white/5 text-slate-600 bg-white/[0.01]'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-normal">[{slotIdx}]</span>
                    <AnimatePresence mode="popLayout">
                      {isFilled ? (
                        <motion.span
                          key={`min-${slotIdx}-${minVal}`}
                          initial={{ opacity: 0, y: -10, scale: 0.85 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.85 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 25 }}
                          className="font-bold text-sm"
                        >
                          {minVal}
                        </motion.span>
                      ) : (
                        <span key="empty-min" className="text-slate-700 text-xs font-normal">—</span>
                      )}
                    </AnimatePresence>

                    {isTop && (
                      <motion.div
                        layoutId="minPointer"
                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                        className="absolute -right-24 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold font-mono whitespace-nowrap"
                      >
                        <span>MIN = {minVal}</span>
                      </motion.div>
                    )}
                  </div>
                );
              })}

              <AnimatePresence>
                {minStackData.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-xs pointer-events-none"
                  >
                    [ No Minimum ]
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Subtle In-flow Footer Caption */}
      <div className="w-full flex justify-center py-1 text-[11px] font-mono text-textSecondary/60 flex-shrink-0">
        <span>LIFO Discipline · Capacity: {STACK_CAPACITY} Slots · O(1) Operations</span>
      </div>
    </div>
  );
};

export default StackView;
