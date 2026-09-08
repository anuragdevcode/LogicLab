import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const StackControls: React.FC = () => {
  const algo = useAppStore((s) => s.algo);
  const stackData = useAppStore((s) => s.stackData);
  const minStackData = useAppStore((s) => s.minStackData);
  const queueCount = useAppStore((s) => s.queueCount);
  const stackAction = useAppStore((s) => s.stackAction);
  const queueAction = useAppStore((s) => s.queueAction);

  const [inputVal, setInputVal] = useState('');

  const isQueue = algo === 'queue' || algo === 'circular_queue';
  const isMinStack = algo === 'min_stack';

  const handlePrimaryAction = () => {
    if (isQueue) {
      queueAction('enqueue', inputVal.trim() !== '' ? inputVal : undefined);
    } else {
      stackAction('push', inputVal.trim() !== '' ? inputVal : undefined);
    }
    setInputVal('');
  };

  const handleSecondaryAction = () => {
    if (isQueue) {
      queueAction('dequeue');
    } else {
      stackAction('pop');
    }
  };

  const handleInspectAction = () => {
    if (isQueue) {
      queueAction('front');
    } else {
      stackAction('peek');
    }
  };

  const handleFillSample = () => {
    if (isQueue) {
      queueAction('fill');
    } else {
      stackAction('fill');
    }
  };

  const handleFillMax = () => {
    if (isQueue) {
      queueAction('fillMax');
    } else {
      stackAction('fillMax');
    }
  };

  const handleClear = () => {
    if (isQueue) {
      queueAction('clear');
    } else {
      stackAction('clear');
    }
  };

  const currentMin =
    minStackData && minStackData.length > 0
      ? minStackData[minStackData.length - 1]
      : null;

  return (
    <div className="flex items-center gap-2.5 flex-wrap select-none">
      {/* Value Input and Primary Insert */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10 gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5">
          Val
        </span>
        <input
          type="number"
          className="ctrl-input w-16 py-1 px-2 text-xs font-mono font-bold text-sky-400 bg-surface-secondary border-white/10"
          placeholder="e.g. 42"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePrimaryAction()}
        />
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handlePrimaryAction}
          className="btn-primary text-xs py-1 px-2.5 font-medium flex items-center gap-1 shadow-sm"
          title={isQueue ? 'Enqueue into rear slot [Enter]' : 'Push onto top slot [Enter]'}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{isQueue ? 'Enqueue' : 'Push'}</span>
        </motion.button>
      </div>

      {/* Operations Segmented Cluster */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10 gap-1">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleSecondaryAction}
          className="px-2.5 py-1 text-xs font-medium rounded text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all flex items-center gap-1 border border-transparent hover:border-rose-500/30"
          title={isQueue ? 'Dequeue from front slot' : 'Pop from top slot'}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          <span>{isQueue ? 'Dequeue' : 'Pop'}</span>
        </motion.button>

        <span className="text-white/10">|</span>

        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleInspectAction}
          className="px-2.5 py-1 text-xs font-medium rounded text-sky-300 hover:text-white hover:bg-sky-500/20 transition-all flex items-center gap-1 border border-transparent hover:border-sky-500/30"
          title={isQueue ? 'Inspect element at FRONT' : 'Inspect element at TOP'}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>{isQueue ? 'Front' : 'Peek'}</span>
        </motion.button>
      </div>

      {/* Min Stack Live O(1) Badge */}
      {isMinStack && (
        <div className="flex items-center gap-1.5 bg-surface px-2.5 py-1 rounded-md border border-amber-500/30 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80">
            Min (O(1))
          </span>
          <span className="font-mono text-amber-300 font-bold">
            {currentMin !== null ? currentMin : '—'}
          </span>
        </div>
      )}

      {/* Quick State Presets */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-2 hidden sm:inline">
          Preset
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleFillSample}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Populate with sample values"
          >
            Sample
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleFillMax}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Fill all 8 slots to demonstrate Overflow behavior"
          >
            Fill (8)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleClear}
            className="px-2 py-0.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
            title="Empty all memory slots"
          >
            Clear
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default StackControls;
