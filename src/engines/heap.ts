import { ComplexityInfo, HeapLayoutResult } from '@/types';

export interface HeapInfo {
  name: string;
  complexity: ComplexityInfo;
  pseudo: string[];
}

export const HEAP_INFO: Record<string, HeapInfo> = {
  minheap: {
    name: 'Min Heap',
    complexity: { insert: 'O(log n)', extractMin: 'O(log n)', peek: 'O(1)', space: 'O(n)' },
    pseudo: [
      '<span class="pseudo-fn">insert</span>(val):',
      '  arr.push(val); i = arr.length-1',
      '  <span class="pseudo-kw">while</span> i > 0 <span class="pseudo-kw">and</span> arr[parent(i)] > arr[i]:',
      '    <span class="pseudo-fn">swap</span>(i, parent(i)); i = parent(i)',
      '<span class="pseudo-fn">extractMin</span>():',
      '  swap(0, last); arr.pop()',
      '  <span class="pseudo-fn">heapifyDown</span>(0)',
    ]
  },
  maxheap: {
    name: 'Max Heap',
    complexity: { insert: 'O(log n)', extractMax: 'O(log n)', peek: 'O(1)', space: 'O(n)' },
    pseudo: [
      '<span class="pseudo-fn">insert</span>(val):',
      '  arr.push(val); i = arr.length-1',
      '  <span class="pseudo-kw">while</span> i > 0 <span class="pseudo-kw">and</span> arr[parent(i)] < arr[i]:',
      '    <span class="pseudo-fn">swap</span>(i, parent(i)); i = parent(i)',
      '<span class="pseudo-fn">extractMax</span>():',
      '  swap(0, last); arr.pop()',
      '  <span class="pseudo-fn">heapifyDown</span>(0)',
    ]
  }
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

  insert(val: number): void {
    this.data.push(val);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
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

  _heapifyDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let best = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      
      if (l < n && this._cmp(this.data[l], this.data[best])) best = l;
      if (r < n && this._cmp(this.data[r], this.data[best])) best = r;
      if (best === i) break;
      
      [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
      i = best;
    }
  }

  toLayout(w: number, h: number): HeapLayoutResult {
    const nodes: { val: number; x: number; y: number; idx: number }[] = [];
    const edges: { from: [number, number]; to: [number, number] }[] = [];
    const n = this.data.length;
    const posMap: Record<number, { x: number; y: number }> = {};

    for (let i = 0; i < n; i++) {
      const depth = Math.floor(Math.log2(i + 1));
      const levelStart = Math.pow(2, depth) - 1;
      const levelCount = Math.pow(2, depth);
      const posInLevel = i - levelStart;
      const x = w * (posInLevel + 0.5) / levelCount;
      const y = 50 + depth * 70;
      posMap[i] = { x, y };
      nodes.push({ val: this.data[i], x, y, idx: i });
    }

    for (let i = 1; i < n; i++) {
      const p = Math.floor((i - 1) / 2);
      edges.push({ from: [posMap[p].x, posMap[p].y], to: [posMap[i].x, posMap[i].y] });
    }

    return { nodes, edges };
  }
}
