import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const SEARCH_PRESETS = [
  { id: 'sortedUniform', label: 'Sorted (Step)' },
  { id: 'sortedRandom', label: 'Sorted (Random)' },
  { id: 'random', label: 'Unsorted' },
] as const;

type SearchPresetType = (typeof SEARCH_PRESETS)[number]['id'];

const SearchControls: React.FC = () => {
  const arr = useAppStore((s) => s.arr);
  const target = useAppStore((s) => s.target);
  const setArr = useAppStore((s) => s.setArr);
  const setTarget = useAppStore((s) => s.setTarget);
  const setArrayPreset = useAppStore((s) => s.setArrayPreset);

  const [targetInput, setTargetInput] = useState(target.toString());
  const [size, setSize] = useState(arr.length || 20);
  const [activePreset, setActivePreset] = useState<SearchPresetType>('sortedUniform');
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [autoSortCustom, setAutoSortCustom] = useState(true);

  useEffect(() => {
    setTargetInput(target.toString());
  }, [target]);

  useEffect(() => {
    setSize(arr.length);
    setCustomInput(arr.join(', '));
  }, [arr]);

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTargetInput(val);
    const num = Number(val);
    if (Number.isFinite(num)) {
      setTarget(num);
    }
  };

  const handlePickPresent = () => {
    if (!arr || arr.length === 0) return;
    const randomIndex = Math.floor(Math.random() * arr.length);
    const chosen = arr[randomIndex];
    setTargetInput(chosen.toString());
    setTarget(chosen);
  };

  const handlePickAbsent = () => {
    if (!arr || arr.length === 0) {
      setTarget(99);
      return;
    }
    const maxVal = Math.max(...arr, 0);
    const absent = maxVal + 7;
    setTargetInput(absent.toString());
    setTarget(absent);
  };

  const handleSelectPreset = (preset: SearchPresetType) => {
    setActivePreset(preset);
    setArrayPreset(preset, size);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setArrayPreset(activePreset, newSize);
  };

  const handleApplyCustom = () => {
    const parts = customInput.split(/[\s,]+/).filter(Boolean);
    let values = parts.map(Number);

    if (!values.length || values.some((v) => !Number.isFinite(v) || v < 0)) {
      useAppStore.getState().setStatus('Enter positive numbers separated by commas', '#f43f5e');
      return;
    }

    if (autoSortCustom) {
      values.sort((a, b) => a - b);
    }

    const trimmed = values.slice(0, 48);
    setArr(trimmed);
    if (trimmed.length > 0 && !trimmed.includes(target)) {
      setTarget(trimmed[Math.floor(trimmed.length / 2)]);
    }
    setIsCustomOpen(false);
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Target Key Cluster */}
      <div className="inline-flex items-center bg-surface p-1 rounded-lg border border-surface-tertiary gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5">
          Key
        </span>
        <input
          type="number"
          className="ctrl-input w-16 py-1 px-2 text-xs font-mono font-bold text-sky-400 bg-surface-secondary border-surface-tertiary"
          placeholder="Key"
          value={targetInput}
          onChange={handleTargetChange}
        />
        <div className="flex items-center gap-1 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePickPresent}
            className="px-2 py-0.5 text-[11px] font-mono rounded text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
            title="Pick a random value currently present in the array"
          >
            Present
          </motion.button>
          <span className="text-surface-tertiary">|</span>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePickAbsent}
            className="px-2 py-0.5 text-[11px] font-mono rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            title="Pick a value guaranteed absent from the array"
          >
            Absent
          </motion.button>
        </div>
      </div>

      {/* Segmented Control for Dataset Presets */}
      <div className="inline-flex items-center bg-surface p-1 rounded-lg border border-surface-tertiary">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-2 hidden xl:inline">
          Data
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          {SEARCH_PRESETS.map((opt) => {
            const isActive = activePreset === opt.id;
            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleSelectPreset(opt.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-sm font-semibold'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50'
                }`}
              >
                {opt.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Stacked Size Selector */}
      <div className="flex items-center gap-2 bg-surface px-2.5 py-1.5 rounded-lg border border-surface-tertiary text-xs">
        <span className="text-textSecondary font-mono text-[11px]">Size</span>
        <input
          type="range"
          min="8"
          max="40"
          step="2"
          value={size}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          className="w-16 h-1.5 bg-surface-tertiary rounded-lg accent-accent cursor-pointer"
        />
        <span className="font-mono text-accent font-bold min-w-[18px] text-right">{size}</span>
      </div>

      {/* Custom Array Popover */}
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className={`btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1.5 transition-all ${
            isCustomOpen ? 'bg-surface-tertiary text-white border-accent/40' : ''
          }`}
          title="Provide custom array values"
        >
          <svg className="w-3.5 h-3.5 text-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>Custom</span>
        </motion.button>

        <AnimatePresence>
          {isCustomOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-2 z-40 w-72 p-3 bg-surface-secondary/95 backdrop-blur-md border border-surface-tertiary rounded-xl shadow-2xl flex flex-col gap-2.5"
            >
              <div className="flex justify-between items-center text-xs font-semibold text-textPrimary">
                <span className="font-mono text-[11px] uppercase tracking-wider text-textSecondary">
                  Custom Array
                </span>
                <button
                  onClick={() => setIsCustomOpen(false)}
                  className="text-textSecondary hover:text-white p-0.5 rounded transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                className="ctrl-input w-full text-xs font-mono"
                placeholder="e.g. 10, 24, 38, 52, 66, 80"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustom()}
                autoFocus
              />
              <label className="flex items-center gap-2 text-[11px] text-textSecondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSortCustom}
                  onChange={(e) => setAutoSortCustom(e.target.checked)}
                  className="rounded border-surface-tertiary text-accent focus:ring-0"
                />
                <span>Auto-sort ascending (recommended for search)</span>
              </label>
              <div className="flex justify-end gap-2">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  className="btn-secondary text-xs py-1 px-2.5"
                  onClick={() => setIsCustomOpen(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  className="btn-primary text-xs py-1 px-3"
                  onClick={handleApplyCustom}
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchControls;
