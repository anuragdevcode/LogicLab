/* js/engines/sorting.js */
'use strict';

window.SortingEngine = (() => {
  const delta = (comparisons = 0, swaps = 0, accesses = 0) => ({ comparisons, swaps, accesses });

  const ALGORITHMS = {
    bubble: {
      name: 'Bubble Sort',
      complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      pseudo: [
        '<span class="pseudo-kw">for</span> i = 0 <span class="pseudo-kw">to</span> n-1:',
        '  <span class="pseudo-kw">for</span> j = 0 <span class="pseudo-kw">to</span> n-i-2:',
        '    <span class="pseudo-kw">if</span> arr[j] > arr[j+1]:',
        '      <span class="pseudo-fn">swap</span>(arr[j], arr[j+1])',
      ],
      * gen(arr) {
        const a = [...arr], n = a.length;
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            yield { arr: [...a], cmp: [j, j + 1], swap: false, done: [], line: 2, metrics: delta(1, 0, 2) };
            if (a[j] > a[j + 1]) {
              [a[j], a[j + 1]] = [a[j + 1], a[j]];
              yield { arr: [...a], cmp: [j, j + 1], swap: true, done: [], line: 3, metrics: delta(0, 1, 4) };
            }
          }
        }
        yield { arr: [...a], cmp: [], swap: false, done: a.map((_, i) => i), line: -1 };
      }
    },

    selection: {
      name: 'Selection Sort',
      complexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      pseudo: [
        '<span class="pseudo-kw">for</span> i = 0 <span class="pseudo-kw">to</span> n-1:',
        '  minIdx = i',
        '  <span class="pseudo-kw">for</span> j = i+1 <span class="pseudo-kw">to</span> n:',
        '    <span class="pseudo-kw">if</span> arr[j] < arr[minIdx]: minIdx = j',
        '  <span class="pseudo-fn">swap</span>(arr[i], arr[minIdx])',
      ],
      * gen(arr) {
        const a = [...arr], n = a.length;
        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;
          for (let j = i + 1; j < n; j++) {
            yield {
              arr: [...a],
              cmp: [minIdx, j],
              swap: false,
              done: Array.from({ length: i }, (_, k) => k),
              line: 3,
              metrics: delta(1, 0, 2),
            };
            if (a[j] < a[minIdx]) minIdx = j;
          }
          if (minIdx !== i) {
            [a[i], a[minIdx]] = [a[minIdx], a[i]];
            yield {
              arr: [...a],
              cmp: [i, minIdx],
              swap: true,
              done: Array.from({ length: i }, (_, k) => k),
              line: 4,
              metrics: delta(0, 1, 4),
            };
          }
        }
        yield { arr: [...a], cmp: [], swap: false, done: a.map((_, i) => i), line: -1 };
      }
    },

    insertion: {
      name: 'Insertion Sort',
      complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
      pseudo: [
        '<span class="pseudo-kw">for</span> i = 1 <span class="pseudo-kw">to</span> n:',
        '  key = arr[i]; j = i-1',
        '  <span class="pseudo-kw">while</span> j >= 0 <span class="pseudo-kw">and</span> arr[j] > key:',
        '    arr[j+1] = arr[j]',
        '  arr[j+1] = key',
      ],
      * gen(arr) {
        const a = [...arr], n = a.length;
        for (let i = 1; i < n; i++) {
          const key = a[i];
          let j = i - 1;
          yield { arr: [...a], cmp: [i], swap: false, done: [], line: 1, metrics: delta(0, 0, 1) };

          while (j >= 0) {
            yield { arr: [...a], cmp: [j, j + 1], swap: false, done: [], line: 2, metrics: delta(1, 0, 1) };
            if (a[j] <= key) break;

            a[j + 1] = a[j];
            yield { arr: [...a], cmp: [j, j + 1], swap: true, done: [], line: 3, metrics: delta(0, 0, 2) };
            j--;
          }

          a[j + 1] = key;
          yield { arr: [...a], cmp: [j + 1], swap: false, done: [], line: 4, metrics: delta(0, 0, 1) };
        }
        yield { arr: [...a], cmp: [], swap: false, done: a.map((_, i) => i), line: -1 };
      }
    },

    merge: {
      name: 'Merge Sort',
      complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
      pseudo: [
        '<span class="pseudo-fn">mergeSort</span>(arr, l, r):',
        '  split the array into two halves',
        '  sort left half and right half',
        '  compare the front values',
        '  write the smaller value back',
      ],
      * gen(arr) {
        const a = [...arr];
        function* ms(l, r) {
          if (l >= r) return;
          const mid = Math.floor((l + r) / 2);
          yield* ms(l, mid);
          yield* ms(mid + 1, r);

          const left = a.slice(l, mid + 1);
          const right = a.slice(mid + 1, r + 1);
          let i = 0, j = 0, k = l;

          while (i < left.length && j < right.length) {
            yield { arr: [...a], cmp: [l + i, mid + 1 + j], swap: false, done: [], line: 3, metrics: delta(1, 0, 2) };
            a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
            yield { arr: [...a], cmp: [k - 1], swap: false, done: [], line: 4, metrics: delta(0, 0, 1) };
          }
          while (i < left.length) {
            a[k++] = left[i++];
            yield { arr: [...a], cmp: [k - 1], swap: false, done: [], line: 4, metrics: delta(0, 0, 2) };
          }
          while (j < right.length) {
            a[k++] = right[j++];
            yield { arr: [...a], cmp: [k - 1], swap: false, done: [], line: 4, metrics: delta(0, 0, 2) };
          }
        }
        yield* ms(0, a.length - 1);
        yield { arr: [...a], cmp: [], swap: false, done: a.map((_, i) => i), line: -1 };
      }
    },

    quick: {
      name: 'Quick Sort',
      complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
      pseudo: [
        '<span class="pseudo-fn">quickSort</span>(arr, low, high):',
        '  choose arr[high] as pivot',
        '  compare each value with pivot',
        '  move smaller values before pivot',
        '  put pivot in its final place',
      ],
      * gen(arr) {
        const a = [...arr];
        function* qs(lo, hi) {
          if (lo >= hi) return;

          const pivot = a[hi];
          let i = lo - 1;
          yield { arr: [...a], cmp: [hi], swap: false, done: [], pivot: hi, line: 1, metrics: delta(0, 0, 1) };

          for (let j = lo; j < hi; j++) {
            yield { arr: [...a], cmp: [j, hi], swap: false, done: [], pivot: hi, line: 2, metrics: delta(1, 0, 1) };
            if (a[j] <= pivot) {
              i++;
              if (i !== j) {
                [a[i], a[j]] = [a[j], a[i]];
                yield { arr: [...a], cmp: [i, j], swap: true, done: [], pivot: hi, line: 3, metrics: delta(0, 1, 4) };
              }
            }
          }

          if (i + 1 !== hi) {
            [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
            yield { arr: [...a], cmp: [i + 1, hi], swap: true, done: [], pivot: i + 1, line: 4, metrics: delta(0, 1, 4) };
          }
          yield* qs(lo, i);
          yield* qs(i + 2, hi);
        }
        yield* qs(0, a.length - 1);
        yield { arr: [...a], cmp: [], swap: false, done: a.map((_, i) => i), line: -1 };
      }
    }
  };

  return { ALGORITHMS };
})();
