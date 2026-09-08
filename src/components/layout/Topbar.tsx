import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import AlgoTabs from '../ui/AlgoTabs';

const Topbar: React.FC = () => {
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const moduleTitle = useAppStore((s) => s.moduleTitle);
  const complexityInfo = useAppStore((s) => s.complexityInfo);

  const getBadColor = (v: string) => {
    if (v.includes('n²') || v.includes('n³')) return 'text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/20';
    if (v.includes('n log') || v.includes('n·')) return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
    return 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20';
  };

  const timeComplexity = complexityInfo?.avg || complexityInfo?.time || complexityInfo?.worst;
  const spaceComplexity = complexityInfo?.space;

  return (
    <header className="h-14 border-b border-surface-tertiary bg-surface flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-textSecondary hover:text-textPrimary p-1 bg-transparent border-none cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold text-textPrimary whitespace-nowrap">
          {moduleTitle || 'Algorithm Visualizer'}
        </h1>
      </div>

      <div className="hidden md:block flex-1 mx-6 overflow-hidden">
        <AlgoTabs />
      </div>

      <div className="flex items-center gap-2 text-xs font-mono">
        {timeComplexity && (
          <span className={`px-2 py-1 rounded border ${getBadColor(timeComplexity)}`}>
            Time: {timeComplexity}
          </span>
        )}
        {spaceComplexity && (
          <span className="px-2 py-1 rounded border text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hidden sm:inline-block">
            Space: {spaceComplexity}
          </span>
        )}
      </div>
    </header>
  );
};

export default Topbar;
