import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const ComplexityTable: React.FC = () => {
  const complexityInfo = useAppStore((s) => s.complexityInfo);
  const algoName = useAppStore((s) => s.algoName);

  const LABEL_MAP: Record<string, string> = {
    best: 'Best Case', avg: 'Average', worst: 'Worst Case', space: 'Space',
    time: 'Time', push: 'Push', pop: 'Pop', peek: 'Peek',
    enqueue: 'Enqueue', dequeue: 'Dequeue', front: 'Front',
    insert: 'Insert', delete: 'Delete', search: 'Search',
    insert_head: 'Insert Head', insert_tail: 'Insert Tail',
    extractMin: 'Extract Min', extractMax: 'Extract Max',
  };

  const getBadColorClass = (v: string) => {
    if (v.includes('n²') || v.includes('n³')) return 'text-[#f43f5e]';
    if (v.includes('n log') || v.includes('n·')) return 'text-[#f59e0b]';
    return 'text-[#10b981]';
  };

  if (!complexityInfo || Object.keys(complexityInfo).length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-mono text-sm p-4">
        [ No complexity info ]
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col font-mono text-sm">
      <div className="text-white font-bold mb-3 pb-2 border-b border-[#1e293b]">
        {algoName || 'Complexity'}
      </div>
      <div className="flex flex-col gap-2">
        {Object.entries(complexityInfo).map(([k, v]) => (
          <div key={k} className="flex justify-between items-center">
            <span className="text-gray-400">{LABEL_MAP[k] || k}</span>
            <span className={`font-semibold ${getBadColorClass(String(v))}`}>{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplexityTable;
