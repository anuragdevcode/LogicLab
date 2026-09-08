import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import AlgoTabs from '../ui/AlgoTabs';

const Topbar: React.FC = () => {
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const moduleTitle = useAppStore((s) => s.moduleTitle);
  const algoName = useAppStore((s) => s.algoName);

  return (
    <header className="h-12 border-b border-surface-tertiary bg-surface flex items-center justify-between px-4 select-none">
      {/* Left: Mobile Toggle & Notion Breadcrumb */}
      <div className="flex items-center gap-3 min-w-max">
        <button
          className="lg:hidden text-textSecondary hover:text-textPrimary p-1 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-md transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-textSecondary hidden sm:inline">LogicLab</span>
          <span className="text-textSecondary/40 hidden sm:inline">/</span>
          <span className="text-textSecondary hidden md:inline">{moduleTitle}</span>
          <span className="text-textSecondary/40 hidden md:inline">/</span>
          <span className="text-textPrimary font-semibold">{algoName || moduleTitle}</span>
        </div>
      </div>

      {/* Middle: Notion-style Database View Tabs */}
      <div className="hidden md:flex flex-1 justify-center px-4 overflow-hidden">
        <AlgoTabs />
      </div>

      {/* Right: Clean minimal status pill */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-secondary border border-surface-tertiary text-[11px] font-mono text-textSecondary">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="hidden sm:inline">Interactive Lab</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
