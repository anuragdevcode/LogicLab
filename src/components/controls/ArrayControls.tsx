import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

const ArrayControls: React.FC = () => {
  const arr = useAppStore((s) => s.arr);
  const setArr = useAppStore((s) => s.setArr);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(arr.join(', '));
  }, [arr]);

  const handleApply = () => {
    const parts = inputValue.split(/[\s,]+/).filter(Boolean);
    const values = parts.map(Number);

    if (!values.length || values.some((v) => !Number.isFinite(v) || v < 0)) {
      useAppStore.getState().setStatus('Enter numbers separated by commas', '#f43f5e');
      return;
    }

    setArr(values.slice(0, 40));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleApply();
  };

  return (
    <>
      <label className="flex items-center gap-2 text-sm text-textSecondary font-medium">
        <span>Values</span>
        <input
          type="text"
          className="ctrl-input w-48"
          placeholder="8, 4, 12, 1"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>
      <button className="btn-secondary text-sm" onClick={handleApply}>
        Use Values
      </button>
    </>
  );
};

export default ArrayControls;
