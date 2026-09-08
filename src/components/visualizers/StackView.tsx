import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import QueueView from './QueueView';

const StackView: React.FC = () => {
  const algo = useAppStore((s) => s.algo);
  const stackData = useAppStore((s) => s.stackData);
  const stackAction = useAppStore((s) => s.stackAction);
  const [val, setVal] = useState('');

  if (algo === 'queue') {
    return <QueueView />;
  }

  const handlePush = () => {
    if (val.trim() === '') return;
    stackAction('push', val);
    setVal('');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        {/* Controls */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-2 w-full justify-center">
            <input
              type="number"
              className="ctrl-input w-24"
              placeholder="Value"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
            />
            <button className="btn-primary" onClick={handlePush}>Push</button>
          </div>
          <div className="flex gap-2 w-full justify-center">
            <button className="btn-secondary" onClick={() => stackAction('pop')}>Pop</button>
            <button className="btn-secondary" onClick={() => stackAction('peek')}>Peek</button>
          </div>
        </div>

        {/* Visualization */}
        <div className="flex flex-col-reverse items-center justify-start w-48 h-64 border-b-2 border-l-2 border-r-2 border-surface-tertiary rounded-b-lg bg-surface p-2 overflow-hidden gap-2">
          {stackData.length === 0 ? (
            <div className="text-gray-500 font-mono text-sm h-full flex items-center">[ empty ]</div>
          ) : (
            <AnimatePresence initial={false}>
              {stackData.map((item, idx) => {
                const isTop = idx === stackData.length - 1;
                return (
                  <motion.div
                    key={`${idx}-${item}`}
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className={`stack-frame w-full ${isTop ? 'highlight' : ''}`}
                  >
                    {item}
                    {isTop && (
                      <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-bold text-accent">
                        ← TOP
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default StackView;
