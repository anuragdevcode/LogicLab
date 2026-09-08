import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const AlgoTabs: React.FC = () => {
  const algoList = useAppStore((s) => s.algoList);
  const algo = useAppStore((s) => s.algo);
  const setAlgo = useAppStore((s) => s.setAlgo);

  if (!algoList || algoList.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {algoList.map((item) => {
        const isActive = item.id === algo;
        return (
          <button
            key={item.id}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1e293b]'
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
