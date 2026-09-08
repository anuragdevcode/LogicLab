import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { DPStep } from '@/types';

const DPTableView: React.FC = () => {
  const steps = useAppStore((s) => s.steps);
  const stepIdx = useAppStore((s) => s.stepIdx);
  const dpAlgo = useAppStore((s) => s.dpAlgo);
  const dpConfig = useAppStore((s) => s.dpConfig);

  // Get current step
  const currentStep = stepIdx > 0 && stepIdx <= steps.length
    ? (steps[stepIdx - 1] as DPStep)
    : stepIdx === 0 && steps.length > 0
    ? (steps[0] as DPStep)
    : null;

  if (!currentStep || !currentStep.dp) {
    return (
      <div className="w-full h-full flex items-center justify-center text-textSecondary font-mono text-sm">
        Press Play to start visualization
      </div>
    );
  }

  const { dp, active, done, explain } = currentStep;

  const renderLCSTable = () => {
    const { s1, s2 } = dpConfig;
    const cols = ['Ø', ...s2.split('')];
    const rows = ['Ø', ...s1.split('')];

    return (
      <div className="overflow-auto max-w-full max-h-full p-4">
        <div
          className="inline-grid gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden shadow-sm"
          style={{ gridTemplateColumns: `repeat(${cols.length + 1}, minmax(0, 1fr))` }}
        >
          <div className="dp-cell header border-none" />
          {cols.map((char, j) => (
            <div key={`h-${j}`} className="dp-cell header border-none">{char}</div>
          ))}
          {dp.map((row, i) => (
            <React.Fragment key={`row-${i}`}>
              <div className="dp-cell header border-none">{rows[i]}</div>
              {row.map((val, j) => {
                const isActive = active && active[0] === i && active[1] === j;
                const isDone = done && i === dp.length - 1 && j === row.length - 1;
                return (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={isActive ? { scale: 0.85 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className={`dp-cell border-none font-mono text-xs ${isActive ? 'active font-bold text-white' : ''} ${isDone ? 'done font-bold' : ''}`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderKnapsackTable = () => {
    const { items, capacity } = dpConfig;

    return (
      <div className="overflow-auto max-w-full max-h-full p-4">
        <div
          className="inline-grid gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden shadow-sm"
          style={{ gridTemplateColumns: `repeat(${capacity + 2}, minmax(0, 1fr))` }}
        >
          <div className="dp-cell header border-none text-xs">i \ w</div>
          {Array.from({ length: capacity + 1 }).map((_, j) => (
            <div key={`h-${j}`} className="dp-cell header border-none">{j}</div>
          ))}
          {dp.map((row, i) => (
            <React.Fragment key={`row-${i}`}>
              <div className="dp-cell header border-none text-xs">
                {i === 0 ? '0' : `${items[i - 1].w}w,${items[i - 1].v}v`}
              </div>
              {row.map((val, j) => {
                const isActive = active && active[0] === i && active[1] === j;
                const isDone = done && i === dp.length - 1 && j === row.length - 1;
                return (
                  <motion.div
                    key={`${i}-${j}`}
                    initial={isActive ? { scale: 0.85 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    className={`dp-cell border-none font-mono text-xs ${isActive ? 'active font-bold text-white' : ''} ${isDone ? 'done font-bold' : ''}`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-4">
      {dpAlgo === 'lcs' ? renderLCSTable() : renderKnapsackTable()}

      <AnimatePresence>
        {explain && (
          <motion.div
            key={explain}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-secondary/95 backdrop-blur-md border border-white/10 text-textPrimary px-4 py-2 rounded-full text-xs font-mono max-w-lg text-center shadow-lg"
          >
            {explain}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DPTableView;
