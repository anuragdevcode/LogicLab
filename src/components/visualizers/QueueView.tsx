import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { STACK_CAPACITY } from '@/engines';

const QueueView: React.FC = () => {
  const algo = useAppStore((s) => s.algo);
  const queueData = useAppStore((s) => s.queueData);
  const queueFront = useAppStore((s) => s.queueFront);
  const queueRear = useAppStore((s) => s.queueRear);
  const queueCount = useAppStore((s) => s.queueCount);
  const stackHighlightIdx = useAppStore((s) => s.stackHighlightIdx);
  const stackNarrative = useAppStore((s) => s.stackNarrative);

  const isCircular = algo === 'circular_queue';

  const getActionBadge = (badge?: string, isError?: boolean) => {
    if (isError) {
      return { label: badge || 'ERROR', bg: 'bg-rose-500/20 border-rose-500/50 text-rose-300' };
    }
    switch (badge) {
      case 'ENQUEUE':
        return { label: 'ENQUEUE', bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' };
      case 'DEQUEUE':
        return { label: 'DEQUEUE', bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300' };
      case 'FRONT':
        return { label: 'FRONT', bg: 'bg-sky-500/20 border-sky-500/50 text-sky-300' };
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

  return (
    <div className="viz-area relative w-full h-full bg-surface flex flex-col items-center justify-between p-4 select-none overflow-y-auto">
      {/* Top Status Narrative Banner */}
      <div className="w-full flex justify-center py-1 flex-shrink-0 z-10">
        <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-secondary/90 backdrop-blur-md border border-white/10 text-xs font-mono max-w-xl shadow-sm">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${badgeInfo.bg}`}>
            {badgeInfo.label}
          </span>
          <span className="text-textSecondary truncate">
            {stackNarrative?.reason || 'Ready. Enqueue, dequeue, or inspect front using the controls above.'}
          </span>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-4xl my-auto py-2">
        {/* Discipline & Mode Invariant Header */}
        <div className="flex items-center justify-between w-full max-w-2xl px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-textPrimary tracking-tight">
              {isCircular ? 'Circular Ring Buffer' : 'Linear Array Queue'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-textSecondary font-mono">
              {isCircular ? 'Modulo Wrap: (index + 1) % 8' : 'Strict Linear: rear < 8'}
            </span>
          </div>
          <div className="text-[11px] font-mono text-textSecondary">
            Occupancy: <strong className="text-accent">{queueCount}</strong> / {STACK_CAPACITY}
          </div>
        </div>

        {/* Array Slots Track */}
        <div className="relative flex items-center justify-center gap-2 w-full py-10 px-4 bg-surface-secondary/40 rounded-xl border border-white/10 overflow-x-auto">
          {Array.from({ length: STACK_CAPACITY }).map((_, slotIdx) => {
            const val = queueData[slotIdx];
            const isOccupied = val !== null && val !== undefined;
            const isFront = queueFront === slotIdx && queueCount > 0;
            const isRear = queueRear === slotIdx && queueCount > 0;
            const isHighlighted = stackHighlightIdx === slotIdx;

            return (
              <div key={slotIdx} className="relative flex flex-col items-center flex-shrink-0">
                {/* Top FRONT Pointer Marker */}
                <div className="h-7 flex items-end justify-center mb-1">
                  {isFront && (
                    <motion.div
                      layoutId="frontMarker"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className="flex flex-col items-center animate-in fade-in zoom-in-90 duration-150"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold font-mono whitespace-nowrap shadow-sm">
                        FRONT
                      </span>
                      <svg className="w-2.5 h-2.5 text-emerald-400 -mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>

                {/* The Memory Slot Box */}
                <div
                  className={`w-14 h-16 rounded-lg flex flex-col items-center justify-between p-1.5 font-mono transition-all duration-150 ${
                    isOccupied
                      ? isHighlighted
                        ? 'bg-sky-500/25 border-2 border-sky-400'
                        : isFront
                        ? 'bg-emerald-500/15 border border-emerald-500/50'
                        : isRear
                        ? 'bg-accent/15 border border-accent/50'
                        : 'bg-surface-secondary border border-white/10'
                      : 'border border-dashed border-white/5 bg-white/[0.01]'
                  }`}
                >
                  <span className="text-[9px] text-slate-500 font-normal">[{slotIdx}]</span>
                  <AnimatePresence mode="popLayout">
                    {isOccupied ? (
                      <motion.span
                        key={`qval-${slotIdx}-${val}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                        className="text-sm font-bold text-textPrimary"
                      >
                        {val}
                      </motion.span>
                    ) : (
                      <span key="q-empty" className="text-slate-700 text-sm font-normal">—</span>
                    )}
                  </AnimatePresence>
                  <span className="text-[9px] text-slate-600">
                    {isOccupied ? 'active' : 'free'}
                  </span>
                </div>

                {/* Bottom REAR Pointer Marker */}
                <div className="h-7 flex items-start justify-center mt-1">
                  {isRear && (
                    <motion.div
                      layoutId="rearMarker"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className="flex flex-col items-center animate-in fade-in zoom-in-90 duration-150"
                    >
                      <svg className="w-2.5 h-2.5 text-accent -mb-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="px-1.5 py-0.5 rounded bg-accent/20 border border-accent/40 text-accent text-[10px] font-bold font-mono whitespace-nowrap shadow-sm">
                        REAR
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Guidance Caption */}
        <div className="flex items-center gap-6 text-xs font-mono text-textSecondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>FRONT (Exit) = <strong className="text-white">{queueFront >= 0 ? queueFront : '-1'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span>REAR (Entry) = <strong className="text-white">{queueRear >= 0 ? queueRear : '-1'}</strong></span>
          </div>
        </div>
      </div>

      {/* Subtle In-flow Footer Caption */}
      <div className="w-full flex justify-center py-1 text-[11px] font-mono text-textSecondary/60 flex-shrink-0">
        <span>FIFO Discipline · Capacity: {STACK_CAPACITY} Slots · O(1) Operations</span>
      </div>
    </div>
  );
};

export default QueueView;
