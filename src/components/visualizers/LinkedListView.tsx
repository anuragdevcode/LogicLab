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
        <div className="flex flex-wrap gap-3 justify-center items-center bg-surface-secondary/70 p-3 rounded-lg border border-white/10 shadow-sm">
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="ctrl-input w-20"
              placeholder="Value"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && val) {
                  llAction('insert_tail', val);
                  setVal('');
                }
              }}
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="btn-primary py-1 px-3"
              onClick={() => { if (val) { llAction('insert_head', val); setVal(''); } }}
            >
              Ins Head
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="btn-primary py-1 px-3"
              onClick={() => { if (val) { llAction('insert_tail', val); setVal(''); } }}
            >
              Ins Tail
            </motion.button>
          </div>
          <div className="w-px h-6 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="ctrl-input w-20"
              placeholder="Value"
              value={delVal}
              onChange={(e) => setDelVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && delVal) {
                  llAction('delete', delVal);
                  setDelVal('');
                }
              }}
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="btn-secondary text-rose-400 hover:text-rose-300 py-1 px-3"
              onClick={() => { if (delVal) { llAction('delete', delVal); setDelVal(''); } }}
            >
              Delete
            </motion.button>
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="btn-secondary py-1 px-3 text-textSecondary hover:text-textPrimary"
            onClick={() => llAction('clear')}
          >
            Clear
          </motion.button>
        </div>

        {/* Visualization */}
        <div className="flex items-center overflow-x-auto w-full p-4 min-h-[140px] justify-start md:justify-center">
          {llData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-textSecondary/50 font-mono text-xs"
            >
              [ Empty List: Head = null ]
            </motion.div>
          ) : (
            <div className="flex items-center">
              <span className="text-[11px] font-mono font-semibold text-emerald-400 mr-3 uppercase tracking-wider">
                Head →
              </span>

              <AnimatePresence mode="popLayout">
                {llData.map((item, idx) => (
                  <motion.div
                    key={`${idx}-${item}`}
                    layout
                    initial={{ opacity: 0, scale: 0.7, y: -24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: 24 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                    className="ll-node"
                  >
                    <div className="ll-box border border-white/10 bg-surface-secondary shadow-sm rounded-md">
                      <div className="ll-data font-mono text-xs px-3 py-2 border-r border-white/10 text-textPrimary font-semibold">
                        {item}
                      </div>
                      <div className="ll-next flex items-center justify-center px-2 py-2">
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ repeat: Infinity, duration: 3, delay: idx * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-accent"
                        />
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ll-arrow font-mono text-xs text-textSecondary/70 mx-1.5"
                    >
                      →
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <motion.div
                layout
                className="font-mono text-textSecondary/60 text-xs font-semibold bg-surface-secondary/60 border border-white/10 px-2.5 py-1.5 rounded-md"
              >
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
