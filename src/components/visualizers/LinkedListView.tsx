import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const LinkedListView: React.FC = () => {
  const llData = useAppStore((s) => s.llData);
  const llAction = useAppStore((s) => s.llAction);
  const [val, setVal] = useState('');
  const [delVal, setDelVal] = useState('');

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center items-center bg-surface p-4 rounded-lg border border-surface-tertiary">
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="ctrl-input w-20"
              placeholder="Value"
              value={val}
              onChange={(e) => setVal(e.target.value)}
            />
            <button className="btn-primary py-1.5" onClick={() => { if (val) { llAction('insert_head', val); setVal(''); } }}>
              Ins Head
            </button>
            <button className="btn-primary py-1.5" onClick={() => { if (val) { llAction('insert_tail', val); setVal(''); } }}>
              Ins Tail
            </button>
          </div>
          <div className="w-px h-8 bg-surface-tertiary hidden sm:block" />
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="ctrl-input w-20"
              placeholder="Value"
              value={delVal}
              onChange={(e) => setDelVal(e.target.value)}
            />
            <button className="btn-secondary text-accent-rose py-1.5" onClick={() => { if (delVal) { llAction('delete', delVal); setDelVal(''); } }}>
              Delete
            </button>
          </div>
          <button className="btn-secondary py-1.5" onClick={() => llAction('clear')}>
            Clear
          </button>
        </div>

        {/* Visualization */}
        <div className="flex items-center overflow-x-auto w-full p-4 min-h-[120px] justify-start md:justify-center">
          {llData.length === 0 ? (
            <div className="text-gray-500 font-mono">[ list is empty ]</div>
          ) : (
            <div className="flex items-center">
              <span className="text-xs font-bold text-accent-green mr-4 uppercase tracking-wider">Head →</span>

              <AnimatePresence mode="popLayout">
                {llData.map((item, idx) => (
                  <motion.div
                    key={`${idx}-${item}`}
                    layout
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="ll-node"
                  >
                    <div className="ll-box">
                      <div className="ll-data">{item}</div>
                      <div className="ll-next flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      </div>
                    </div>
                    <div className="ll-arrow font-mono text-textSecondary">→</div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div layout className="font-mono text-gray-500 text-sm font-bold bg-surface-tertiary px-3 py-1.5 rounded">
                NULL
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedListView;
