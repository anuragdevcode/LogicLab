import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { BST } from '@/engines/bst';

const BSTControls: React.FC = () => {
  const bst = useAppStore((s) => s.bst);
  const setBst = useAppStore((s) => s.setBst);
  const [val, setVal] = useState('');

  const handleInsert = () => {
    if (val === '' || !bst) return;
    bst.insert(Number(val));
    setBst(Object.assign(Object.create(Object.getPrototypeOf(bst)), bst));
    setVal('');
  };

  const handleDelete = () => {
    if (val === '' || !bst) return;
    bst.remove(Number(val));
    setBst(Object.assign(Object.create(Object.getPrototypeOf(bst)), bst));
    setVal('');
  };

  return (
    <div className="viz-controls-overlay">
      <input
        type="number"
        className="ctrl-input w-20"
        placeholder="Value"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
      />
      <button className="btn-primary text-sm py-1.5 px-3" onClick={handleInsert}>
        Insert
      </button>
      <button className="btn-secondary text-sm py-1.5 px-3 text-accent-rose" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default BSTControls;
