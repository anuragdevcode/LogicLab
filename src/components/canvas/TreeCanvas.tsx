import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { drawTree, clear } from './CanvasRenderer';
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

    drawTree(ctx, width, height, layout, highlight);
  }, [type, bst, heap, width, height, highlight]);

  return (
    <div ref={containerRef} className="viz-area relative w-full h-full overflow-hidden bg-surface">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
