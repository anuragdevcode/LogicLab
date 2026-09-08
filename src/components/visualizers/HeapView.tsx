import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { drawTree } from '@/components/canvas/CanvasRenderer';
import { TreeLayoutItem } from '@/types';
import { HEAP_CAPACITY } from '@/engines';

export const HeapView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useCanvasSize(containerRef);

  const heap = useAppStore((s) => s.heap);
  const heapType = useAppStore((s) => s.heapType);
  const heapActiveIndices = useAppStore((s) => s.heapActiveIndices);
  const heapSwappingIndices = useAppStore((s) => s.heapSwappingIndices);
  const heapNarrative = useAppStore((s) => s.heapNarrative);
  const heapSortedOutput = useAppStore((s) => s.heapSortedOutput);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredVal, setHoveredVal] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const layoutRef = useRef<TreeLayoutItem[]>([]);

  const data = heap ? heap.data : [];

  // Canvas height accounts for bottom array strip (approx 78px)
  const treeCanvasHeight = Math.max(160, height - 86);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || treeCanvasHeight === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = treeCanvasHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${treeCanvasHeight}px`;
    ctx.scale(dpr, dpr);

    let layout: TreeLayoutItem[] = [];
    if (heap && data.length > 0) {
      const res = heap.toLayout(width, treeCanvasHeight);
      layout = [
        ...res.edges.map((e) => ({ edge: true as const, from: e.from, to: e.to })),
        ...res.nodes.map((n) => ({ val: n.val, x: n.x, y: n.y, idx: n.idx })),
      ];
    }
    layoutRef.current = layout;

    const activeVals = heapActiveIndices
      .filter((i) => i >= 0 && i < data.length)
      .map((i) => data[i]);

    drawTree(
      ctx,
      width,
      treeCanvasHeight,
      layout,
      activeVals,
      null,
      hoveredVal,
      heapSwappingIndices,
      true // showIndices = true
    );
  }, [heap, data, width, treeCanvasHeight, heapActiveIndices, heapSwappingIndices, hoveredVal]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let foundIdx: number | null = null;
    let foundVal: number | null = null;

    for (const item of layoutRef.current) {
      if (!('edge' in item) && item.val !== undefined) {
        const dist = Math.hypot(item.x - mx, item.y - my);
        if (dist <= 22) {
          foundVal = item.val;
          foundIdx = item.idx !== undefined ? item.idx : null;
          setTooltipPos({ x: item.x, y: item.y });
          break;
        }
      }
    }

    if (foundVal !== hoveredVal || foundIdx !== hoveredIdx) {
      setHoveredVal(foundVal);
      setHoveredIdx(foundIdx);
      if (foundVal === null) setTooltipPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredVal(null);
    setHoveredIdx(null);
    setTooltipPos(null);
  };

  return (
    <div
      ref={containerRef}
      className="viz-area relative w-full h-full flex flex-col justify-between overflow-hidden bg-surface select-none"
    >
      {/* Top Floating Narrative HUD Banner */}
      <AnimatePresence mode="wait">
        {heapNarrative && (
          <motion.div
            key={heapNarrative.badge + heapNarrative.reason}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className={`absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1.5 rounded-lg border backdrop-blur-md flex items-center gap-2.5 shadow-lg max-w-xl text-xs pointer-events-none ${
              heapNarrative.isError
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-200'
                : 'bg-surface/90 border-white/10 text-textPrimary'
            }`}
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                heapNarrative.isError
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-accent/20 text-accent border border-accent/30'
              }`}
            >
              {heapNarrative.badge}
            </span>
            <span className="font-mono text-[11px] truncate text-textSecondary">{heapNarrative.reason}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Hover Tooltip */}
      {hoveredIdx !== null && tooltipPos && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-2.5 py-1.5 bg-surface-secondary/95 border border-white/10 rounded-md shadow-lg text-xs font-mono text-textPrimary"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 14 }}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-accent">Index [{hoveredIdx}]:</span>
            <span>{data[hoveredIdx]}</span>
          </div>
          <div className="text-[10px] text-textSecondary mt-0.5 space-x-2">
            {hoveredIdx > 0 && <span>P: [{Math.floor((hoveredIdx - 1) / 2)}]</span>}
            {2 * hoveredIdx + 1 < data.length && <span>L: [{2 * hoveredIdx + 1}]</span>}
            {2 * hoveredIdx + 2 < data.length && <span>R: [{2 * hoveredIdx + 2}]</span>}
          </div>
        </div>
      )}

      {/* Complete Binary Tree Canvas */}
      <div className="relative flex-1 w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* Live Heap Sort Output Stream (when sorting) */}
      <AnimatePresence>
        {heapSortedOutput && heapSortedOutput.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="px-4 py-1.5 bg-surface-secondary/90 border-t border-white/10 flex items-center gap-2 overflow-x-auto text-xs"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary flex-shrink-0">
              Sorted Stream:
            </span>
            <div className="flex items-center gap-1 font-mono text-[11px] overflow-x-auto">
              {heapSortedOutput.map((val, idx) => (
                <React.Fragment key={`${val}-${idx}`}>
                  {idx > 0 && <span className="text-white/20">→</span>}
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold">
                    {val}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contiguous Array Backing Strip */}
      <div className="w-full bg-surface-secondary/95 border-t border-white/10 px-4 py-2.5 flex flex-col gap-1 flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center justify-between text-[10px] font-mono text-textSecondary uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span>Contiguous Array Backing (0-indexed memory)</span>
            <span className="text-white/20">•</span>
            <span>
              {heapType === 'min' ? 'Min' : 'Max'}-Heap Invariant:{' '}
              {heapType === 'min' ? 'A[parent] <= A[child]' : 'A[parent] >= A[child]'}
            </span>
          </div>
          {hoveredIdx !== null && (
            <div className="hidden sm:flex items-center gap-3 text-accent font-semibold lowercase">
              <span>i: {hoveredIdx}</span>
              {hoveredIdx > 0 && (
                <span className="text-textSecondary">
                  parent: Math.floor(({hoveredIdx}-1)/2) = [{Math.floor((hoveredIdx - 1) / 2)}]
                </span>
              )}
              {2 * hoveredIdx + 1 < HEAP_CAPACITY && (
                <span className="text-textSecondary">
                  left: 2({hoveredIdx})+1 = [{2 * hoveredIdx + 1}]
                </span>
              )}
              {2 * hoveredIdx + 2 < HEAP_CAPACITY && (
                <span className="text-textSecondary">
                  right: 2({hoveredIdx})+2 = [{2 * hoveredIdx + 2}]
                </span>
              )}
            </div>
          )}
        </div>

        {/* Array Cells Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 font-mono">
          {Array.from({ length: HEAP_CAPACITY }).map((_, idx) => {
            const hasVal = idx < data.length;
            const val = hasVal ? data[idx] : null;

            const isActive = heapActiveIndices.includes(idx);
            const isSwapping =
              heapSwappingIndices !== null &&
              (heapSwappingIndices[0] === idx || heapSwappingIndices[1] === idx);
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={`cell-${idx}`}
                onMouseEnter={() => {
                  if (hasVal) {
                    setHoveredIdx(idx);
                    setHoveredVal(val);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredIdx(null);
                  setHoveredVal(null);
                }}
                animate={{
                  scale: isSwapping ? 1.08 : isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.12 }}
                className={`flex flex-col items-center flex-shrink-0 w-11 rounded-md border transition-colors ${
                  isSwapping
                    ? 'bg-amber-950/80 border-amber-400 shadow-md'
                    : isActive
                    ? 'bg-blue-950/70 border-blue-400 shadow-md'
                    : isHovered
                    ? 'bg-surface-tertiary border-accent shadow-sm'
                    : hasVal
                    ? 'bg-surface border-white/10 hover:border-white/20'
                    : 'bg-surface/30 border-white/5 opacity-40'
                }`}
              >
                {/* Index label */}
                <div
                  className={`text-[9px] w-full text-center py-0.5 border-b border-white/5 ${
                    isSwapping
                      ? 'text-amber-300 font-bold bg-amber-500/20'
                      : isActive
                      ? 'text-blue-300 font-bold bg-blue-500/20'
                      : isHovered
                      ? 'text-accent font-bold'
                      : 'text-textSecondary/70'
                  }`}
                >
                  [{idx}]
                </div>

                {/* Value cell */}
                <div
                  className={`text-xs font-semibold py-1.5 ${
                    isSwapping
                      ? 'text-amber-200'
                      : isActive
                      ? 'text-blue-100'
                      : hasVal
                      ? 'text-textPrimary'
                      : 'text-textSecondary/30'
                  }`}
                >
                  {hasVal ? val : '—'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeapView;
