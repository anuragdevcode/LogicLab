import React from 'react';
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
          className="inline-grid gap-px bg-surface-tertiary border border-surface-tertiary rounded-lg overflow-hidden"
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
                  <div
                    key={`${i}-${j}`}
                    className={`dp-cell border-none ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  >
                    {val}
                  </div>
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
          className="inline-grid gap-px bg-surface-tertiary border border-surface-tertiary rounded-lg overflow-hidden"
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
                  <div
                    key={`${i}-${j}`}
                    className={`dp-cell border-none ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                  >
                    {val}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {dpAlgo === 'lcs' ? renderLCSTable() : renderKnapsackTable()}

      {explain && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-secondary/90 backdrop-blur-sm border border-surface-tertiary text-textPrimary px-4 py-2 rounded-lg text-sm max-w-lg text-center shadow-lg">
          {explain}
        </div>
      )}
    </div>
  );
};

export default DPTableView;
