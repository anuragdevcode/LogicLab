import { HeapLayoutResult, DataStructureInfo, HeapMode } from '@/types';

export const HEAP_CAPACITY = 15;

export const MIN_HEAP_INFO: DataStructureInfo = {
  name: 'Min Heap',
  category: 'Priority Queue Tree',
  description:
    'Complete binary tree satisfying the Min-Heap ordering invariant: each node has a key value less than or equal to its children, with the absolute minimum element residing at the root index [0].',
  whenToUse:
    'Priority queues, Dijkstra shortest path algorithm, Prim minimum spanning tree, continuous running median streams, task schedulers.',
  constraints: [
    'Shape Invariant: Complete Binary Tree filled strictly left-to-right on bottom level',
    'Ordering Invariant: parent <= left_child and parent <= right_child',
    'Contiguous Indexing: Left = 2i + 1, Right = 2i + 2, Parent = floor((i - 1) / 2)',
    `Capacity Limit: Maximum ${HEAP_CAPACITY} nodes (4 complete binary levels)`,
    'Root Property: arr[0] is guaranteed minimum element',
  ],
  complexity: {
    peek: 'O(1)',
    insert: 'O(log n)',
    extractMin: 'O(log n)',
    buildHeap: 'O(n)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-fn">insert</span>(val):',
    '  arr.push(val); i = arr.length - 1',
    '  <span class="pseudo-kw">while</span> i > 0 <span class="pseudo-kw">and</span> arr[parent(i)] > arr[i]:',
    '    <span class="pseudo-fn">swap</span>(i, parent(i)); i = parent(i)',
    '<span class="pseudo-fn">extractMin</span>():',
    '  minVal = arr[0]; arr[0] = arr.pop()',
    '  <span class="pseudo-fn">siftDown</span>(0)',
    '  <span class="pseudo-kw">return</span> minVal',
  ],
};

export const MAX_HEAP_INFO: DataStructureInfo = {
  name: 'Max Heap',
  category: 'Priority Queue Tree',
  description:
    'Complete binary tree satisfying the Max-Heap ordering invariant: each node has a key value greater than or equal to its children, with the absolute maximum element residing at the root index [0].',
  whenToUse:
    'Heap Sort, k-th largest order statistics, operating system high-priority CPU thread dispatchers.',
  constraints: [
    'Shape Invariant: Complete Binary Tree filled strictly left-to-right on bottom level',
    'Ordering Invariant: parent >= left_child and parent >= right_child',
    'Contiguous Indexing: Left = 2i + 1, Right = 2i + 2, Parent = floor((i - 1) / 2)',
    `Capacity Limit: Maximum ${HEAP_CAPACITY} nodes (4 complete binary levels)`,
    'Root Property: arr[0] is guaranteed maximum element',
  ],
  complexity: {
    peek: 'O(1)',
    insert: 'O(log n)',
    extractMax: 'O(log n)',
    buildHeap: 'O(n)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-fn">insert</span>(val):',
    '  arr.push(val); i = arr.length - 1',
    '  <span class="pseudo-kw">while</span> i > 0 <span class="pseudo-kw">and</span> arr[parent(i)] < arr[i]:',
    '    <span class="pseudo-fn">swap</span>(i, parent(i)); i = parent(i)',
    '<span class="pseudo-fn">extractMax</span>():',
    '  maxVal = arr[0]; arr[0] = arr.pop()',
    '  <span class="pseudo-fn">siftDown</span>(0)',
    '  <span class="pseudo-kw">return</span> maxVal',
  ],
};

