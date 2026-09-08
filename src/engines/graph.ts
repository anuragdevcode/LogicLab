import { ComplexityInfo, GraphNode, GraphEdge, GraphStep, MetricsDelta, DataStructureInfo } from '@/types';

const delta = (comparisons = 0, swaps = 0, accesses = 0): MetricsDelta => ({ comparisons, swaps, accesses });

export const GRAPH_INFO: Record<string, DataStructureInfo> = {
  bfs: {
    name: 'Breadth-First Search (BFS)',
    category: 'Graph Traversal',
    description:
      'Traverses graph nodes level by level using a FIFO queue. Explores all immediate neighbor vertices at the present depth before moving to vertices at the next depth level.',
    whenToUse:
      'Finding the shortest path on unweighted graphs, peer-to-peer torrent chunk finding, social network degree of separation analysis, web crawling.',
    constraints: [
      'Graph Size: |V| = 6 nodes (A-F), |E| = 8 edges',
      'Queue Discipline: FIFO queue determines traversal order',
      'Shortest Path: Guarantees shortest path on unweighted graphs',
      'Cycle Guard: Visited set prevents infinite cyclic loops',
    ],
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
    name: 'Depth-First Search (DFS)',
    category: 'Graph Traversal',
    description:
      'Explores as far as possible along each branch before backtracking using a LIFO recursion call stack. Visits deep into subtree ancestors before siblings.',
    whenToUse:
      'Cycle detection in directed graphs, topological sorting, solving maze paths, finding strongly connected components (Tarjan/Kosaraju).',
    constraints: [
      'Graph Size: |V| = 6 nodes (A-F), |E| = 8 edges',
      'Stack Discipline: LIFO call stack determines traversal depth',
      'Shortest Path: Does NOT guarantee shortest path',
      'Backtracking: Reverses step when no unvisited neighbors exist',
    ],
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
    name: "Dijkstra's Algorithm",
    category: 'Shortest Path',
    description:
      'Greedy algorithm that determines the single-source shortest path to all vertices on a weighted graph with non-negative edge weights.',
    whenToUse:
      'GPS mapping routing systems (Google Maps / OpenStreetMap), network packet link-state routing protocols (OSPF, IS-IS).',
    constraints: [
      'Weight Constraint: Strictly non-negative edge weights (w >= 0)',
      'Negative Cycles: Not supported (fails on negative weights)',
      'Greedy Property: Tentative distances monotonically increase',
      'Graph Size: |V| = 6 nodes (A-F), |E| = 8 edges',
    ],
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

export const DEFAULT_NODES: GraphNode[] = [
  { id: 0, label: 'A', x: 0.20, y: 0.25 },
  { id: 1, label: 'B', x: 0.45, y: 0.12 },
  { id: 2, label: 'C', x: 0.70, y: 0.25 },
  { id: 3, label: 'D', x: 0.15, y: 0.60 },
  { id: 4, label: 'E', x: 0.45, y: 0.55 },
  { id: 5, label: 'F', x: 0.78, y: 0.60 },
];

export const DEFAULT_EDGES: GraphEdge[] = [
  { from: 0, to: 1, w: 4 }, { from: 0, to: 3, w: 2 },
  { from: 1, to: 2, w: 3 }, { from: 1, to: 4, w: 6 },
  { from: 2, to: 5, w: 2 }, { from: 3, to: 4, w: 1 },
  { from: 4, to: 5, w: 5 },
];

function buildAdj(nodes: GraphNode[], edges: GraphEdge[]): Record<number, { to: number; w: number }[]> {
  const adj: Record<number, { to: number; w: number }[]> = {};
  nodes.forEach(n => adj[n.id] = []);
  edges.forEach(e => {
    adj[e.from].push({ to: e.to, w: e.w });
    adj[e.to].push({ to: e.from, w: e.w });
  });
  return adj;
}

function pathFrom(prev: Record<number, number>, startId: number, targetId?: number): number[] {
  if (targetId === undefined || targetId === null) return [];
  const path: number[] = [];
  let cur: number | undefined = targetId;
  while (cur !== undefined) {
    path.unshift(cur);
    if (cur === startId) return path;
    cur = prev[cur];
  }
  return [];
}

function baseState(start: number, target: number, extra: Partial<GraphStep> = {}): GraphStep {
  return { start, target, ...extra } as GraphStep;
}

export function* bfsGen(nodes: GraphNode[], edges: GraphEdge[], startId: number, targetId: number): Generator<GraphStep> {
  const adj = buildAdj(nodes, edges);
  const visited = new Set<number>([startId]);
  const queue: number[] = [startId];
  const order: number[] = [];
  const prev: Record<number, number> = {};

  yield baseState(startId, targetId, { visited: new Set(visited), current: startId, queue: [...queue], order: [], prev: { ...prev }, line: 1 });

  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    yield baseState(startId, targetId, { visited: new Set(visited), current: node, queue: [...queue], order: [...order], prev: { ...prev }, line: 3 });

    if (node === targetId) {
      yield baseState(startId, targetId, { visited: new Set(visited), current: -1, order: [...order], prev: { ...prev }, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
      return;
    }

    for (const { to } of adj[node]) {
      yield baseState(startId, targetId, { visited: new Set(visited), current: node, highlight: to, queue: [...queue], order: [...order], prev: { ...prev }, line: 4, metrics: delta(1) });
      if (!visited.has(to)) {
        visited.add(to);
        prev[to] = node;
        queue.push(to);
        yield baseState(startId, targetId, { visited: new Set(visited), current: node, highlight: to, queue: [...queue], order: [...order], prev: { ...prev }, line: 5 });
      }
    }
  }

  yield baseState(startId, targetId, { visited: new Set(visited), current: -1, queue: [], order: [...order], prev: { ...prev }, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
}

export function* dfsGen(nodes: GraphNode[], edges: GraphEdge[], startId: number, targetId: number): Generator<GraphStep> {
  const adj = buildAdj(nodes, edges);
  const visited = new Set<number>();
  const order: number[] = [];
  const prev: Record<number, number> = {};
  let found = false;

  function* dfs(node: number): Generator<GraphStep> {
    if (found) return;
    visited.add(node);
    order.push(node);
    yield baseState(startId, targetId, { visited: new Set(visited), current: node, order: [...order], prev: { ...prev }, line: 1 });

    if (node === targetId) {
      found = true;
      return;
    }

    for (const { to } of adj[node]) {
      yield baseState(startId, targetId, { visited: new Set(visited), current: node, highlight: to, order: [...order], prev: { ...prev }, line: 2, metrics: delta(1) });
      if (!visited.has(to)) {
        prev[to] = node;
        yield* dfs(to);
      }
      if (found) return;
    }
  }

  yield* dfs(startId);
  yield baseState(startId, targetId, { visited: new Set(visited), current: -1, order: [...order], prev: { ...prev }, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
}

export function* dijkstraGen(nodes: GraphNode[], edges: GraphEdge[], startId: number, targetId: number): Generator<GraphStep> {
  const adj = buildAdj(nodes, edges);
  const dist: Record<number, number> = {};
  nodes.forEach(n => dist[n.id] = Infinity);
  dist[startId] = 0;

  const prev: Record<number, number> = {};
  const visited = new Set<number>();
  const unvisited = new Set<number>(nodes.map(n => n.id));
  yield baseState(startId, targetId, { dist: { ...dist }, visited: new Set(visited), current: startId, prev: { ...prev }, line: 1 });

  while (unvisited.size) {
    let u: number | null = null;
    unvisited.forEach(id => {
      if (u === null || dist[id] < dist[u!]) u = id;
    });
    if (u === null || dist[u] === Infinity) break;

    unvisited.delete(u);
    visited.add(u);
    yield baseState(startId, targetId, { dist: { ...dist }, visited: new Set(visited), current: u, prev: { ...prev }, line: 2 });

    if (u === targetId) break;

    for (const { to: v, w } of adj[u]) {
      if (!unvisited.has(v)) continue;
      const next = dist[u] + w;
      yield baseState(startId, targetId, { dist: { ...dist }, visited: new Set(visited), current: u, highlight: v, prev: { ...prev }, line: 3, metrics: delta(1) });
      if (next < dist[v]) {
        dist[v] = next;
        prev[v] = u;
        yield baseState(startId, targetId, { dist: { ...dist }, visited: new Set(visited), current: u, highlight: v, prev: { ...prev }, line: 4 });
      }
    }
  }

  yield baseState(startId, targetId, { dist: { ...dist }, visited: new Set(visited), current: -1, prev: { ...prev }, path: pathFrom(prev, startId, targetId), done: true, line: -1 });
}
