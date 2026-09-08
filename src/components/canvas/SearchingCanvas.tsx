import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import { drawSearchBars, clear } from './CanvasRenderer';
import { SearchStep } from '@/types';

export const SearchingCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useCanvasSize(containerRef);

  const steps = useAppStore((s) => s.steps);
  const stepIdx = useAppStore((s) => s.stepIdx);
  const module = useAppStore((s) => s.module);
  const arr = useAppStore((s) => s.arr);
  const target = useAppStore((s) => s.target);

  const step = module === 'searching' && stepIdx > 0 && stepIdx <= steps.length
    ? (steps[stepIdx - 1] as SearchStep)
    : arr && arr.length > 0
    ? { arr, target, found: -1, line: -1 }
    : null;

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
      drawSearchBars(ctx, width, height, step);
    } else {
      clear(ctx, width, height);
    }
  }, [step, width, height]);

  return (
    <div ref={containerRef} className="viz-area relative w-full h-full overflow-hidden bg-surface">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
};
