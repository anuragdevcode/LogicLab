// ─── Module Identifiers ───
export type ModuleId =
  | 'sorting'
  | 'searching'
  | 'stack'
  | 'linkedlist'
  | 'bst'
  | 'heap'
  | 'graph'
  | 'dp';

// ─── Metrics ───
export interface MetricsDelta {
  comparisons: number;
  swaps: number;
  accesses: number;
}

export interface Metrics {
  comparisons: number;
  swaps: number;
  accesses: number;
}

// ─── Sorting ───
export interface SortStep {
  arr: number[];
  cmp: number[];
  swap: boolean;
  done: number[];
  pivot?: number;
  pointers?: Record<string, number>;
  range?: [number, number];
  reason?: string;
  action?: 'compare' | 'swap' | 'pivot' | 'shift' | 'insert' | 'partition' | 'done' | 'split';
  line: number;
  metrics?: MetricsDelta;
}

// ─── Searching ───
export interface SearchStep {
  arr: number[];
  target: number;
  current?: number;
  lo?: number;
  hi?: number;
  mid?: number;
  found: number;
  searched?: number[];
  discarded?: number[];
  range?: [number, number];
  pointers?: Record<string, number>;
  reason?: string;
  action?: 'scan' | 'probe' | 'narrow' | 'jump' | 'bound' | 'found' | 'not_found' | 'done' | 'idle';
  done?: boolean;
  line: number;
  metrics?: MetricsDelta;
}

// ─── Graph ───
export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  w: number;
}

export interface GraphStep {
  start: number;
  target: number;
  visited: Set<number>;
  current: number;
  highlight?: number;
  queue?: number[];
  order?: number[];
  prev: Record<number, number>;
  dist?: Record<number, number>;
  path?: number[];
  done?: boolean;
  line: number;
  metrics?: MetricsDelta;
}

// ─── Dynamic Programming ───
export interface DPStep {
  dp: number[][];
  active: [number, number] | null;
  s1?: string;
  s2?: string;
  items?: { w: number; v: number }[];
  W?: number;
  match: boolean;
  explain: string;
  done?: boolean;
  result?: number;
  line: number;
  metrics?: MetricsDelta;
}

// ─── Tree Layout (BST & Heap) ───
export interface TreeLayoutNode {
  val: number;
  x: number;
  y: number;
}

export interface TreeLayoutEdge {
  edge: true;
  from: [number, number];
  to: [number, number];
}

export type TreeLayoutItem = TreeLayoutNode | TreeLayoutEdge;

// ─── Complexity ───
export interface ComplexityInfo {
  [key: string]: string;
}

// ─── Algorithm Metadata ───
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AlgorithmMeta<S = unknown> {
  name: string;
  category?: string;
  complexity: ComplexityInfo;
  pseudo: string[];
  description?: string;
  stability?: boolean;
  inPlace?: boolean;
  whenToUse?: string;
  constraints?: string[];
  generator?: (...args: any[]) => Generator<S>;
}

// ─── Unified Step Type ───
export type Step = SortStep | SearchStep | GraphStep | DPStep;

// ─── Heap Layout Return ───
export interface HeapLayoutResult {
  nodes: { val: number; x: number; y: number; idx: number }[];
  edges: { from: [number, number]; to: [number, number] }[];
}

// ─── Data Structure Info ───
export interface DataStructureInfo {
  name: string;
  category?: string;
  complexity: ComplexityInfo;
  pseudo: string[];
  description?: string;
  whenToUse?: string;
  constraints?: string[];
}

export type StackMode = 'stack' | 'queue' | 'circular_queue' | 'min_stack';

export interface StackNarrative {
  action: string;
  reason: string;
  badge: string;
  isError?: boolean;
}

export type LinkedListMode = 'singly' | 'doubly' | 'circular';

export interface LinkedListNarrative {
  action: string;
  reason: string;
  badge: string;
  isError?: boolean;
}

export type BSTMode = 'bst' | 'inorder' | 'preorder' | 'postorder' | 'levelorder';

export interface BSTNarrative {
  action: string;
  reason: string;
  badge: string;
  isError?: boolean;
}

// ─── Module Configuration ───
export interface ModuleConfig {
  title: string;
  algorithms: string[];
  algoName: (key: string) => string;
}

// ─── Algorithm List Item (for AlgoTabs) ───
export interface AlgoListItem {
  id: string;
  name: string;
}
