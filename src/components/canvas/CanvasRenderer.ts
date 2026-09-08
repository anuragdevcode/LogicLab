import { SortStep, SearchStep, GraphNode, GraphEdge, GraphStep, TreeLayoutItem } from '@/types';

export const C = {
  bg:      '#0b0f19',
  base:    '#1e293b',
  accent:  '#3b82f6',
  accent2: '#10b981',
  accent3: '#f43f5e',
  accent4: '#f59e0b',
  text:    '#f8fafc',
  text2:   '#94a3b8',
  border:  '#1e293b',
};

export function clear(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);
}

let audioCtx: AudioContext | null = null;

export function playFrequencyTone(val: number, maxVal: number, durationMs = 65) {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const minFreq = 180;
    const maxFreq = 920;
    const norm = Math.max(0, Math.min(1, val / maxVal));
    const freq = minFreq + norm * (maxFreq - minFreq);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + durationMs / 1000);
  } catch {
    // Ignore audio context autoplay restrictions
  }
}

export function getSortBarAt(x: number, y: number, w: number, h: number, n: number): number | null {
  if (n === 0) return null;
  const barW = Math.floor((w - 40) / n) - 2;
  const padX = 20;
  if (x < padX || x > padX + n * (barW + 2)) return null;
  const idx = Math.floor((x - padX) / (barW + 2));
  if (idx >= 0 && idx < n) {
    return idx;
  }
  return null;
}

export function drawSortBars(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: SortStep,
  options?: {
    hoverIdx?: number | null;
  }
) {
  clear(ctx, w, h);
  const { arr, cmp = [], swap = false, done = [], pivot = -1, pointers = {}, range } = state;
  const hoverIdx = options?.hoverIdx ?? null;
  const n = arr.length;
  if (n === 0) return;

  const maxVal = Math.max(...arr, 1);
  const barW = Math.floor((w - 40) / n) - 2;
  const padX = 20;
  const maxH = h - 90;

  // 1. Draw Active Partition / Subarray Range Backdrop
  if (range && range.length === 2) {
    const [lo, hi] = range;
    if (lo >= 0 && hi < n && hi >= lo) {
      const rx = padX + lo * (barW + 2) - 3;
      const rw = (hi - lo + 1) * (barW + 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.fillRect(rx, 15, rw, h - 50);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(rx, 15, rw, h - 50);
      ctx.setLineDash([]);

      ctx.fillStyle = '#60a5fa';
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.textAlign = 'left';
      ctx.fillText(`Partition [${lo}..${hi}]`, rx + 6, 28);
    }
  }

  // 2. Draw Bars
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const bh = Math.max(6, Math.round((val / maxVal) * maxH));
    const x = padX + i * (barW + 2);
    const y = h - 45 - bh;

    // Determine base bar color
    const isDone = done.length === n || done.includes(i);
    const isPivot = i === pivot;
    const isCmp = cmp.includes(i);
    const isHover = hoverIdx === i;

    let color = `hsl(${215 + Math.round((val / maxVal) * 35)}, 35%, 24%)`;
    if (isDone) {
      color = `hsl(${145 + Math.round((val / maxVal) * 25)}, 80%, 45%)`;
    } else if (isPivot) {
      color = C.accent4; // amber
    } else if (isCmp) {
      color = swap ? C.accent3 : C.accent; // red on swap, blue on compare
    }

    if (isHover) {
      color = '#38bdf8'; // light sky blue on hover
    }

    // Shadow glow on active items
    if (isCmp || isPivot || isHover) {
      ctx.shadowColor = color;
      ctx.shadowBlur = isHover ? 20 : 14;
    }

    const grad = ctx.createLinearGradient(x, y, x, y + bh);
    grad.addColorStop(0, color);
    grad.addColorStop(1, isDone ? '#065f46' : isCmp ? (swap ? '#881337' : '#1e3a8a') : '#0f172a');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(1, barW), bh, [3, 3, 0, 0]);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Subtle outline for better bar separation
    ctx.strokeStyle = isHover ? '#fff' : isCmp ? color : 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = isHover || isCmp ? 1.5 : 1;
    ctx.stroke();

    // 3. Pointer Label Badges above bars (e.g., PIVOT, MIN, i, j)
    const activePointers: string[] = [];
    if (isPivot) activePointers.push('PIVOT');
    for (const [pName, pIdx] of Object.entries(pointers)) {
      if (pIdx === i && pName !== 'pivot' && !activePointers.includes(pName.toUpperCase())) {
        activePointers.push(pName.toUpperCase());
      }
    }

    if (activePointers.length > 0 && barW >= 12) {
      const badgeText = activePointers.join(',');
      const badgeY = Math.max(16, y - 8);
      ctx.fillStyle = isPivot ? C.accent4 : isCmp ? (swap ? C.accent3 : C.accent) : '#94a3b8';
      ctx.font = `bold ${Math.max(8, Math.min(barW, 10))}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, x + barW / 2, badgeY);

      // Mini caret pointing down
      ctx.beginPath();
      ctx.moveTo(x + barW / 2 - 3, badgeY + 2);
      ctx.lineTo(x + barW / 2 + 3, badgeY + 2);
      ctx.lineTo(x + barW / 2, badgeY + 5);
      ctx.fill();
    }

    // 4. Value label at bottom of canvas
    if (barW >= 14) {
      ctx.fillStyle = isHover ? '#38bdf8' : isCmp ? '#ffffff' : isDone ? '#a7f3d0' : C.text2;
      ctx.font = `bold ${Math.max(9, Math.min(barW - 2, 12))}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), x + barW / 2, h - 24);

      // Optional index subscript if width allows
      if (barW >= 24) {
        ctx.fillStyle = '#64748b';
        ctx.font = `9px 'JetBrains Mono', monospace`;
        ctx.fillText(`[${i}]`, x + barW / 2, h - 10);
      }
    }
  }
}

