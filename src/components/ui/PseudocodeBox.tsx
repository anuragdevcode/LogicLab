import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const PseudocodeBox: React.FC = () => {
  const pseudocode = useAppStore((s) => s.pseudocode);
  const currentLine = useAppStore((s) => s.currentLine);

  if (!pseudocode || pseudocode.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-textSecondary font-mono text-xs p-4 bg-surface">
        [ No pseudocode available ]
      </div>
    );
  }

  return (
    <div className="h-full bg-surface flex flex-col font-mono text-xs select-none">
      {/* Notion Code Block Header */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between text-[11px] text-textSecondary">
        <span className="font-semibold uppercase tracking-wider text-[10px]">Pseudocode</span>
        <span className="text-[10px] text-textSecondary/60">Execution Trace</span>
      </div>

      {/* Code Gutter & Lines */}
      <div className="p-3 overflow-y-auto flex-1 space-y-0.5">
        {pseudocode.map((line: string, idx: number) => {
          const isActive = currentLine === idx;
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 px-2 py-1 rounded transition-colors ${
                isActive
                  ? 'bg-accent/15 border-l-2 border-accent text-white font-semibold'
                  : 'text-textSecondary hover:text-textPrimary hover:bg-white/[0.02]'
              }`}
            >
              {/* Line Number Gutter */}
              <span className={`w-5 text-right flex-shrink-0 select-none ${isActive ? 'text-accent font-bold' : 'text-textSecondary/40'}`}>
                {idx + 1}
              </span>

              {/* Code Line */}
              <div
                className="flex-1 font-mono text-xs whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: line }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PseudocodeBox;
