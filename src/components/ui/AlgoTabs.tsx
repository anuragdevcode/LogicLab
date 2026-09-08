import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const AlgoTabs: React.FC = () => {
  const algoList = useAppStore((s) => s.algoList);
  const algo = useAppStore((s) => s.algo);
  const setAlgo = useAppStore((s) => s.setAlgo);

  if (!algoList || algoList.length === 0) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
      {algoList.map((item) => {
        const isActive = item.id === algo;
        return (
          <button
            key={item.id}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md text-xs transition-all duration-150 font-mono ${
              isActive
                ? 'bg-white/10 text-white font-semibold shadow-sm border border-white/10'
                : 'text-textSecondary hover:text-textPrimary hover:bg-white/[0.04]'
            }`}
            onClick={() => setAlgo(item.id)}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
};

export default AlgoTabs;
