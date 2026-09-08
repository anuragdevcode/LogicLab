import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const MetricsBar: React.FC = () => {
  const metrics = useAppStore((s) => s.metrics);
  const status = useAppStore((s) => s.status);
  const statusColor = useAppStore((s) => s.statusColor);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2 bg-surface border-t border-surface-tertiary">
      <div className="metric-card">
        <span className="text-[10px] text-textSecondary uppercase tracking-wider">Comparisons</span>
        <span className="text-lg font-mono font-bold text-textPrimary">{metrics.comparisons}</span>
      </div>
      <div className="metric-card">
        <span className="text-[10px] text-textSecondary uppercase tracking-wider">Swaps</span>
        <span className="text-lg font-mono font-bold text-textPrimary">{metrics.swaps}</span>
      </div>
      <div className="metric-card">
        <span className="text-[10px] text-textSecondary uppercase tracking-wider">Array Accesses</span>
        <span className="text-lg font-mono font-bold text-textPrimary">{metrics.accesses}</span>
      </div>
      <div className="metric-card">
        <span className="text-[10px] text-textSecondary uppercase tracking-wider">Status</span>
        <span
          className="text-sm font-medium truncate px-2 text-center w-full"
          style={{ color: statusColor || '#3b82f6' }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default MetricsBar;
