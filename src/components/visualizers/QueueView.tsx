import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const QueueView: React.FC = () => {
  const queueData = useAppStore((s) => s.queueData);
  const queueAction = useAppStore((s) => s.queueAction);
  const [val, setVal] = useState('');

  const handleEnqueue = () => {
    if (val.trim() === '') return;
    queueAction('enqueue', val);
    setVal('');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        {/* Controls */}
        <div className="w-full flex flex-col gap-3">
          <div className="flex gap-2 w-full justify-center">
            <input
              type="number"
              className="ctrl-input w-24"
              placeholder="Value"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEnqueue()}
            />
            <button className="btn-primary" onClick={handleEnqueue}>Enqueue</button>
          </div>
          <div className="flex gap-2 w-full justify-center">
            <button className="btn-secondary" onClick={() => queueAction('dequeue')}>Dequeue</button>
            <button className="btn-secondary" onClick={() => queueAction('front')}>Front</button>
          </div>
        </div>

        {/* Visualization */}
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="flex items-center gap-2 h-20 min-w-[200px] border-y-2 border-surface-tertiary p-2 bg-surface overflow-x-auto justify-start">
            {queueData.length === 0 ? (
              <div className="text-gray-500 font-mono text-sm w-full text-center">[ empty ]</div>
            ) : (
              <AnimatePresence initial={false}>
                {queueData.map((item, idx) => (
                  <motion.div
                    key={`${idx}-${item}`}
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className={`queue-cell ${idx === 0 ? 'front' : idx === queueData.length - 1 ? 'back' : ''}`}
                  >
                    {item}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          <div className="flex gap-5 text-[11px] font-mono text-gray-400">
            <span className="text-accent-green">← FRONT (dequeue)</span>
            <span className="text-accent">REAR (enqueue) →</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueView;
