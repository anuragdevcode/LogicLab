import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { BST_CAPACITY } from '@/engines';

const BSTControls: React.FC = () => {
  const bst = useAppStore((s) => s.bst);
  const bstMode = useAppStore((s) => s.bstMode);
  const bstInsert = useAppStore((s) => s.bstInsert);
  const bstDelete = useAppStore((s) => s.bstDelete);
  const bstSearch = useAppStore((s) => s.bstSearch);
  const bstRunTraversal = useAppStore((s) => s.bstRunTraversal);
  const bstFindMin = useAppStore((s) => s.bstFindMin);
  const bstFindMax = useAppStore((s) => s.bstFindMax);
  const bstLoadPreset = useAppStore((s) => s.bstLoadPreset);

  const [inputVal, setInputVal] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isTraversing, setIsTraversing] = useState(false);

  const nodeCount = bst ? bst.getNodeCount() : 0;
  const isFull = nodeCount >= BST_CAPACITY;

  const handleRandomize = () => {
    const r = Math.floor(Math.random() * 88) + 11;
    setInputVal(r.toString());
  };

  const handleInsert = () => {
    const val = inputVal.trim() !== '' ? Number(inputVal) : Math.floor(Math.random() * 88) + 11;
    const ok = bstInsert(val);
    if (ok) setInputVal('');
  };

  const handleDelete = () => {
    if (inputVal.trim() !== '') {
      bstDelete(Number(inputVal));
      setInputVal('');
    } else if (bst && bst.root) {
      // Default to root key if no input specified
      bstDelete(bst.root.val);
    }
  };

  const handleSearch = async (overrideVal?: number) => {
    let target = overrideVal;
    if (target === undefined) {
      if (inputVal.trim() !== '') {
        target = Number(inputVal);
      } else if (bst && bst.root) {
        target = bst.root.val;
        setInputVal(target.toString());
      } else {
        return;
      }
    }
    setIsSearching(true);
    await bstSearch(target);
    setIsSearching(false);
  };

  const handlePickHit = () => {
    if (!bst || !bst.root) return;
    const all = bst.inorder();
    if (all.length === 0) return;
    const chosen = all[Math.floor(Math.random() * all.length)];
    setInputVal(chosen.toString());
    handleSearch(chosen);
  };

  const handlePickMiss = () => {
    const maxVal = bst ? bst.getMax() ?? 50 : 50;
    const absent = maxVal + 13;
    setInputVal(absent.toString());
    handleSearch(absent);
  };

  const handleTraversal = async () => {
    if (!bst || !bst.root) return;
    setIsTraversing(true);
    await bstRunTraversal();
    setIsTraversing(false);
  };

  const traversalLabel =
    bstMode === 'preorder'
      ? 'Pre-Order'
      : bstMode === 'postorder'
      ? 'Post-Order'
      : bstMode === 'levelorder'
      ? 'Level-Order (BFS)'
      : 'In-Order';

  return (
    <div className="flex items-center gap-2.5 flex-wrap select-none">
      {/* Node Key Input Cluster */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <div className="flex items-center gap-1 px-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary hidden sm:inline">
            Key
          </span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
            placeholder="Val"
            className="w-16 px-1.5 py-1 text-xs font-mono bg-surface-secondary border border-white/10 rounded focus:border-accent focus:outline-none text-textPrimary placeholder:text-textSecondary/50 text-center"
          />
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleRandomize}
            className="px-1.5 py-1 text-[11px] font-mono text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/60 rounded transition-colors"
            title="Generate random key"
          >
            Rnd
          </motion.button>
        </div>

        <div className="flex items-center gap-1 border-l border-white/10 pl-1 pr-0.5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleInsert}
            disabled={isFull}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
              isFull
                ? 'bg-surface-tertiary text-textSecondary/50 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-accent/90 shadow-sm'
            }`}
            title={isFull ? 'Tree capacity reached (15 nodes)' : 'Insert key into BST (O(log n))'}
          >
            <span>Insert</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="px-2.5 py-1 text-xs font-medium text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded transition-colors"
            title="Search for key and visualize branch path"
          >
            <span>Search</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleDelete}
            className="px-2.5 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
            title="Remove key from BST"
          >
            <span>Delete</span>
          </motion.button>
        </div>
      </div>

      {/* Quick Search Hit / Miss */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5 hidden md:inline">
          Probe
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePickHit}
            className="px-2 py-0.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition-colors font-mono"
            title="Pick an existing node to verify search hit"
          >
            Hit
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePickMiss}
            className="px-2 py-0.5 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded transition-colors font-mono"
            title="Pick an absent value to verify null leaf termination"
          >
            Miss
          </motion.button>
        </div>
      </div>

      {/* Traversal Trigger */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleTraversal}
          disabled={isTraversing || !bst || !bst.root}
          className="px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10 border border-accent/20 rounded transition-colors flex items-center gap-1.5"
          title="Step through traversal sequence with live output stream"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Run {traversalLabel}</span>
        </motion.button>
      </div>

      {/* Extreme Spine Queries */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5 hidden lg:inline">
          Extremes
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={bstFindMin}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Traverse leftmost spine to find minimum key"
          >
            Min
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={bstFindMax}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Traverse rightmost spine to find maximum key"
          >
            Max
          </motion.button>
        </div>
      </div>

      {/* Topologies & Presets */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5 hidden lg:inline">
          Preset
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => bstLoadPreset('balanced')}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Load balanced 7-node BST (O(log n) height)"
          >
            Balanced
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => bstLoadPreset('skewed')}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Load degenerate skewed tree (O(n) worst-case)"
          >
            Skewed
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => useAppStore.getState().initBST()}
            className="px-2 py-0.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
            title="Reset to default tree"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BSTControls;

