import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const AlgoTabs: React.FC = () => {
  const algoList = useAppStore((s) => s.algoList);
  const algo = useAppStore((s) => s.algo);
  const setAlgo = useAppStore((s) => s.setAlgo);

  if (!algoList || algoList.length === 0) return null;

  return (
    <div className="relative flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
      {algoList.map((item) => {
        const isActive = item.id === algo;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.96 }}
            className={`relative whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-sans transition-colors duration-150 z-10 cursor-pointer border-none bg-transparent ${
              isActive ? 'text-white font-semibold' : 'text-textSecondary hover:text-textPrimary'
            }`}
            onClick={() => setAlgo(item.id)}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-md bg-white/10 border border-white/15 shadow-sm -z-10"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span>{item.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default AlgoTabs;
