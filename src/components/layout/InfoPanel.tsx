import React from 'react';
import PseudocodeBox from '../ui/PseudocodeBox';
import ComplexityTable from '../ui/ComplexityTable';

const InfoPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-48 min-h-[192px] border-t border-[#1e293b] bg-[#0b0f19] overflow-hidden">
      <div className="border-b md:border-b-0 md:border-r border-[#1e293b] overflow-y-auto">
        <PseudocodeBox />
      </div>
      <div className="overflow-y-auto">
        <ComplexityTable />
      </div>
    </div>
  );
};

export default InfoPanel;
