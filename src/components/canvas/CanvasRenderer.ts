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

export function drawSortBars(ctx: CanvasRenderingContext2D, w: number, h: number, state: SortStep) {
  clear(ctx, w, h);
  const { arr, cmp = [], swap = false, done = [], pivot = -1 } = state;
  const n = arr.length;
  if (n === 0) return;
  const maxVal = Math.max(...arr, 1);
  const barW = Math.floor((w - 40) / n) - 2;
  const padX = 20;
  const maxH = h - 70;

  for (let i = 0; i < n; i++) {
    const bh = Math.round((arr[i] / maxVal) * maxH);
    const x = padX + i * (barW + 2);
    const y = h - 40 - bh;

    let color = C.base;
    if (done.length === n) color = C.accent2;
    else if (done.includes(i)) color = C.accent2;
    else if (i === pivot) color = C.accent4;
    else if (cmp.includes(i)) color = swap ? C.accent3 : C.accent;

    if (cmp.includes(i) || i === pivot) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
    }

    const grad = ctx.createLinearGradient(x, y, x, y + bh);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '88');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bh, [3, 3, 0, 0]);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (barW >= 14) {
      ctx.fillStyle = cmp.includes(i) ? '#fff' : C.text2;
      ctx.font = `bold ${Math.max(9, Math.min(barW - 2, 12))}px 'Space Mono'`;
      ctx.textAlign = 'center';
      ctx.fillText(arr[i].toString(), x + barW / 2, h - 22);
    }
  }
}

export function drawSearchBars(ctx: CanvasRenderingContext2D, w: number, h: number, state: SearchStep) {
  clear(ctx, w, h);
  const { arr, target, current, found, searched = [], lo, hi, mid } = state;
  const n = arr.length;
  if (n === 0) return;
  const maxVal = Math.max(...arr, 1);
  const barW = Math.floor((w - 40) / n) - 2;
  const padX = 20;
  const maxH = h - 90;

  for (let i = 0; i < n; i++) {
    const bh = Math.round((arr[i] / maxVal) * maxH);
    const x = padX + i * (barW + 2);
    const y = h - 50 - bh;

    let color = C.base;
    if (found === i) color = C.accent2;
    else if (found === -2) color = C.accent3;
    else if (searched.includes(i)) color = '#2a3050';
    else if (i === current || i === mid) color = C.accent;
    else if (i === lo || i === hi) color = C.accent4;

    if (i === current || i === mid || found === i) {
      ctx.shadowColor = color; 
      ctx.shadowBlur = 14;
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bh, [3, 3, 0, 0]);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (barW >= 14) {
      ctx.fillStyle = C.text2;
      ctx.font = `bold ${Math.max(9, Math.min(barW - 2, 12))}px 'Space Mono'`;
      ctx.textAlign = 'center';
      ctx.fillText(arr[i].toString(), x + barW / 2, h - 32);
    }
  }

  if (target !== undefined) {
    ctx.fillStyle = C.text2;
    ctx.font = '12px Space Mono';
    ctx.textAlign = 'left';
    ctx.fillText(`Target: ${target}`, 20, 24);
  }

  if (lo !== undefined && lo >= 0) {
    const lx = padX + lo * (barW + 2) + barW / 2;
    const hx = padX + (hi ?? 0) * (barW + 2) + barW / 2;
    const mx = padX + (mid ?? 0) * (barW + 2) + barW / 2;
    ctx.font = 'bold 10px Space Mono';
    ctx.textAlign = 'center';
    ctx.fillStyle = C.accent4;
    ctx.fillText('lo', lx, h - 14);
    if (hi !== undefined) ctx.fillText('hi', hx, h - 14);
    if (mid !== undefined) {
      ctx.fillStyle = C.accent;
      ctx.fillText('mid', mx, h - 14);
    }
  }

  if (found >= 0) {
    const fx = padX + found * (barW + 2) + barW / 2;
    ctx.fillStyle = C.accent2;
    ctx.font = 'bold 11px Space Mono';
    ctx.textAlign = 'center';
    ctx.fillText('✓ FOUND', fx, h - 14);
  }
}

export function drawTree(ctx: CanvasRenderingContext2D, w: number, h: number, layout: TreeLayoutItem[], highlight: number[] = []) {
  clear(ctx, w, h);
  if (!layout || !layout.length) {
    ctx.fillStyle = C.text2;
    ctx.font = '14px Outfit';
    ctx.textAlign = 'center';
    ctx.fillText('Insert nodes using the controls above', w / 2, h / 2);
    return;
  }

  const R = 22;

  layout.filter((e): e is import('@/types').TreeLayoutEdge => 'edge' in e && e.edge === true).forEach(e => {
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(e.from[0], e.from[1]);
    ctx.lineTo(e.to[0], e.to[1]);
    ctx.stroke();
  });

  layout.filter((n): n is import('@/types').TreeLayoutNode => !('edge' in n) && n.val !== undefined).forEach(n => {
    const isHL = highlight.includes(n.val);

    if (isHL) { 
      ctx.shadowColor = C.accent; 
      ctx.shadowBlur = 16; 
    }

    ctx.beginPath();
    ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
    ctx.fillStyle = isHL ? C.accent : C.base;
    ctx.fill();
    ctx.strokeStyle = isHL ? C.accent2 : C.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = isHL ? '#fff' : C.text;
    ctx.font = 'bold 14px Space Mono';
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
    ctx.font = '10px Space Mono';
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
    ctx.font = 'bold 14px Space Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.label, x, y);
    ctx.textBaseline = 'alphabetic';

    if (dist[n.id] !== undefined && dist[n.id] !== Infinity) {
      ctx.fillStyle = C.accent2;
      ctx.font = 'bold 10px Space Mono';
      ctx.fillText(dist[n.id].toString(), x, y + R + 14);
    }
  });
}
