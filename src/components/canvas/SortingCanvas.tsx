import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { drawSortBars, clear, getSortBarAt, playFrequencyTone } from './CanvasRenderer';
import { SortStep } from '@/types';

export const SortingCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useCanvasSize(containerRef);

  const steps = useAppStore((s) => s.steps);
  const stepIdx = useAppStore((s) => s.stepIdx);
  const module = useAppStore((s) => s.module);
  const arr = useAppStore((s) => s.arr);
  const soundEnabled = useAppStore((s) => s.soundEnabled);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const step =
    module === 'sorting' && stepIdx > 0 && stepIdx <= steps.length
      ? (steps[stepIdx - 1] as SortStep)
      : arr && arr.length > 0
      ? { arr, cmp: [], done: [], swap: false, line: -1, reason: 'Initial array state. Ready to sort.' }
      : null;

  // Sound synthesis trigger on step changes
  useEffect(() => {
    if (!soundEnabled || !step || !step.arr || step.arr.length === 0) return;
    const maxVal = Math.max(...step.arr, 1);
    if (step.cmp && step.cmp.length > 0) {
      const activeIdx = step.cmp[step.cmp.length - 1];
      if (step.arr[activeIdx] !== undefined) {
        playFrequencyTone(step.arr[activeIdx], maxVal, step.swap ? 90 : 55);
      }
    } else if (step.pivot !== undefined && step.arr[step.pivot] !== undefined) {
      playFrequencyTone(step.arr[step.pivot], maxVal, 80);
    }
  }, [step, soundEnabled]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    if (step) {
      drawSortBars(ctx, width, height, step, { hoverIdx });
    } else {
      clear(ctx, width, height);
    }
  }, [step, width, height, hoverIdx]);

  // Mouse hover detection
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || !step || !step.arr || step.arr.length === 0) {
        setHoverIdx(null);
        setTooltipPos(null);
        return;
      }
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const idx = getSortBarAt(x, y, width, height, step.arr.length);
      setHoverIdx(idx);
      if (idx !== null) {
        setTooltipPos({ x, y: Math.max(40, y - 45) });
      } else {
        setTooltipPos(null);
      }
    },
    [width, height, step]
  );

  const handleMouseLeave = useCallback(() => {
    setHoverIdx(null);
    setTooltipPos(null);
  }, []);

  // Action badge color mapping
  const getActionBadge = (action?: string, swap?: boolean) => {
    if (swap) return { label: 'SWAP', bg: 'bg-rose-500/15 border-rose-500/40 text-rose-400' };
    switch (action) {
      case 'compare':
        return { label: 'COMPARE', bg: 'bg-blue-500/15 border-blue-500/40 text-blue-400' };
      case 'pivot':
        return { label: 'PIVOT / KEY', bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400' };
      case 'shift':
        return { label: 'SHIFT', bg: 'bg-purple-500/15 border-purple-500/40 text-purple-400' };
      case 'insert':
        return { label: 'INSERT', bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' };
      case 'split':
      case 'partition':
        return { label: 'PARTITION', bg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400' };
      case 'done':
        return { label: 'COMPLETE', bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' };
      default:
        return { label: 'IDLE', bg: 'bg-slate-700/30 border-slate-600/40 text-slate-300' };
    }
  };

  const badge = getActionBadge(step?.action, step?.swap);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="viz-area relative w-full h-full overflow-hidden bg-surface select-none"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Top Floating Narrative Banner */}
      <div className="absolute top-2.5 inset-x-4 flex items-center justify-center pointer-events-none z-10">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-secondary/90 backdrop-blur-md border border-white/10 shadow-sm text-xs font-mono pointer-events-auto max-w-xl overflow-hidden"
        >
          <motion.span
            key={badge.label}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
            className={`px-1.5 py-0.2 rounded text-[10px] font-bold tracking-wider ${badge.bg}`}
          >
            {badge.label}
          </motion.span>
          <span className="text-textSecondary truncate">
            {step?.reason || 'Ready. Click Play or Step to begin.'}
          </span>
        </motion.div>
      </div>

      {/* Interactive Bar Inspection Tooltip */}
      <AnimatePresence>
        {hoverIdx !== null && tooltipPos && step?.arr && step.arr[hoverIdx] !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            className="absolute -translate-x-1/2 pointer-events-none z-20 px-2.5 py-1 rounded-md bg-slate-900/95 border border-sky-500/50 shadow-xl text-xs font-mono text-white whitespace-nowrap flex items-center gap-1.5 backdrop-blur-sm"
          >
            <span className="text-sky-400 font-bold">arr[{hoverIdx}]</span>
            <span className="text-slate-400">=</span>
            <span className="text-emerald-300 font-bold text-sm">{step.arr[hoverIdx]}</span>
            {step.done?.includes(hoverIdx) && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 ml-1">
                SORTED
              </span>
            )}
            {step.pivot === hoverIdx && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 ml-1">
                PIVOT
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
