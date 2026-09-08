'use strict';

window.GraphEngine = (() => {
  const delta = (comparisons = 0, swaps = 0, accesses = 0) => ({ comparisons, swaps, accesses });

  const INFO = {
    bfs: {
      name: 'BFS',
      complexity: { time: 'O(V + E)', space: 'O(V)', best: 'O(1)', worst: 'O(V+E)' },
      pseudo: [
        '<span class="pseudo-fn">BFS</span>(start):',
        '  queue = [start]; visited = {start}',
        '  <span class="pseudo-kw">while</span> queue not empty:',
        '    node = queue.dequeue()',
        '    <span class="pseudo-kw">for</span> neighbor <span class="pseudo-kw">in</span> adj[node]:',
        '      <span class="pseudo-kw">if</span> neighbor not visited: add it',
      ]
    },
    dfs: {
      name: 'DFS',
      complexity: { time: 'O(V + E)', space: 'O(V)', best: 'O(1)', worst: 'O(V+E)' },
      pseudo: [
        '<span class="pseudo-fn">DFS</span>(node):',
        '  visited.add(node)',
        '  <span class="pseudo-kw">for</span> neighbor <span class="pseudo-kw">in</span> adj[node]:',
        '    <span class="pseudo-kw">if</span> neighbor not visited:',
        '      <span class="pseudo-fn">DFS</span>(neighbor)',
      ]
    },
    dijkstra: {
      name: 'Dijkstra',
      complexity: { time: 'O((V+E) log V)', space: 'O(V)', best: 'O(E log V)', worst: 'O(V²)' },
      pseudo: [
        '<span class="pseudo-fn">Dijkstra</span>(src):',
        '  dist[src] = 0; all others = infinity',
        '  choose unvisited node with smallest distance',
        '  relax every outgoing edge',
        '  keep parent links for the final path',
      ]
    }
  };

  const DEFAULT_NODES = [
    {id: 0, label: 'A', x: 0.20, y: 0.25},
    {id: 1, label: 'B', x: 0.45, y: 0.12},
    {id: 2, label: 'C', x: 0.70, y: 0.25},
    {id: 3, label: 'D', x: 0.15, y: 0.60},
    {id: 4, label: 'E', x: 0.45, y: 0.55},
    {id: 5, label: 'F', x: 0.78, y: 0.60},
  ];

  const DEFAULT_EDGES = [
    {from: 0, to: 1, w: 4}, {from: 0, to: 3, w: 2},
    {from: 1, to: 2, w: 3}, {from: 1, to: 4, w: 6},
    {from: 2, to: 5, w: 2}, {from: 3, to: 4, w: 1},
    {from: 4, to: 5, w: 5},
  ];

  function buildAdj(nodes, edges) {
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.from].push({to: e.to, w: e.w});
      adj[e.to].push({to: e.from, w: e.w});
    });
    return adj;
  }

  function pathFrom(prev, startId, targetId) {
    if (targetId === undefined || targetId === null) return [];
    const path = [];
    let cur = targetId;
    while (cur !== undefined) {
      path.unshift(cur);
      if (cur === startId) return path;
      cur = prev[cur];
    }
    return [];
  }

  function baseState(start, target, extra = {}) {
    return { start, target, ...extra };
  }

  function* bfsGen(nodes, edges, startId, targetId) {
    const adj = buildAdj(nodes, edges);
    const visited = new Set([startId]);
    const queue = [startId];
    const order = [];
    const prev = {};

    yield baseState(startId, targetId, { visited: new Set(visited), current: startId, queue: [...queue], order: [], prev: {...prev}, line: 1 });

    while (queue.length) {
      const node = queue.shift();
      order.push(node);
      yield baseState(startId, targetId, { visited: new Set(visited), current: node, queue: [...queue], order: [...order], prev: {...prev}, line: 3 });

      if (node === targetId) {
        yield baseState(startId, targetId, { visited: new Set(visited), current: -1, order: [...order], prev: {...prev}, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
        return;
      }

      for (const {to} of adj[node]) {
        yield baseState(startId, targetId, { visited: new Set(visited), current: node, highlight: to, queue: [...queue], order: [...order], prev: {...prev}, line: 4, metrics: delta(1) });
        if (!visited.has(to)) {
          visited.add(to);
          prev[to] = node;
          queue.push(to);
          yield baseState(startId, targetId, { visited: new Set(visited), current: node, highlight: to, queue: [...queue], order: [...order], prev: {...prev}, line: 5 });
        }
      }
    }

    yield baseState(startId, targetId, { visited: new Set(visited), current: -1, queue: [], order: [...order], prev: {...prev}, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
  }

  function* dfsGen(nodes, edges, startId, targetId) {
    const adj = buildAdj(nodes, edges);
    const visited = new Set();
    const order = [];
    const prev = {};
    let found = false;

    function* dfs(node) {
      if (found) return;
      visited.add(node);
      order.push(node);
      yield baseState(startId, targetId, { visited: new Set(visited), current: node, order: [...order], prev: {...prev}, line: 1 });

      if (node === targetId) {
        found = true;
        return;
      }

      for (const {to} of adj[node]) {
        yield baseState(startId, targetId, { visited: new Set(visited), current: node, highlight: to, order: [...order], prev: {...prev}, line: 2, metrics: delta(1) });
        if (!visited.has(to)) {
          prev[to] = node;
          yield* dfs(to);
        }
        if (found) return;
      }
    }

    yield* dfs(startId);
    yield baseState(startId, targetId, { visited: new Set(visited), current: -1, order: [...order], prev: {...prev}, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
  }

  function* dijkstraGen(nodes, edges, startId, targetId) {
    const adj = buildAdj(nodes, edges);
    const dist = {};
    nodes.forEach(n => dist[n.id] = Infinity);
    dist[startId] = 0;

    const prev = {};
    const visited = new Set();
    const unvisited = new Set(nodes.map(n => n.id));
    yield baseState(startId, targetId, { dist: {...dist}, visited: new Set(visited), current: startId, prev: {...prev}, line: 1 });

    while (unvisited.size) {
      let u = null;
      unvisited.forEach(id => { if (u === null || dist[id] < dist[u]) u = id; });
      if (u === null || dist[u] === Infinity) break;

      unvisited.delete(u);
      visited.add(u);
      yield baseState(startId, targetId, { dist: {...dist}, visited: new Set(visited), current: u, prev: {...prev}, line: 2 });

      if (u === targetId) break;

      for (const {to: v, w} of adj[u]) {
        if (!unvisited.has(v)) continue;
        const next = dist[u] + w;
        yield baseState(startId, targetId, { dist: {...dist}, visited: new Set(visited), current: u, highlight: v, prev: {...prev}, line: 3, metrics: delta(1) });
        if (next < dist[v]) {
          dist[v] = next;
          prev[v] = u;
          yield baseState(startId, targetId, { dist: {...dist}, visited: new Set(visited), current: u, highlight: v, prev: {...prev}, line: 4 });
        }
      }
    }

    yield baseState(startId, targetId, { dist: {...dist}, visited: new Set(visited), current: -1, prev: {...prev}, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
  }

  return { INFO, DEFAULT_NODES, DEFAULT_EDGES, bfsGen, dfsGen, dijkstraGen };
})();