export function getSearchBarAt(x: number, y: number, w: number, h: number, n: number): number | null {
  if (n === 0) return null;
  const barW = Math.floor((w - 40) / n) - 2;
  const padX = 20;
  if (x < padX || x > padX + n * (barW + 2)) return null;
  const idx = Math.floor((x - padX) / (barW + 2));
  if (idx >= 0 && idx < n) {
    return idx;
  }
  return null;
}

export function drawSearchBars(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: SearchStep,
  options?: {
    hoverIdx?: number | null;
  }
) {
  clear(ctx, w, h);
  const {
    arr,
    target,
    current,
    found,
    searched = [],
    discarded = [],
    range,
    pointers = {},
    lo,
    hi,
    mid,
  } = state;

  const hoverIdx = options?.hoverIdx ?? null;
  const n = arr.length;
  if (n === 0) return;

  const maxVal = Math.max(...arr, 1);
  const barW = Math.floor((w - 40) / n) - 2;
  const padX = 20;
  const maxH = h - 90;

  // 1. Draw Active Search Interval Window Backdrop
  const activeRange = range || (lo !== undefined && hi !== undefined && lo >= 0 && hi >= lo ? [lo, hi] : null);
  if (activeRange && activeRange.length === 2) {
    const [rLo, rHi] = activeRange;
    if (rLo >= 0 && rHi < n && rHi >= rLo) {
      const rx = padX + rLo * (barW + 2) - 3;
      const rw = (rHi - rLo + 1) * (barW + 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.fillRect(rx, 15, rw, h - 50);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(rx, 15, rw, h - 50);
      ctx.setLineDash([]);

      ctx.fillStyle = '#60a5fa';
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.textAlign = 'left';
      ctx.fillText(`Search Window [${rLo}..${rHi}]`, rx + 6, 28);
    }
  }

  // 2. Render Bars
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const bh = Math.max(6, Math.round((val / maxVal) * maxH));
    const x = padX + i * (barW + 2);
    const y = h - 45 - bh;

    const isFound = found === i;
    const isCurrent = i === current || i === mid;
    const isLoOrHi = i === lo || i === hi;
    const isDiscarded = discarded.includes(i);
    const isSearched = searched.includes(i);
    const isHover = hoverIdx === i;

    let color = `hsl(${215 + Math.round((val / maxVal) * 35)}, 35%, 24%)`;

    if (isFound) {
      color = C.accent2; // emerald green
    } else if (isCurrent) {
      color = C.accent; // electric blue
    } else if (isLoOrHi) {
      color = C.accent4; // amber
    } else if (isDiscarded) {
      color = '#111827'; // dimmed ruled out
    } else if (isSearched) {
      color = '#1e293b'; // already scanned
    }

    if (isHover) {
      color = '#38bdf8'; // sky blue
    }

    // Glow on active probe or found
    if (isCurrent || isFound || isHover) {
      ctx.shadowColor = color;
      ctx.shadowBlur = isFound ? 20 : 14;
    }

    const grad = ctx.createLinearGradient(x, y, x, y + bh);
    grad.addColorStop(0, color);
    grad.addColorStop(1, isFound ? '#065f46' : isCurrent ? '#1e3a8a' : isDiscarded ? '#090d16' : '#0f172a');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, Math.max(1, barW), bh, [3, 3, 0, 0]);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Stroke border
    ctx.strokeStyle = isHover ? '#fff' : isCurrent || isFound ? color : 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = isHover || isCurrent || isFound ? 1.5 : 1;
    ctx.stroke();

    // 3. Pointer Label Badges above bars
    const activePointers: string[] = [];
    if (isFound) activePointers.push('FOUND');
    if (i === mid && !activePointers.includes('MID')) activePointers.push('MID');
    if (i === lo && !activePointers.includes('LO')) activePointers.push('LO');
    if (i === hi && !activePointers.includes('HI')) activePointers.push('HI');

    for (const [pName, pIdx] of Object.entries(pointers)) {
      const upper = pName.toUpperCase();
      if (pIdx === i && !activePointers.includes(upper)) {
        activePointers.push(upper);
      }
    }

    if (activePointers.length > 0 && barW >= 12) {
      const badgeText = activePointers.join(',');
      const badgeY = Math.max(16, y - 8);
      ctx.fillStyle = isFound ? C.accent2 : isCurrent ? C.accent : C.accent4;
      ctx.font = `bold ${Math.max(8, Math.min(barW, 10))}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, x + barW / 2, badgeY);

      ctx.beginPath();
      ctx.moveTo(x + barW / 2 - 3, badgeY + 2);
      ctx.lineTo(x + barW / 2 + 3, badgeY + 2);
      ctx.lineTo(x + barW / 2, badgeY + 5);
      ctx.fill();
    }

    // 4. Value label at bottom of canvas
    if (barW >= 14) {
      ctx.fillStyle = isHover ? '#38bdf8' : isFound ? '#a7f3d0' : isCurrent ? '#ffffff' : isDiscarded ? '#475569' : C.text2;
      ctx.font = `bold ${Math.max(9, Math.min(barW - 2, 12))}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), x + barW / 2, h - 24);

      if (barW >= 24) {
        ctx.fillStyle = '#64748b';
        ctx.font = `9px 'JetBrains Mono', monospace`;
        ctx.fillText(`[${i}]`, x + barW / 2, h - 10);
      }
    }
  }
}

