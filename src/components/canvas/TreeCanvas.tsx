import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { drawTree } from './CanvasRenderer';
import { TreeLayoutItem } from '@/types';

interface TreeCanvasProps {
  type?: 'bst' | 'heap';
  highlight?: number[];
}

export const TreeCanvas: React.FC<TreeCanvasProps> = ({ type = 'bst', highlight = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useCanvasSize(containerRef);

  const bst = useAppStore((s) => s.bst);
  const heap = useAppStore((s) => s.heap);
  const bstActiveNodes = useAppStore((s) => s.bstActiveNodes);
  const bstFoundNode = useAppStore((s) => s.bstFoundNode);
  const bstNarrative = useAppStore((s) => s.bstNarrative);
  const bstTraversalOutput = useAppStore((s) => s.bstTraversalOutput);

  const [hoveredVal, setHoveredVal] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const layoutRef = useRef<TreeLayoutItem[]>([]);

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

    let layout: TreeLayoutItem[] = [];
    if (type === 'bst' && bst) {
      layout = bst.toLayout(width, height);
    } else if (type === 'heap' && heap) {
      const res = heap.toLayout(width, height);
      layout = [
        ...res.edges.map((e) => ({ edge: true as const, from: e.from, to: e.to })),
        ...res.nodes.map((n) => ({ val: n.val, x: n.x, y: n.y })),
      ];
    }
    layoutRef.current = layout;

    const activeNodes = type === 'bst' ? bstActiveNodes : highlight;
    const foundNode = type === 'bst' ? bstFoundNode : null;

    drawTree(ctx, width, height, layout, activeNodes, foundNode, hoveredVal);
  }, [type, bst, heap, width, height, highlight, bstActiveNodes, bstFoundNode, hoveredVal]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let foundNodeVal: number | null = null;
    for (const item of layoutRef.current) {
      if (!('edge' in item) && item.val !== undefined) {
        const dist = Math.hypot(item.x - mx, item.y - my);
        if (dist <= 22) {
          foundNodeVal = item.val;
          setTooltipPos({ x: item.x, y: item.y });
          break;
        }
      }
    }

    if (foundNodeVal !== hoveredVal) {
      setHoveredVal(foundNodeVal);
      if (foundNodeVal === null) setTooltipPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredVal(null);
    setTooltipPos(null);
  };

  return (
    <div ref={containerRef} className="viz-area relative w-full h-full overflow-hidden bg-surface select-none">
      {/* Top Floating Narrative HUD Banner */}
      <AnimatePresence mode="wait">
        {type === 'bst' && bstNarrative && (
          <motion.div
            key={bstNarrative.badge + bstNarrative.reason}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className={`absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3.5 py-1.5 rounded-lg border backdrop-blur-md flex items-center gap-2.5 shadow-lg max-w-xl text-xs pointer-events-none ${
              bstNarrative.isError
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-200'
                : 'bg-surface/90 border-white/10 text-textPrimary'
            }`}
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                bstNarrative.isError
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-accent/20 text-accent border border-accent/30'
              }`}
            >
              {bstNarrative.badge}
            </span>
            <span className="font-mono text-[11px] truncate text-textSecondary">{bstNarrative.reason}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Hover Tooltip */}
      {hoveredVal !== null && tooltipPos && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-2 py-1 bg-surface-secondary/95 border border-white/10 rounded shadow-md text-xs font-mono text-textPrimary"
          style={{ left: tooltipPos.x, top: tooltipPos.y - 12 }}
        >
          Key: <span className="text-accent font-bold">{hoveredVal}</span>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Bottom Traversal Output Stream Banner */}
      <AnimatePresence>
        {type === 'bst' && bstTraversalOutput && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-surface/95 border border-white/10 rounded-lg px-4 py-2 backdrop-blur-md shadow-xl flex items-center gap-3 max-w-2xl overflow-x-auto"
          >
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-textSecondary">
                Traversal Output:
              </span>
              <span className="px-1.5 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-mono text-[10px] font-bold">
                {bstTraversalOutput.length} Visited
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 font-mono text-xs">
              {bstTraversalOutput.length === 0 ? (
                <span className="text-textSecondary italic text-[11px]">Visiting root...</span>
              ) : (
                bstTraversalOutput.map((val, idx) => (
                  <React.Fragment key={`${val}-${idx}`}>
                    {idx > 0 && <span className="text-white/20 text-[10px]">→</span>}
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${
                        idx === bstTraversalOutput.length - 1
                          ? 'bg-accent text-white border-accent shadow-sm'
                          : 'bg-surface-secondary text-textPrimary border-white/10'
                      }`}
                    >
                      {val}
                    </motion.span>
                  </React.Fragment>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
