import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import ArrayControls from './ArrayControls';

const SearchControls: React.FC = () => {
  const { target, setTarget } = useAppStore();
  const [targetValue, setTargetValue] = useState(target.toString());

  useEffect(() => {
    setTargetValue(target.toString());
  }, [target]);

  const handleApplyTarget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTargetValue(val);
    const num = Number(val);
    if (Number.isFinite(num)) {
      setTarget(num);
    }
  };

  return (
    <>
      <ArrayControls />
      <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
        <span>Key</span>
        <input 
          type="number" 
          className="ctrl-input w-20" 
          placeholder="Key"
          value={targetValue}
          onChange={handleApplyTarget}
        />
      </label>
    </>
  );
};

export default SearchControls;
