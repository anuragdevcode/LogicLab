'use strict';

window.Renderer = (() => {
  const C = {
    bg:      '#0a0e1a',
    base:    '#1e2a4a',
    accent:  '#6384ff',
    accent2: '#00e5c3',
    accent3: '#ff6b6b',
    accent4: '#ffd166',
    text:    '#e8ecf8',
    text2:   '#8a95b8',
    border:  'rgba(99,132,255,0.25)',
  };

  function clear(ctx, w, h) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, w, h);
  }

  // ── Sorting bars ────────────────────────────────────────────
  function drawSortBars(ctx, w, h, state) {
    clear(ctx, w, h);
    const { arr, cmp = [], swap = false, done = [], pivot = -1 } = state;
    const n = arr.length;
    const maxVal = Math.max(...arr);
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

      // glow for active bars
      if (cmp.includes(i) || i === pivot) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 12;
      }

      // bar
      const grad = ctx.createLinearGradient(x, y, x, y + bh);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color + '88');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, bh, [3, 3, 0, 0]);
      ctx.fill();
      ctx.shadowBlur = 0;

      // value label
      if (barW >= 14) {
        ctx.fillStyle = cmp.includes(i) ? '#fff' : C.text2;
        ctx.font = `bold ${Math.max(9, Math.min(barW-2, 12))}px 'Space Mono'`;
        ctx.textAlign = 'center';
        ctx.fillText(arr[i], x + barW / 2, h - 22);
      }
    }
  }

  // ── Search bars ─────────────────────────────────────────────
  function drawSearchBars(ctx, w, h, state) {
    clear(ctx, w, h);
    const { arr, current, found, searched = [], lo, hi, mid } = state;
    const n = arr.length;
    const maxVal = Math.max(...arr);
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
        ctx.shadowColor = color; ctx.shadowBlur = 14;
      }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, bh, [3,3,0,0]);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (barW >= 14) {
        ctx.fillStyle = C.text2;
        ctx.font = `bold ${Math.max(9, Math.min(barW-2, 12))}px 'Space Mono'`;
        ctx.textAlign = 'center';
        ctx.fillText(arr[i], x + barW / 2, h - 32);
      }
    }

    // Labels for binary search
    if (lo !== undefined && lo >= 0) {
      const lx = padX + lo * (barW + 2) + barW / 2;
      const hx = padX + hi * (barW + 2) + barW / 2;
      const mx = padX + mid * (barW + 2) + barW / 2;
      ctx.font = 'bold 10px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillStyle = C.accent4;
      ctx.fillText('lo', lx, h - 14);
      ctx.fillText('hi', hx, h - 14);
      ctx.fillStyle = C.accent;
      ctx.fillText('mid', mx, h - 14);
    }

    // Found label
    if (found >= 0) {
      const fx = padX + found * (barW + 2) + barW / 2;
      ctx.fillStyle = C.accent2;
      ctx.font = 'bold 11px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillText('✓ FOUND', fx, h - 14);
    }
  }

  // ── BST / Heap tree ──────────────────────────────────────────
  function drawTree(ctx, w, h, layout, highlight = []) {
    clear(ctx, w, h);
    if (!layout || !layout.length) {
      ctx.fillStyle = C.text2;
      ctx.font = '14px DM Sans';
      ctx.textAlign = 'center';
      ctx.fillText('Insert nodes using the controls above', w/2, h/2);
      return;
    }

    const R = 22;

    // Draw edges first (items with .edge === true)
    layout.filter(e => e.edge === true).forEach(e => {
      ctx.strokeStyle = C.border;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(e.from[0], e.from[1]);
      ctx.lineTo(e.to[0], e.to[1]);
      ctx.stroke();
    });

    // Draw nodes (items without .edge, or .edge === false)
    layout.filter(n => n.edge !== true && n.val !== undefined).forEach(n => {
      const isHL = highlight.includes(n.val);

      if (isHL) { ctx.shadowColor = C.accent; ctx.shadowBlur = 16; }

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
      ctx.fillText(n.val, n.x, n.y);
      ctx.textBaseline = 'alphabetic';
    });
  }

  // ── Graph ────────────────────────────────────────────────────
  function drawGraph(ctx, w, h, nodes, edges, state = {}) {
    clear(ctx, w, h);
    const { visited = new Set(), current = -1, highlight = -1, dist = {}, prev = {} } = state;
    const R = 24;
    const nx = (n) => n.x * w;
    const ny = (n) => n.y * h;

    // edges
    edges.forEach(e => {
      const from = nodes[e.from], to = nodes[e.to];
      const inPath = prev[e.to] === e.from || prev[e.from] === e.to;
      ctx.strokeStyle = inPath ? C.accent4 : C.border;
      ctx.lineWidth = inPath ? 2 : 1.2;
      ctx.beginPath();
      ctx.moveTo(nx(from), ny(from));
      ctx.lineTo(nx(to), ny(to));
      ctx.stroke();

      // weight label
      const mx = (nx(from) + nx(to)) / 2;
      const my = (ny(from) + ny(to)) / 2;
      ctx.fillStyle = C.text2;
      ctx.font = '10px Space Mono';
      ctx.textAlign = 'center';
      ctx.fillText(e.w, mx, my - 5);
    });

    // nodes
    nodes.forEach(n => {
      const x = nx(n), y = ny(n);
      const isVisited = visited.has(n.id);
      const isCurrent = n.id === current;
      const isHL = n.id === highlight;

      let fill = C.base;
      if (isCurrent) fill = C.accent;
      else if (isHL) fill = C.accent4;
      else if (isVisited) fill = '#1a3040';

      if (isCurrent || isHL) { ctx.shadowColor = fill; ctx.shadowBlur = 18; }

      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = isCurrent ? C.accent2 : isVisited ? C.accent : C.border;
      ctx.lineWidth = isCurrent ? 2.5 : 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Space Mono';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, x, y);
      ctx.textBaseline = 'alphabetic';

      // dist label for Dijkstra
      if (dist[n.id] !== undefined && dist[n.id] !== Infinity) {
        ctx.fillStyle = C.accent2;
        ctx.font = 'bold 10px Space Mono';
        ctx.fillText(dist[n.id], x, y + R + 14);
      }
    });
  }

  return { drawSortBars, drawSearchBars, drawTree, drawGraph, clear };
})();
