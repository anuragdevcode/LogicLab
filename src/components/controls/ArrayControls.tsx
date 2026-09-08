import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const PRESET_OPTIONS = [
  { id: 'random', label: 'Random' },
  { id: 'nearlySorted', label: 'Nearly Sorted' },
  { id: 'reversed', label: 'Reversed' },
  { id: 'fewUnique', label: 'Few Unique' },
] as const;

type PresetType = (typeof PRESET_OPTIONS)[number]['id'];

const ArrayControls: React.FC = () => {
  const arr = useAppStore((s) => s.arr);
  const setArr = useAppStore((s) => s.setArr);
  const setArrayPreset = useAppStore((s) => s.setArrayPreset);

  const [inputValue, setInputValue] = useState('');
  const [size, setSize] = useState(arr.length || 20);
  const [activePreset, setActivePreset] = useState<PresetType>('random');
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  useEffect(() => {
    setInputValue(arr.join(', '));
    setSize(arr.length);
  }, [arr]);

  const handleApplyCustom = () => {
    const parts = inputValue.split(/[\s,]+/).filter(Boolean);
    const values = parts.map(Number);

    if (!values.length || values.some((v) => !Number.isFinite(v) || v < 0)) {
      useAppStore.getState().setStatus('Enter positive numbers separated by commas', '#f43f5e');
      return;
    }

    setArr(values.slice(0, 50));
    setIsCustomOpen(false);
  };

  const handleSelectPreset = (preset: PresetType) => {
    setActivePreset(preset);
    setArrayPreset(preset, size);
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setArrayPreset(activePreset, newSize);
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Segmented Control for Dataset Presets */}
      <div className="inline-flex items-center bg-surface p-1 rounded-lg border border-surface-tertiary">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-2 hidden xl:inline">
          Data
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          {PRESET_OPTIONS.map((opt) => {
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
          max="48"
          step="2"
          value={size}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          className="w-16 h-1.5 bg-surface-tertiary rounded-lg accent-accent cursor-pointer"
        />
        <span className="font-mono text-accent font-bold min-w-[18px] text-right">{size}</span>
      </div>

      {/* Custom Array Popover Button */}
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
                placeholder="e.g. 15, 42, 8, 99, 23, 71"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCustom()}
                autoFocus
              />
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

export default ArrayControls;