export function drawTree(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  layout: TreeLayoutItem[],
  activeNodes: number[] = [],
  foundNode: number | null = null,
  hoveredVal: number | null = null
) {
  clear(ctx, w, h);
  if (!layout || !layout.length) {
    ctx.fillStyle = C.text2;
    ctx.font = "13px 'Inter', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('Tree is empty. Insert keys or choose a preset above.', w / 2, h / 2);
    return;
  }

  const R = 22;

  // 1. Draw Edges
  layout
    .filter((e): e is import('@/types').TreeLayoutEdge => 'edge' in e && e.edge === true)
    .forEach((e) => {
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.moveTo(e.from[0], e.from[1]);
      ctx.lineTo(e.to[0], e.to[1]);
      ctx.stroke();
    });

  // 2. Draw Nodes
  layout
    .filter((n): n is import('@/types').TreeLayoutNode => !('edge' in n) && n.val !== undefined)
    .forEach((n) => {
      const isFound = foundNode === n.val;
      const isActive = activeNodes.includes(n.val);
      const isHovered = hoveredVal === n.val;

      ctx.save();
      if (isFound) {
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#064e3b';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.5;
      } else if (isActive) {
        ctx.shadowColor = '#3b82f6';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#1e3a8a';
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
      } else if (isHovered) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
      } else {
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#141c2e';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Node value label
      ctx.fillStyle = isFound ? '#a7f3d0' : isActive ? '#bfdbfe' : isHovered ? '#38bdf8' : '#f8fafc';
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.val.toString(), n.x, n.y);
      ctx.textBaseline = 'alphabetic';
    });
}

