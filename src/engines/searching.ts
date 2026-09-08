import { AlgorithmMeta, SearchStep, MetricsDelta } from '@/types';

const delta = (comparisons = 0, swaps = 0, accesses = 0): MetricsDelta => ({ comparisons, swaps, accesses });

export const SEARCHING_ALGORITHMS: Record<string, AlgorithmMeta<SearchStep>> = {
  linear: {
    name: 'Linear Search',
    complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">for</span> i = 0 <span class="pseudo-kw">to</span> n-1:',
      '  <span class="pseudo-kw">if</span> arr[i] == target:',
      '    <span class="pseudo-kw">return</span> i',
      '<span class="pseudo-kw">return</span> -1',
    ],
    *generator(arr: number[], target: number): Generator<SearchStep> {
      for (let i = 0; i < arr.length; i++) {
        yield {
          arr,
          target,
          current: i,
          found: -1,
          searched: Array.from({ length: i }, (_, k) => k),
          line: 1,
          metrics: delta(1, 0, 1),
        };
        if (arr[i] === target) {
          yield { arr, target, current: i, found: i, searched: [], done: true, line: 2 };
          return;
        }
      }
      yield { arr, target, current: -1, found: -2, searched: arr.map((_, i) => i), done: true, line: 3 };
    }
  },

  binary: {
    name: 'Binary Search',
    complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    pseudo: [
      'lo = 0, hi = n-1',
      '<span class="pseudo-kw">while</span> lo <= hi:',
      '  mid = floor((lo + hi) / 2)',
      '  <span class="pseudo-kw">if</span> arr[mid] == target: <span class="pseudo-kw">return</span> mid',
      '  <span class="pseudo-kw">if</span> arr[mid] < target: lo = mid+1',
      '  <span class="pseudo-kw">else</span>: hi = mid-1',
    ],
    *generator(arr: number[], target: number): Generator<SearchStep> {
      const sorted = [...arr].sort((a, b) => a - b);
      let lo = 0, hi = sorted.length - 1;

      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const value = sorted[mid];
        yield { arr: sorted, target, lo, hi, mid, found: -1, line: 3, metrics: delta(1, 0, 1) };

        if (value === target) {
          yield { arr: sorted, target, lo, hi, mid, found: mid, done: true, line: 3 };
          return;
        }

        yield { arr: sorted, target, lo, hi, mid, found: -1, line: 4, metrics: delta(1, 0, 0) };
        if (value < target) lo = mid + 1;
        else hi = mid - 1;
      }

      yield { arr: sorted, target, lo: -1, hi: -1, mid: -1, found: -2, done: true, line: 5 };
    }
  }
};
