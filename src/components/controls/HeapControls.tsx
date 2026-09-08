import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Heap } from '@/engines/heap';
import { HEAP_INFO } from '@/engines';

const HeapControls: React.FC = () => {
  const heap = useAppStore((s) => s.heap);
  const setHeap = useAppStore((s) => s.setHeap);
  const heapType = useAppStore((s) => s.heapType);
  const setHeapType = useAppStore((s) => s.setHeapType);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const [val, setVal] = useState('');

  const handleInsert = () => {
    if (val === '' || !heap) return;
    heap.insert(Number(val));
    setHeap(Object.assign(Object.create(Object.getPrototypeOf(heap)), heap));
    setVal('');
  };

  const handleExtract = () => {
    if (!heap || heap.data.length === 0) return;
    heap.extract();
    setHeap(Object.assign(Object.create(Object.getPrototypeOf(heap)), heap));
  };

  const switchType = (type: 'min' | 'max') => {
    const newAlgo = type === 'min' ? 'minheap' : 'maxheap';
    setAlgo(newAlgo);
    setHeapType(type);
    setHeap(new Heap(type));
    loadInfo(HEAP_INFO[newAlgo]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="viz-controls-overlay flex-wrap justify-center shadow-md"
    >
      <div className="flex items-center bg-surface rounded-md p-0.5 border border-white/10 mr-1">
        <motion.button
          whileTap={{ scale: 0.94 }}
          className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${
            heapType === 'min'
              ? 'bg-accent text-white font-semibold shadow-sm'
              : 'text-textSecondary hover:text-textPrimary'
          }`}
          onClick={() => switchType('min')}
        >
          Min
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${
            heapType === 'max'
              ? 'bg-accent text-white font-semibold shadow-sm'
              : 'text-textSecondary hover:text-textPrimary'
          }`}
          onClick={() => switchType('max')}
        >
          Max
        </motion.button>
      </div>

      <input
        type="number"
        className="ctrl-input w-20"
        placeholder="Value"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
      />
      <motion.button
        whileTap={{ scale: 0.94 }}
        className="btn-primary text-xs py-1.5 px-3 font-medium"
        onClick={handleInsert}
      >
        Insert
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.94 }}
        className="btn-secondary text-xs py-1.5 px-3 text-amber-400 hover:text-amber-300 font-medium"
        onClick={handleExtract}
      >
        Extract
      </motion.button>
    </motion.div>
  );
};

export default HeapControls;
