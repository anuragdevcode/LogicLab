import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className="viz-controls-overlay shadow-md"
    >
      <input
        type="number"
        className="ctrl-input w-20"
        placeholder="Value"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
      />
      <motion.button
        whileTap={{ scale: 0.94 }}
        className="btn-primary text-xs py-1.5 px-3 font-medium"
        onClick={handleInsert}
      >
        Insert
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.94 }}
        className="btn-secondary text-xs py-1.5 px-3 text-rose-400 hover:text-rose-300 font-medium"
        onClick={handleDelete}
      >
        Delete
      </motion.button>
    </motion.div>
  );
};

export default BSTControls;
