import { useState, useEffect, RefObject } from 'react';

export function useCanvasSize(containerRef: RefObject<HTMLElement>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial size
    setSize({
      width: container.getBoundingClientRect().width,
      height: container.getBoundingClientRect().height,
    });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);

  return size;
}
