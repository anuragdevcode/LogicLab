import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const LinkedListControls: React.FC = () => {
  const llMode = useAppStore((s) => s.llMode);
  const llData = useAppStore((s) => s.llData);
  const llAction = useAppStore((s) => s.llAction);
  const llSearch = useAppStore((s) => s.llSearch);
  const llReverse = useAppStore((s) => s.llReverse);

  const [valInput, setValInput] = useState('');
  const [idxInput, setIdxInput] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const isCircular = llMode === 'circular';

  const handleInsertHead = () => {
    const val = valInput.trim() !== '' ? Number(valInput) : Math.floor(Math.random() * 90 + 10);
    llAction('insert_head', val);
    setValInput('');
  };

  const handleInsertTail = () => {
    const val = valInput.trim() !== '' ? Number(valInput) : Math.floor(Math.random() * 90 + 10);
    llAction('insert_tail', val);
    setValInput('');
  };

  const handleInsertAt = () => {
    const val = valInput.trim() !== '' ? Number(valInput) : Math.floor(Math.random() * 90 + 10);
    const idx = idxInput.trim() !== '' ? Number(idxInput) : 1;
    llAction('insert_at', val, idx);
    setValInput('');
    setIdxInput('');
  };

  const handleDeleteVal = () => {
    if (valInput.trim() !== '') {
      llAction('delete', Number(valInput));
      setValInput('');
    } else if (llData.length > 0) {
      // Default to deleting head if no value provided
      llAction('delete_head');
    }
  };

  const handleSearch = () => {
    if (searchInput.trim() !== '') {
      llSearch(Number(searchInput));
    } else if (llData.length > 0) {
      // Pick middle element as default target
      const sample = llData[Math.floor(llData.length / 2)];
      setSearchInput(sample.toString());
      llSearch(sample);
    }
  };

  const handlePickPresent = () => {
    if (llData.length === 0) return;
    const randomVal = llData[Math.floor(Math.random() * llData.length)];
    setSearchInput(randomVal.toString());
    llSearch(randomVal);
  };

  const handlePickAbsent = () => {
    const maxVal = llData.length > 0 ? Math.max(...llData) : 90;
    const absent = maxVal + 11;
    setSearchInput(absent.toString());
    llSearch(absent);
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap select-none">
      {/* Node Data & Index Cluster */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10 gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5">
          Val
        </span>
        <input
          type="number"
          className="ctrl-input w-14 py-1 px-2 text-xs font-mono font-bold text-sky-400 bg-surface-secondary border-white/10"
          placeholder="e.g. 42"
          value={valInput}
          onChange={(e) => setValInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleInsertTail()}
        />
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1">
          At
        </span>
        <input
          type="number"
          className="ctrl-input w-12 py-1 px-2 text-xs font-mono text-textPrimary bg-surface-secondary border-white/10"
          placeholder={`0..${llData.length}`}
          min="0"
          max={llData.length}
          value={idxInput}
          onChange={(e) => setIdxInput(e.target.value)}
        />
      </div>

      {/* Insert Segmented Cluster */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10 gap-0.5">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleInsertHead}
          className="btn-primary text-xs py-1 px-2 font-medium flex items-center gap-1 shadow-sm"
          title="Insert at Head (O(1))"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Head</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleInsertTail}
          className="btn-primary text-xs py-1 px-2 font-medium flex items-center gap-1 shadow-sm"
          title={llMode === 'doubly' ? 'Insert at Tail (O(1) with tail ptr)' : 'Insert at Tail'}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Tail</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleInsertAt}
          className="px-2 py-1 text-xs font-medium rounded text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/60 transition-colors"
          title="Insert at specified index position"
        >
          At Idx
        </motion.button>
      </div>

      {/* Search Key Cluster */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10 gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5">
          Find
        </span>
        <input
          type="number"
          className="ctrl-input w-14 py-1 px-2 text-xs font-mono font-bold text-emerald-400 bg-surface-secondary border-white/10"
          placeholder="Key"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleSearch}
          className="px-2 py-1 text-xs font-medium rounded bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all"
          title="Sequential search node-by-node (O(n))"
        >
          Search
        </motion.button>
        <div className="flex items-center gap-1 bg-surface-secondary p-0.5 rounded border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePickPresent}
            className="px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 hover:text-emerald-300"
            title="Pick a value currently in the list"
          >
            Hit
          </motion.button>
          <span className="text-white/10">|</span>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePickAbsent}
            className="px-1.5 py-0.5 text-[10px] font-mono text-rose-400 hover:text-rose-300"
            title="Pick an absent value"
          >
            Miss
          </motion.button>
        </div>
      </div>

      {/* Delete and Reverse Actions */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10 gap-1">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleDeleteVal}
          className="px-2 py-1 text-xs font-medium rounded text-rose-300 hover:text-white hover:bg-rose-500/20 transition-all flex items-center gap-1 border border-transparent hover:border-rose-500/30"
          title="Delete node by value or Head"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </motion.button>

        {!isCircular && (
          <>
            <span className="text-white/10">|</span>
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => llReverse()}
              disabled={llData.length <= 1}
              className="px-2 py-1 text-xs font-medium rounded text-purple-300 hover:text-white hover:bg-purple-500/20 transition-all flex items-center gap-1 border border-transparent hover:border-purple-500/30 disabled:opacity-40 disabled:pointer-events-none"
              title="Reverse list pointers in-place (O(n))"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>Reverse</span>
            </motion.button>
          </>
        )}
      </div>

      {/* Quick Dataset Presets */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-2 hidden lg:inline">
          Preset
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => llAction('fill_sample')}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Populate with 4 sample nodes"
          >
            Sample
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => llAction('fill_max')}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Fill to maximum capacity (8 nodes)"
          >
            Fill (8)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => llAction('clear')}
            className="px-2 py-0.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
            title="Clear list"
          >
            Clear
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default LinkedListControls;