export const HEAP_SORT_INFO: DataStructureInfo = {
  name: 'Heap Sort (Priority Queue Sort)',
  category: 'Comparison-Based Sorting Algorithm',
  description:
    'Comparison-based sorting algorithm that first transforms the input array into a binary heap in O(n) time using Floyd algorithm, then repeatedly extracts the root element in O(n log n) total time.',
  whenToUse:
    'Systems requiring strict O(n log n) worst-case time without recursion stack overhead, embedded systems requiring O(1) auxiliary space.',
  constraints: [
    'Discipline: In-place Priority Queue extraction',
    'Time Complexity: Strict O(n log n) across best, average, and worst cases',
    'Auxiliary Space: O(1) in-place memory',
    'Stability: Unstable due to non-adjacent child swaps',
    `Capacity: Up to ${HEAP_CAPACITY} nodes for visual clarity`,
  ],
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1) in-place',
    stability: 'Unstable',
  },
  pseudo: [
    '<span class="pseudo-fn">heapSort</span>(arr):',
    '  <span class="pseudo-comm">// Phase 1: Build Max-Heap in O(n)</span>',
    '  for i = floor(n/2) - 1 down to 0:',
    '    siftDown(arr, i, n)',
    '  <span class="pseudo-comm">// Phase 2: Extract max and move to end</span>',
    '  for i = n - 1 down to 1:',
    '    swap(arr[0], arr[i])',
    '    siftDown(arr, 0, i)',
  ],
};

export const HEAP_INFOS: Record<HeapMode, DataStructureInfo> = {
  minheap: MIN_HEAP_INFO,
  maxheap: MAX_HEAP_INFO,
  heapsort: HEAP_SORT_INFO,
};

export const HEAP_INFO: Record<string, DataStructureInfo> = {
  minheap: MIN_HEAP_INFO,
  maxheap: MAX_HEAP_INFO,
  heapsort: HEAP_SORT_INFO,
};

export class Heap {
  data: number[];
  type: 'min' | 'max';

  constructor(type: 'min' | 'max' = 'min') {
    this.data = [];
    this.type = type;
  }

  _cmp(a: number, b: number): boolean {
    return this.type === 'min' ? a < b : a > b;
  }

  getParent(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  getLeft(i: number): number {
    return 2 * i + 1;
  }

  getRight(i: number): number {
    return 2 * i + 2;
  }

  peek(): number | null {
    return this.data.length > 0 ? this.data[0] : null;
  }

  insert(val: number): void {
    this.data.push(val);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = this.getParent(i);
      if (this._cmp(this.data[i], this.data[p])) {
        [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
        i = p;
      } else break;
    }
  }

  extract(): number | null {
    if (!this.data.length) return null;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length) {
      this.data[0] = last;
      this._heapifyDown(0);
    }
    return top;
  }

  _heapifyDown(i: number, limit = this.data.length): void {
    while (true) {
      let best = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;

      if (l < limit && this._cmp(this.data[l], this.data[best])) best = l;
      if (r < limit && this._cmp(this.data[r], this.data[best])) best = r;
      if (best === i) break;

      [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
      i = best;
    }
  }

  heapify(arr: number[]): void {
    this.data = [...arr];
    for (let i = Math.floor(this.data.length / 2) - 1; i >= 0; i--) {
      this._heapifyDown(i);
    }
  }

  getHeight(): number {
    if (this.data.length === 0) return 0;
    return Math.floor(Math.log2(this.data.length)) + 1;
  }

  getNodeCount(): number {
    return this.data.length;
  }

  toLayout(w: number, h: number): HeapLayoutResult {
    const nodes: { val: number; x: number; y: number; idx: number }[] = [];
    const edges: { from: [number, number]; to: [number, number] }[] = [];
    const n = this.data.length;
    const posMap: Record<number, { x: number; y: number }> = {};

    const maxDepth = Math.max(1, Math.floor(Math.log2(Math.max(1, n))));
    const startY = 48;
    const depthSpacing = Math.min(68, Math.max(46, (h - 110) / maxDepth));

    for (let i = 0; i < n; i++) {
      const depth = Math.floor(Math.log2(i + 1));
      const levelStart = Math.pow(2, depth) - 1;
      const levelCount = Math.pow(2, depth);
      const posInLevel = i - levelStart;
      const x = (w * (posInLevel + 0.5)) / levelCount;
      const y = startY + depth * depthSpacing;
      posMap[i] = { x, y };
      nodes.push({ val: this.data[i], x, y, idx: i });
    }

    for (let i = 1; i < n; i++) {
      const p = Math.floor((i - 1) / 2);
      if (posMap[p] && posMap[i]) {
        edges.push({ from: [posMap[p].x, posMap[p].y], to: [posMap[i].x, posMap[i].y] });
      }
    }

    return { nodes, edges };
  }
}
