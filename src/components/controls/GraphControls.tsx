import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const DEFAULT_GRAPH_NODES = [
  { id: 0, label: 'A' }, { id: 1, label: 'B' }, { id: 2, label: 'C' },
  { id: 3, label: 'D' }, { id: 4, label: 'E' }, { id: 5, label: 'F' },
];

const GraphControls: React.FC = () => {
  const graphStart = useAppStore((s) => s.graphStart);
  const graphTarget = useAppStore((s) => s.graphTarget);
  const setGraphStart = useAppStore((s) => s.setGraphStart);
  const setGraphTarget = useAppStore((s) => s.setGraphTarget);

  return (
    <>
      <label className="flex items-center gap-2 text-sm text-textSecondary font-medium">
        <span>Start</span>
        <select
          className="ctrl-input bg-surface-secondary"
          value={graphStart}
          onChange={(e) => setGraphStart(Number(e.target.value))}
        >
          {DEFAULT_GRAPH_NODES.map((node) => (
            <option key={node.id} value={node.id}>{node.label}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-textSecondary font-medium">
        <span>Destination</span>
        <select
          className="ctrl-input bg-surface-secondary"
          value={graphTarget}
          onChange={(e) => setGraphTarget(Number(e.target.value))}
        >
          {DEFAULT_GRAPH_NODES.map((node) => (
            <option key={node.id} value={node.id}>{node.label}</option>
          ))}
        </select>
      </label>
    </>
  );
};

export default GraphControls;
