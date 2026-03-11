'use strict';

window.GraphEngine = (() => {
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
        '      <span class="pseudo-kw">if</span> neighbor not visited:',
        '        visited.add(neighbor)',
        '        queue.enqueue(neighbor)',
      ]
    },
    dfs: {
      name: 'DFS',
      complexity: { time: 'O(V + E)', space: 'O(V)', best: 'O(1)', worst: 'O(V+E)' },
      pseudo: [
        '<span class="pseudo-fn">DFS</span>(node, visited):',
        '  visited.add(node)',
        '  <span class="pseudo-kw">for</span> neighbor <span class="pseudo-kw">in</span> adj[node]:',
        '    <span class="pseudo-kw">if</span> neighbor not visited:',
        '      <span class="pseudo-fn">DFS</span>(neighbor, visited)',
      ]
    },
    dijkstra: {
      name: 'Dijkstra',
      complexity: { time: 'O((V+E) log V)', space: 'O(V)', best: 'O(E log V)', worst: 'O(V²)' },
      pseudo: [
        '<span class="pseudo-fn">Dijkstra</span>(src):',
        '  dist[src]=0; all others = ∞',
        '  pq = MinPriorityQueue',
        '  <span class="pseudo-kw">while</span> pq not empty:',
        '    u = pq.extractMin()',
        '    <span class="pseudo-kw">for</span> (v, w) <span class="pseudo-kw">in</span> adj[u]:',
        '      <span class="pseudo-kw">if</span> dist[u]+w < dist[v]:',
        '        dist[v] = dist[u]+w; pq.update(v)',
      ]
    }
  };

  // Default graph
  const DEFAULT_NODES = [
    {id:0, label:'A', x:0.20, y:0.25},
    {id:1, label:'B', x:0.45, y:0.12},
    {id:2, label:'C', x:0.70, y:0.25},
    {id:3, label:'D', x:0.15, y:0.60},
    {id:4, label:'E', x:0.45, y:0.55},
    {id:5, label:'F', x:0.78, y:0.60},
  ];
  const DEFAULT_EDGES = [
    {from:0,to:1,w:4}, {from:0,to:3,w:2},
    {from:1,to:2,w:3}, {from:1,to:4,w:6},
    {from:2,to:5,w:2}, {from:3,to:4,w:1},
    {from:4,to:5,w:5}, {from:3,to:0,w:2},
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

  function* bfsGen(nodes, edges, startId) {
    const adj = buildAdj(nodes, edges);
    const visited = new Set([startId]);
    const queue = [startId];
    const order = [];
    yield { visited: new Set(visited), current: startId, queue: [...queue], order: [...order], line: 1 };
    while (queue.length) {
      const node = queue.shift();
      order.push(node);
      yield { visited: new Set(visited), current: node, queue: [...queue], order: [...order], line: 3 };
      for (const {to} of adj[node]) {
        if (!visited.has(to)) {
          visited.add(to);
          queue.push(to);
          yield { visited: new Set(visited), current: node, queue: [...queue], order: [...order], highlight: to, line: 6 };
        }
      }
    }
    yield { visited: new Set(visited), current: -1, queue: [], order: [...order], done: true, line: -1 };
  }

  function* dfsGen(nodes, edges, startId) {
    const adj = buildAdj(nodes, edges);
    const visited = new Set();
    const order = [];
    function* dfs(node) {
      visited.add(node);
      order.push(node);
      yield { visited: new Set(visited), current: node, order: [...order], line: 1 };
      for (const {to} of adj[node]) {
        if (!visited.has(to)) {
          yield { visited: new Set(visited), current: node, highlight: to, order: [...order], line: 3 };
          yield* dfs(to);
        }
      }
    }
    yield* dfs(startId);
    yield { visited: new Set(visited), current: -1, order: [...order], done: true, line: -1 };
  }

  function* dijkstraGen(nodes, edges, startId) {
    const adj = buildAdj(nodes, edges);
    const dist = {};
    nodes.forEach(n => dist[n.id] = Infinity);
    dist[startId] = 0;
    const prev = {};
    const unvisited = new Set(nodes.map(n => n.id));
    yield { dist: {...dist}, current: startId, prev: {...prev}, line: 1 };
    while (unvisited.size) {
      let u = null;
      unvisited.forEach(id => { if (u === null || dist[id] < dist[u]) u = id; });
      if (dist[u] === Infinity) break;
      unvisited.delete(u);
      yield { dist: {...dist}, current: u, prev: {...prev}, line: 4 };
      for (const {to: v, w} of adj[u]) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          prev[v] = u;
          yield { dist: {...dist}, current: u, highlight: v, prev: {...prev}, line: 6 };
        }
      }
    }
    yield { dist: {...dist}, current: -1, prev: {...prev}, done: true, line: -1 };
  }

  return { INFO, DEFAULT_NODES, DEFAULT_EDGES, bfsGen, dfsGen, dijkstraGen };
})();
