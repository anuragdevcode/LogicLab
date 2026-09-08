import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

const DPControls: React.FC = () => {
  const dpAlgo = useAppStore((s) => s.dpAlgo);
  const dpConfig = useAppStore((s) => s.dpConfig);
  const setDpConfig = useAppStore((s) => s.setDpConfig);

  const [s1, setS1] = useState(dpConfig.s1);
  const [s2, setS2] = useState(dpConfig.s2);
  const [items, setItems] = useState(() =>
    dpConfig.items.map((item) => `${item.w}:${item.v}`).join(', ')
  );
  const [capacity, setCapacity] = useState(dpConfig.capacity.toString());

  useEffect(() => {
    setS1(dpConfig.s1);
    setS2(dpConfig.s2);
    setItems(dpConfig.items.map((item) => `${item.w}:${item.v}`).join(', '));
    setCapacity(dpConfig.capacity.toString());
  }, [dpConfig]);

  const handleApplyLCS = () => {
    if (!s1.trim() || !s2.trim()) {
      useAppStore.getState().setStatus('Enter both strings', '#f43f5e');
      return;
    }
    setDpConfig({ s1: s1.trim().toUpperCase(), s2: s2.trim().toUpperCase() });
  };

  const handleApplyKnapsack = () => {
    try {
      const parsedItems = items.split(',').map((part) => {
        const [w, v] = part.trim().split(':').map(Number);
        if (!Number.isInteger(w) || !Number.isFinite(v) || w <= 0 || v < 0) throw new Error();
        return { w, v };
      });

      const cap = Number(capacity);
      if (parsedItems.length === 0 || parsedItems.length > 6 || !Number.isInteger(cap) || cap < 0 || cap > 12) {
        throw new Error();
      }

      setDpConfig({ items: parsedItems, capacity: cap });
    } catch {
      useAppStore.getState().setStatus('Use items like 2:6, 3:12 and capacity 0-12', '#f43f5e');
    }
  };

  if (dpAlgo === 'lcs') {
    return (
      <>
        <label className="flex items-center gap-2 text-sm text-textSecondary font-medium">
          <span>String A</span>
          <input type="text" className="ctrl-input w-24 uppercase" maxLength={8} value={s1} onChange={(e) => setS1(e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-sm text-textSecondary font-medium">
          <span>String B</span>
          <input type="text" className="ctrl-input w-24 uppercase" maxLength={8} value={s2} onChange={(e) => setS2(e.target.value)} />
        </label>
        <button className="btn-secondary text-sm" onClick={handleApplyLCS}>Use Strings</button>
      </>
    );
  }

  return (
    <>
      <label className="flex items-center gap-2 text-sm text-textSecondary font-medium">
        <span>Items</span>
        <input type="text" className="ctrl-input w-48" placeholder="weight:value" value={items} onChange={(e) => setItems(e.target.value)} />
      </label>
      <label className="flex items-center gap-2 text-sm text-textSecondary font-medium">
        <span>Capacity</span>
        <input type="number" className="ctrl-input w-16" min="0" max="12" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
      </label>
      <button className="btn-secondary text-sm" onClick={handleApplyKnapsack}>Use Items</button>
    </>
  );
};

export default DPControls;
