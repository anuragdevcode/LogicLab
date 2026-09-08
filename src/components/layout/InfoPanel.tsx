import React from 'react';
import PseudocodeBox from '../ui/PseudocodeBox';
import ComplexityTable from '../ui/ComplexityTable';

const InfoPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-56 min-h-[224px] border-t border-surface-tertiary bg-surface overflow-hidden select-none">
      <div className="border-b md:border-b-0 md:border-r border-surface-tertiary overflow-y-auto">
        <PseudocodeBox />
      </div>
      <div className="overflow-y-auto bg-surface-secondary/30">
        <ComplexityTable />
      </div>
    </div>
  );
};

export default InfoPanel;
