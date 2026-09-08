import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { drawGraph, clear } from './CanvasRenderer';
import { GraphStep } from '@/types';
import { DEFAULT_NODES, DEFAULT_EDGES } from '@/engines';

export const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useCanvasSize(containerRef);

  const steps = useAppStore((s) => s.steps);
  const stepIdx = useAppStore((s) => s.stepIdx);
  const module = useAppStore((s) => s.module);
  const graphStart = useAppStore((s) => s.graphStart);
  const graphTarget = useAppStore((s) => s.graphTarget);

  const step = module === 'graph' && stepIdx > 0 && stepIdx <= steps.length
    ? (steps[stepIdx - 1] as GraphStep)
    : ({
        start: graphStart,
        target: graphTarget,
        visited: new Set<number>(),
        current: -1,
        prev: {},
        line: -1,
      } as unknown as GraphStep);

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

    drawGraph(ctx, width, height, DEFAULT_NODES, DEFAULT_EDGES, step || {});
  }, [step, width, height]);

  return (
    <div ref={containerRef} className="viz-area relative w-full h-full overflow-hidden bg-surface">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
