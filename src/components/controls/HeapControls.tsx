import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { HEAP_CAPACITY } from '@/engines';
import { HeapMode } from '@/types';

const HeapControls: React.FC = () => {
  const heap = useAppStore((s) => s.heap);
  const heapType = useAppStore((s) => s.heapType);
  const heapMode = useAppStore((s) => s.heapMode);
  const setHeapMode = useAppStore((s) => s.setHeapMode);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const heapInsert = useAppStore((s) => s.heapInsert);
  const heapExtract = useAppStore((s) => s.heapExtract);
  const heapPeek = useAppStore((s) => s.heapPeek);
  const heapBuild = useAppStore((s) => s.heapBuild);
  const heapRunSort = useAppStore((s) => s.heapRunSort);

  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const nodeCount = heap ? heap.data.length : 0;
  const isFull = nodeCount >= HEAP_CAPACITY;
  const isEmpty = nodeCount === 0;

  const handleRandomize = () => {
    const r = Math.floor(Math.random() * 88) + 11;
    setInputVal(r.toString());
  };

  const handleInsert = async () => {
    const val = inputVal.trim() !== '' ? Number(inputVal) : Math.floor(Math.random() * 88) + 11;
    setIsProcessing(true);
    const ok = await heapInsert(val);
    if (ok) setInputVal('');
    setIsProcessing(false);
  };

  const handleExtract = async () => {
    if (isEmpty || isProcessing) return;
    setIsProcessing(true);
    await heapExtract();
    setIsProcessing(false);
  };

  const handlePeek = () => {
    heapPeek();
  };

  const handleRunSort = async () => {
    if (isEmpty || isProcessing) return;
    setIsProcessing(true);
    await heapRunSort();
    setIsProcessing(false);
  };

  const switchType = (type: 'min' | 'max') => {
    const newMode: HeapMode = type === 'min' ? 'minheap' : 'maxheap';
    setAlgo(newMode);
    setHeapMode(newMode);
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap select-none">
      {/* Heap Type Toggle (Min vs Max) */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => switchType('min')}
            className={`px-2.5 py-1 text-xs rounded transition-colors font-medium ${
              heapType === 'min'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
            title="Min Heap: root holds absolute minimum"
          >
            Min Heap
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => switchType('max')}
            className={`px-2.5 py-1 text-xs rounded transition-colors font-medium ${
              heapType === 'max'
                ? 'bg-accent text-white font-semibold shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
            title="Max Heap: root holds absolute maximum"
          >
            Max Heap
          </motion.button>
        </div>
      </div>

      {/* Key Input & Operations Cluster */}
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
            disabled={isFull || isProcessing}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1 ${
              isFull || isProcessing
                ? 'bg-surface-tertiary text-textSecondary/50 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-accent/90 shadow-sm'
            }`}
            title={isFull ? 'Heap capacity reached (15 nodes)' : 'Insert element and sift up (O(log n))'}
          >
            <span>Insert</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleExtract}
            disabled={isEmpty || isProcessing}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              isEmpty || isProcessing
                ? 'text-textSecondary/50 cursor-not-allowed'
                : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
            }`}
            title={`Extract root (${heapType === 'min' ? 'minimum' : 'maximum'}) and sift down (O(log n))`}
          >
            <span>Extract {heapType === 'min' ? 'Min' : 'Max'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePeek}
            disabled={isEmpty || isProcessing}
            className="px-2 py-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded transition-colors"
            title="Inspect root element in O(1) time"
          >
            <span>Peek</span>
          </motion.button>
        </div>
      </div>

      {/* Heap Sort Action */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleRunSort}
          disabled={isEmpty || isProcessing}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            isEmpty || isProcessing
              ? 'text-textSecondary/50 cursor-not-allowed'
              : 'text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20'
          }`}
          title="Repeatedly extract root into sorted stream (O(n log n))"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Heap Sort</span>
        </motion.button>
      </div>

      {/* Presets & Heapify */}
      <div className="inline-flex items-center bg-surface p-0.5 rounded-md border border-white/10">
        <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary px-1.5 hidden lg:inline">
          Preset
        </span>
        <div className="flex items-center gap-0.5 bg-surface-secondary p-0.5 rounded-md border border-white/5">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => heapBuild('sample')}
            disabled={isProcessing}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Load sample 7-node heap"
          >
            Sample (7)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => heapBuild('random')}
            disabled={isProcessing}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Generate random 7-node heap"
          >
            Random (7)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => heapBuild('full')}
            disabled={isProcessing}
            className="px-2 py-0.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/50 rounded transition-colors"
            title="Fill complete 4-level heap (15 nodes)"
          >
            Full (15)
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => useAppStore.getState().initHeap(heapMode)}
            disabled={isProcessing}
            className="px-2 py-0.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
            title="Reset to default heap"
          >
            Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HeapControls;
