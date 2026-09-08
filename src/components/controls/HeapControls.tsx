import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Heap } from '@/engines/heap';
import { HEAP_INFO } from '@/engines';

const HeapControls: React.FC = () => {
  const heap = useAppStore((s) => s.heap);
  const setHeap = useAppStore((s) => s.setHeap);
  const heapType = useAppStore((s) => s.heapType);
  const setHeapType = useAppStore((s) => s.setHeapType);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const algo = useAppStore((s) => s.algo);
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
    <div className="viz-controls-overlay flex-wrap justify-center">
      <div className="flex items-center bg-surface rounded-md p-0.5 border border-surface-tertiary mr-2">
        <button
          className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${
            heapType === 'min' ? 'bg-surface-tertiary text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
          }`}
          onClick={() => switchType('min')}
        >
          Min
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-sm font-medium transition-colors ${
            heapType === 'max' ? 'bg-surface-tertiary text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
          }`}
          onClick={() => switchType('max')}
        >
          Max
        </button>
      </div>

      <input
        type="number"
        className="ctrl-input w-20"
        placeholder="Value"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
      />
      <button className="btn-primary text-sm py-1.5 px-3" onClick={handleInsert}>
        Insert
      </button>
      <button className="btn-secondary text-sm py-1.5 px-3 text-accent-amber" onClick={handleExtract}>
        Extract
      </button>
    </div>
  );
};

export default HeapControls;