export function drawGraph(ctx: CanvasRenderingContext2D, w: number, h: number, nodes: GraphNode[], edges: GraphEdge[], state: Partial<GraphStep> = {}) {
  clear(ctx, w, h);
  const { 
    visited = new Set<number>(), 
    current = -1, 
    highlight = -1, 
    dist = {}, 
    prev = {}, 
    path = [], 
    start = -1, 
    target = -1 
  } = state;
  const R = 24;
  const nx = (n: GraphNode) => n.x * w;
  const ny = (n: GraphNode) => n.y * h;
  const pathEdges = new Set<string>();
  for (let i = 1; i < path.length; i++) {
    pathEdges.add(`${path[i - 1]}-${path[i]}`);
    pathEdges.add(`${path[i]}-${path[i - 1]}`);
  }

  edges.forEach(e => {
    const from = nodes[e.from];
    const to = nodes[e.to];
    if (!from || !to) return;
    const inPath = pathEdges.size
      ? pathEdges.has(`${e.from}-${e.to}`)
      : (prev[e.to] === e.from || prev[e.from] === e.to);
    
    ctx.strokeStyle = inPath ? C.accent4 : C.border;
    ctx.lineWidth = inPath ? 2 : 1.2;
    ctx.beginPath();
    ctx.moveTo(nx(from), ny(from));
    ctx.lineTo(nx(to), ny(to));
    ctx.stroke();

    const mx = (nx(from) + nx(to)) / 2;
    const my = (ny(from) + ny(to)) / 2;
    ctx.fillStyle = C.text2;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(e.w.toString(), mx, my - 5);
  });

  nodes.forEach(n => {
    const x = nx(n), y = ny(n);
    const isVisited = visited.has(n.id);
    const isCurrent = n.id === current;
    const isHL = n.id === highlight;
    const isStart = n.id === start;
    const isTarget = n.id === target;

    let fill = C.base;
    if (isCurrent) fill = C.accent;
    else if (isHL) fill = C.accent4;
    else if (isVisited) fill = '#1e3a5f';
    else if (isStart) fill = '#1e3a5f';
    else if (isTarget) fill = '#3d2e0a';

    if (isCurrent || isHL) { 
      ctx.shadowColor = fill; 
      ctx.shadowBlur = 18; 
    }

    ctx.beginPath();
    ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = isCurrent ? C.accent2 : isTarget ? C.accent4 : isStart ? C.accent : isVisited ? C.accent : C.border;
    ctx.lineWidth = isCurrent ? 2.5 : 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isCurrent ? '#fff' : C.text;
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.label, x, y);
    ctx.textBaseline = 'alphabetic';

    if (dist[n.id] !== undefined && dist[n.id] !== Infinity) {
      ctx.fillStyle = C.accent2;
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.fillText(dist[n.id].toString(), x, y + R + 14);
    }
  });
}
