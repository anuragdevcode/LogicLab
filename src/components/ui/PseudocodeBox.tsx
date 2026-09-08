import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const PseudocodeBox: React.FC = () => {
  const pseudocode = useAppStore((s) => s.pseudocode);
  const currentLine = useAppStore((s) => s.currentLine);

  if (!pseudocode || pseudocode.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-mono text-sm bg-[#060910]">
        [ No pseudocode available ]
      </div>
    );
  }

  return (
    <div className="h-full bg-[#060910] p-4 overflow-y-auto font-mono text-sm">
      {pseudocode.map((line: string, idx: number) => (
        <div
          key={idx}
          className={`pseudo-line ${currentLine === idx ? 'active' : ''}`}
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}
    </div>
  );
};

export default PseudocodeBox;
