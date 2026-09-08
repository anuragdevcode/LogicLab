import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { STACK_CAPACITY, LINKED_LIST_CAPACITY, BST_CAPACITY, HEAP_CAPACITY } from '@/engines';

const MetricsBar: React.FC = () => {
  const module = useAppStore((s) => s.module);
  const algo = useAppStore((s) => s.algo);
  const metrics = useAppStore((s) => s.metrics);
  const stackData = useAppStore((s) => s.stackData);
  const queueCount = useAppStore((s) => s.queueCount);
  const llData = useAppStore((s) => s.llData);
  const bst = useAppStore((s) => s.bst);
  const heap = useAppStore((s) => s.heap);
  const heapType = useAppStore((s) => s.heapType);
  const status = useAppStore((s) => s.status);
  const statusColor = useAppStore((s) => s.statusColor);

  const isStackModule = module === 'stack';
  const isLLModule = module === 'linkedlist';
  const isBSTModule = module === 'bst';
  const isHeapModule = module === 'heap';
  const isQueue = algo === 'queue' || algo === 'circular_queue';

  const card1Label = isHeapModule
    ? 'Nodes'
    : isBSTModule
    ? 'Nodes'
    : isLLModule
    ? 'Nodes'
    : isStackModule
    ? isQueue
      ? 'Enqueues'
      : 'Pushes'
    : 'Comparisons';
  const card1Value = isHeapModule
    ? `${heap ? heap.data.length : 0} / ${HEAP_CAPACITY}`
    : isBSTModule
    ? `${bst ? bst.getNodeCount() : 0} / ${BST_CAPACITY}`
    : isLLModule
    ? `${llData.length} / ${LINKED_LIST_CAPACITY}`
    : isStackModule
    ? metrics.accesses
    : metrics.comparisons;

  const card2Label = isHeapModule
    ? heapType === 'min' ? 'Root (Min)' : 'Root (Max)'
    : isBSTModule
    ? 'Height'
    : isLLModule
    ? 'Head'
    : isStackModule
    ? isQueue
      ? 'Dequeues'
      : 'Pops'
    : 'Swaps';
  const card2Value = isHeapModule
    ? heap && heap.data.length > 0
      ? `${heap.data[0]}`
      : 'null'
    : isBSTModule
    ? `${bst ? bst.getHeight() : 0}`
    : isLLModule
    ? llData.length > 0
      ? `${llData[0]}`
      : 'null'
    : isStackModule
    ? metrics.swaps
    : metrics.swaps;

  const card3Label = isHeapModule
    ? 'Height'
    : isBSTModule
    ? 'Root'
    : isLLModule
    ? 'Tail'
    : isStackModule
    ? 'Occupancy'
    : 'Array Accesses';
  const card3Value = isHeapModule
    ? `${heap ? heap.getHeight() : 0}`
    : isBSTModule
    ? bst && bst.root
      ? `${bst.root.val}`
      : 'null'
    : isLLModule
    ? llData.length > 0
      ? `${llData[llData.length - 1]}`
      : 'null'
    : isStackModule
    ? `${isQueue ? queueCount : stackData.length} / ${STACK_CAPACITY}`
    : metrics.accesses;

  return (
    <div className="h-9 px-4 bg-surface border-t border-white/5 flex items-center justify-between text-xs select-none overflow-x-auto flex-shrink-0">
      {/* Left: Metrics Strip */}
      <div className="flex items-center gap-4 min-w-max">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-textSecondary">{card1Label}:</span>
          <motion.span
            key={`m1-${card1Value}`}
            initial={{ scale: 1.25, color: '#60a5fa' }}
            animate={{ scale: 1, color: '#f8fafc' }}
            transition={{ duration: 0.18 }}
            className="font-semibold"
          >
            {card1Value}
          </motion.span>
        </div>

        <span className="text-white/10">•</span>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-textSecondary">{card2Label}:</span>
          <motion.span
            key={`m2-${card2Value}`}
            initial={{ scale: 1.25, color: '#f43f5e' }}
            animate={{ scale: 1, color: '#f8fafc' }}
            transition={{ duration: 0.18 }}
            className="font-semibold"
          >
            {card2Value}
          </motion.span>
        </div>

        <span className="text-white/10">•</span>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-textSecondary">{card3Label}:</span>
          <motion.span
            key={`m3-${card3Value}`}
            initial={{ scale: 1.2, color: '#38bdf8' }}
            animate={{ scale: 1, color: '#3b82f6' }}
            transition={{ duration: 0.18 }}
            className="font-semibold text-accent"
          >
            {card3Value}
          </motion.span>
        </div>
      </div>

      {/* Right: Live Engine Status */}
      <div className="flex items-center gap-2 max-w-sm sm:max-w-md truncate pl-4">
        <motion.span
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: statusColor || '#3b82f6' }}
        />
        <motion.span
          key={status}
          initial={{ opacity: 0.6, y: -1 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="font-mono text-[11px] truncate"
          style={{ color: statusColor || '#94a3b8' }}
        >
          {status}
        </motion.span>
      </div>
    </div>
  );
};

export default MetricsBar;
