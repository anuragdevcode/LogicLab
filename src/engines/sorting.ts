import { AlgorithmMeta, SortStep, MetricsDelta } from '@/types';

const delta = (comparisons = 0, swaps = 0, accesses = 0): MetricsDelta => ({ comparisons, swaps, accesses });

export const SORTING_ALGORITHMS: Record<string, AlgorithmMeta<SortStep>> = {
  bubble: {
    name: 'Bubble Sort',
    category: 'Exchanging',
    stability: true,
    inPlace: true,
    description:
      'Iteratively steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements "bubble" to the end of the array.',
    whenToUse:
      'Educational purposes, detecting whether a list is already sorted in linear O(n) time, or for very small collections with minimal memory overhead.',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Element Values: Integers [10 .. 99]',
      'Stability: Stable (preserves original order of equals)',
      'In-Place: Auxiliary space O(1) without memory allocation',
    ],
    complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">for</span> i = 0 <span class="pseudo-kw">to</span> n-1:',
      '  <span class="pseudo-kw">for</span> j = 0 <span class="pseudo-kw">to</span> n-i-2:',
      '    <span class="pseudo-kw">if</span> arr[j] > arr[j+1]:',
      '      <span class="pseudo-fn">swap</span>(arr[j], arr[j+1])',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr], n = a.length;
      const done: number[] = [];

      for (let i = 0; i < n - 1; i++) {
        let swappedThisPass = false;
        for (let j = 0; j < n - i - 1; j++) {
          yield {
            arr: [...a],
            cmp: [j, j + 1],
            swap: false,
            done: [...done],
            pointers: { i, j, 'j+1': j + 1 },
            reason: `Comparing arr[${j}]=${a[j]} with arr[${j + 1}]=${a[j + 1]}`,
            action: 'compare',
            line: 2,
            metrics: delta(1, 0, 2),
          };

          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            swappedThisPass = true;
            yield {
              arr: [...a],
              cmp: [j, j + 1],
              swap: true,
              done: [...done],
              pointers: { i, j, 'j+1': j + 1 },
              reason: `Swapped arr[${j}]=${a[j]} and arr[${j + 1}]=${a[j + 1]} (${a[j + 1]} was > ${a[j]})`,
              action: 'swap',
              line: 3,
              metrics: delta(0, 1, 4),
            };
          }
        }
        done.unshift(n - i - 1);
        if (!swappedThisPass) {
          // Early exit optimization
          break;
        }
      }
      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Bubble Sort complete! All elements are in non-decreasing sorted order.',
        action: 'done',
        line: -1,
      };
    },
  },

  selection: {
    name: 'Selection Sort',
    category: 'Selection',
    stability: false,
    inPlace: true,
    description:
      'Divides the array into sorted prefix and unsorted suffix. Repeatedly finds the smallest element from the unsorted suffix and swaps it with the first unsorted element.',
    whenToUse:
      'When writing to memory is significantly more expensive than reading (Selection sort performs at most O(n) swaps overall).',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Element Values: Integers [10 .. 99]',
      'Stability: Unstable (long range swaps disrupt relative order)',
      'Comparisons Invariant: Always strictly n*(n-1)/2 comparisons',
    ],
    complexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">for</span> i = 0 <span class="pseudo-kw">to</span> n-1:',
      '  minIdx = i',
      '  <span class="pseudo-kw">for</span> j = i+1 <span class="pseudo-kw">to</span> n:',
      '    <span class="pseudo-kw">if</span> arr[j] < arr[minIdx]: minIdx = j',
      '  <span class="pseudo-fn">swap</span>(arr[i], arr[minIdx])',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr], n = a.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        yield {
          arr: [...a],
          cmp: [i],
          swap: false,
          done: Array.from({ length: i }, (_, k) => k),
          pointers: { i, min: minIdx },
          reason: `Beginning pass ${i + 1}: assuming minimum element is at index ${i} (value: ${a[i]})`,
          action: 'pivot',
          line: 1,
          metrics: delta(0, 0, 1),
        };

        for (let j = i + 1; j < n; j++) {
          yield {
            arr: [...a],
            cmp: [minIdx, j],
            swap: false,
            done: Array.from({ length: i }, (_, k) => k),
            pointers: { i, min: minIdx, j },
            reason: `Scanning unsorted suffix: comparing current min arr[${minIdx}]=${a[minIdx]} with candidate arr[${j}]=${a[j]}`,
            action: 'compare',
            line: 3,
            metrics: delta(1, 0, 2),
          };

          if (a[j] < a[minIdx]) {
            minIdx = j;
            yield {
              arr: [...a],
              cmp: [minIdx],
              swap: false,
              done: Array.from({ length: i }, (_, k) => k),
              pointers: { i, min: minIdx },
              reason: `Found new minimum element: arr[${minIdx}]=${a[minIdx]}`,
              action: 'pivot',
              line: 3,
              metrics: delta(0, 0, 1),
            };
          }
        }

        if (minIdx !== i) {
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          yield {
            arr: [...a],
            cmp: [i, minIdx],
            swap: true,
            done: Array.from({ length: i + 1 }, (_, k) => k),
            pointers: { i, min: minIdx },
            reason: `Placed minimum value ${a[i]} into sorted position index ${i}`,
            action: 'swap',
            line: 4,
            metrics: delta(0, 1, 4),
          };
        } else {
          yield {
            arr: [...a],
            cmp: [i],
            swap: false,
            done: Array.from({ length: i + 1 }, (_, k) => k),
            pointers: { i },
            reason: `Element arr[${i}]=${a[i]} was already the minimum; no swap necessary`,
            action: 'compare',
            line: 4,
            metrics: delta(0, 0, 1),
          };
        }
      }
      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Selection Sort complete! All minimums extracted in sequence.',
        action: 'done',
        line: -1,
      };
    },
  },

  insertion: {
    name: 'Insertion Sort',
    category: 'Insertion',
    stability: true,
    inPlace: true,
    description:
      'Builds the sorted array one item at a time by picking the next element and shifting larger sorted elements rightward to insert it into its correct location.',
    whenToUse:
      'Outstanding for small datasets (n < 20) or data that is already substantially sorted (achieving near-linear O(n) runtime). Often used as the base case in hybrid algorithms like TimSort.',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Adaptive Invariant: Strictly O(n) runtime if array is nearly sorted',
      'Stability: Stable (equal keys maintain order)',
      'In-Place: Auxiliary Space O(1)',
    ],
    complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">for</span> i = 1 <span class="pseudo-kw">to</span> n:',
      '  key = arr[i]; j = i-1',
      '  <span class="pseudo-kw">while</span> j >= 0 <span class="pseudo-kw">and</span> arr[j] > key:',
      '    arr[j+1] = arr[j]',
      '  arr[j+1] = key',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr], n = a.length;
      for (let i = 1; i < n; i++) {
        const key = a[i];
        let j = i - 1;
        yield {
          arr: [...a],
          cmp: [i],
          swap: false,
          done: Array.from({ length: i }, (_, k) => k),
          pointers: { key: i },
          reason: `Selected key element arr[${i}]=${key} for insertion into sorted prefix [0..${i - 1}]`,
          action: 'pivot',
          line: 1,
          metrics: delta(0, 0, 1),
        };

        while (j >= 0) {
          yield {
            arr: [...a],
            cmp: [j, j + 1],
            swap: false,
            done: [],
            pointers: { j, 'j+1': j + 1 },
            reason: `Comparing sorted element arr[${j}]=${a[j]} with key=${key}`,
            action: 'compare',
            line: 2,
            metrics: delta(1, 0, 1),
          };

          if (a[j] <= key) {
            yield {
              arr: [...a],
              cmp: [j],
              swap: false,
              done: [],
              pointers: { j },
              reason: `arr[${j}]=${a[j]} is ≤ key (${key}); correct insertion spot found at index ${j + 1}`,
              action: 'compare',
              line: 2,
              metrics: delta(0, 0, 1),
            };
            break;
          }

          a[j + 1] = a[j];
          yield {
            arr: [...a],
            cmp: [j, j + 1],
            swap: true,
            done: [],
            pointers: { j, 'shifted': j + 1 },
            reason: `Shifted arr[${j}]=${a[j]} rightward to index ${j + 1} to make room for key`,
            action: 'shift',
            line: 3,
            metrics: delta(0, 0, 2),
          };
          j--;
        }

        a[j + 1] = key;
        yield {
          arr: [...a],
          cmp: [j + 1],
          swap: false,
          done: Array.from({ length: i + 1 }, (_, k) => k),
          pointers: { inserted: j + 1 },
          reason: `Inserted key=${key} at index ${j + 1}. Prefix [0..${i}] is now sorted.`,
          action: 'insert',
          line: 4,
          metrics: delta(0, 0, 1),
        };
      }
      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Insertion Sort complete! Sorted prefix expanded to the entire array.',
        action: 'done',
        line: -1,
      };
    },
  },

  merge: {
    name: 'Merge Sort',
    category: 'Divide and Conquer',
    stability: true,
    inPlace: false,
    description:
      'Divide-and-conquer algorithm that recursively divides the array into halves until single-element subarrays, then merges the sorted halves into a combined sorted sequence.',
    whenToUse:
      'When guaranteed O(n log n) runtime and stability are required (e.g. sorting linked lists, external sorting where random access is slow, or database record indexes).',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Auxiliary Space: Strictly O(n) auxiliary buffer array required',
      'Call Stack: O(log n) recursion depth',
      'Stability: Stable (left subarray favored on ties)',
    ],
    complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    pseudo: [
      '<span class="pseudo-fn">mergeSort</span>(arr, l, r):',
      '  split the array into two halves',
      '  sort left half and right half',
      '  compare the front values',
      '  write the smaller value back',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr];

      function* ms(l: number, r: number): Generator<SortStep> {
        if (l >= r) return;
        const mid = Math.floor((l + r) / 2);

        yield {
          arr: [...a],
          cmp: [l, r],
          swap: false,
          done: [],
          range: [l, r],
          pointers: { l, mid, r },
          reason: `Dividing range [${l}..${r}] into left [${l}..${mid}] and right [${mid + 1}..${r}]`,
          action: 'split',
          line: 1,
          metrics: delta(0, 0, 0),
        };

        yield* ms(l, mid);
        yield* ms(mid + 1, r);

        const left = a.slice(l, mid + 1);
        const right = a.slice(mid + 1, r + 1);
        let i = 0, j = 0, k = l;

        yield {
          arr: [...a],
          cmp: [],
          swap: false,
          done: [],
          range: [l, r],
          pointers: { l, mid, r, write: k },
          reason: `Merging sorted segments [${l}..${mid}] and [${mid + 1}..${r}]`,
          action: 'partition',
          line: 2,
          metrics: delta(0, 0, 0),
        };

        while (i < left.length && j < right.length) {
          const lIdx = l + i;
          const rIdx = mid + 1 + j;

          yield {
            arr: [...a],
            cmp: [lIdx, rIdx],
            swap: false,
            done: [],
            range: [l, r],
            pointers: { left: lIdx, right: rIdx, k },
            reason: `Comparing left segment element ${left[i]} with right segment element ${right[j]}`,
            action: 'compare',
            line: 3,
            metrics: delta(1, 0, 2),
          };

          if (left[i] <= right[j]) {
            a[k] = left[i++];
            yield {
              arr: [...a],
              cmp: [k],
              swap: false,
              done: [],
              range: [l, r],
              pointers: { placed: k },
              reason: `Wrote smaller left element ${a[k]} to index ${k}`,
              action: 'insert',
              line: 4,
              metrics: delta(0, 0, 1),
            };
          } else {
            a[k] = right[j++];
            yield {
              arr: [...a],
              cmp: [k],
              swap: false,
              done: [],
              range: [l, r],
              pointers: { placed: k },
              reason: `Wrote smaller right element ${a[k]} to index ${k}`,
              action: 'insert',
              line: 4,
              metrics: delta(0, 0, 1),
            };
          }
          k++;
        }

        while (i < left.length) {
          a[k] = left[i++];
          yield {
            arr: [...a],
            cmp: [k],
            swap: false,
            done: [],
            range: [l, r],
            pointers: { remaining: k },
            reason: `Flushing remaining left segment element ${a[k]} to index ${k}`,
            action: 'insert',
            line: 4,
            metrics: delta(0, 0, 2),
          };
          k++;
        }

        while (j < right.length) {
          a[k] = right[j++];
          yield {
            arr: [...a],
            cmp: [k],
            swap: false,
            done: [],
            range: [l, r],
            pointers: { remaining: k },
            reason: `Flushing remaining right segment element ${a[k]} to index ${k}`,
            action: 'insert',
            line: 4,
            metrics: delta(0, 0, 2),
          };
          k++;
        }
      }

      yield* ms(0, a.length - 1);
      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Merge Sort complete! All recursive subproblems merged into final array.',
        action: 'done',
        line: -1,
      };
    },
  },

  quick: {
    name: 'Quick Sort',
    category: 'Divide and Conquer',
    stability: false,
    inPlace: true,
    description:
      'Picks a pivot element and partitions the array such that elements smaller than the pivot precede it, and larger elements follow it. Recursively sorts the partitions.',
    whenToUse:
      'General-purpose in-memory sorting. With low constant factors and cache locality, it is often the fastest practical sorting algorithm in practice.',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Partition Scheme: Lomuto partition (last element as pivot)',
      'Stability: Unstable',
      'Worst Case Penalty: O(n²) when array is already sorted with bad pivot',
    ],
    complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    pseudo: [
      '<span class="pseudo-fn">quickSort</span>(arr, low, high):',
      '  choose arr[high] as pivot',
      '  compare each value with pivot',
      '  move smaller values before pivot',
      '  put pivot in its final place',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr];

      function* qs(lo: number, hi: number): Generator<SortStep> {
        if (lo >= hi) {
          if (lo === hi) {
            yield {
              arr: [...a],
              cmp: [lo],
              swap: false,
              done: [],
              range: [lo, hi],
              reason: `Single element at index ${lo} is trivially partitioned`,
              action: 'done',
              line: 4,
            };
          }
          return;
        }

        const pivot = a[hi];
        let i = lo - 1;

        yield {
          arr: [...a],
          cmp: [hi],
          swap: false,
          done: [],
          pivot: hi,
          range: [lo, hi],
          pointers: { lo, hi, pivot: hi },
          reason: `Selected pivot arr[${hi}]=${pivot} for partition range [${lo}..${hi}]`,
          action: 'pivot',
          line: 1,
          metrics: delta(0, 0, 1),
        };

        for (let j = lo; j < hi; j++) {
          yield {
            arr: [...a],
            cmp: [j, hi],
            swap: false,
            done: [],
            pivot: hi,
            range: [lo, hi],
            pointers: { i: Math.max(lo, i), j, pivot: hi },
            reason: `Comparing arr[${j}]=${a[j]} with pivot ${pivot}`,
            action: 'compare',
            line: 2,
            metrics: delta(1, 0, 1),
          };

          if (a[j] <= pivot) {
            i++;
            if (i !== j) {
              [a[i], a[j]] = [a[j], a[i]];
              yield {
                arr: [...a],
                cmp: [i, j],
                swap: true,
                done: [],
                pivot: hi,
                range: [lo, hi],
                pointers: { i, j, pivot: hi },
                reason: `arr[${j}] ≤ pivot: swapped arr[${i}] and arr[${j}] into left partition`,
                action: 'swap',
                line: 3,
                metrics: delta(0, 1, 4),
              };
            }
          }
        }

        if (i + 1 !== hi) {
          [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
          yield {
            arr: [...a],
            cmp: [i + 1, hi],
            swap: true,
            done: [],
            pivot: i + 1,
            range: [lo, hi],
            pointers: { pivot: i + 1 },
            reason: `Placed pivot ${pivot} into its exact final sorted position at index ${i + 1}`,
            action: 'pivot',
            line: 4,
            metrics: delta(0, 1, 4),
          };
        }

        const pIdx = i + 1;
        yield* qs(lo, pIdx - 1);
        yield* qs(pIdx + 1, hi);
      }

      yield* qs(0, a.length - 1);
      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Quick Sort complete! All partitions recursively resolved.',
        action: 'done',
        line: -1,
      };
    },
  },

  shell: {
    name: 'Shell Sort',
    category: 'Insertion / Diminishing Gap',
    stability: false,
    inPlace: true,
    description:
      'Generalization of Insertion Sort that allows the exchange of items that are far apart. Sorts pairs of elements separated by a diminishing gap sequence.',
    whenToUse:
      'Medium-sized arrays where recursion overhead of QuickSort/MergeSort is undesirable and code footprint must remain small with zero extra heap allocations.',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Gap Sequence: Halving sequence gap = floor(gap / 2)',
      'Stability: Unstable (distant gap swaps skip identical items)',
      'In-Place: Auxiliary Space O(1)',
    ],
    complexity: { best: 'O(n log n)', avg: 'O(n^(4/3))', worst: 'O(n²)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">for</span> gap = floor(n/2) <span class="pseudo-kw">down to</span> 1:',
      '  <span class="pseudo-kw">for</span> i = gap <span class="pseudo-kw">to</span> n-1:',
      '    temp = arr[i]; j = i',
      '    <span class="pseudo-kw">while</span> j >= gap <span class="pseudo-kw">and</span> arr[j-gap] > temp:',
      '      arr[j] = arr[j-gap]; j -= gap',
      '    arr[j] = temp',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr], n = a.length;

      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        yield {
          arr: [...a],
          cmp: [],
          swap: false,
          done: [],
          pointers: { gap },
          reason: `Reducing gap to ${gap}. Interleaved sub-arrays will be insertion-sorted across stride ${gap}.`,
          action: 'partition',
          line: 0,
          metrics: delta(0, 0, 0),
        };

        for (let i = gap; i < n; i++) {
          const temp = a[i];
          let j = i;

          yield {
            arr: [...a],
            cmp: [i],
            swap: false,
            done: [],
            pointers: { i, gap },
            reason: `Picking element arr[${i}]=${temp} to compare across gap ${gap}`,
            action: 'pivot',
            line: 2,
            metrics: delta(0, 0, 1),
          };

          while (j >= gap) {
            yield {
              arr: [...a],
              cmp: [j - gap, j],
              swap: false,
              done: [],
              pointers: { 'j-gap': j - gap, j },
              reason: `Comparing arr[${j - gap}]=${a[j - gap]} with temp=${temp} across stride ${gap}`,
              action: 'compare',
              line: 3,
              metrics: delta(1, 0, 2),
            };

            if (a[j - gap] <= temp) break;

            a[j] = a[j - gap];
            yield {
              arr: [...a],
              cmp: [j - gap, j],
              swap: true,
              done: [],
              pointers: { 'j-gap': j - gap, j },
              reason: `Shifted arr[${j - gap}]=${a[j]} rightward by gap ${gap}`,
              action: 'shift',
              line: 4,
              metrics: delta(0, 0, 2),
            };

            j -= gap;
          }

          a[j] = temp;
          yield {
            arr: [...a],
            cmp: [j],
            swap: false,
            done: [],
            pointers: { placed: j },
            reason: `Inserted temp=${temp} at stride-index ${j}`,
            action: 'insert',
            line: 5,
            metrics: delta(0, 0, 1),
          };
        }
      }

      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Shell Sort complete! The gap has reached 1 and final insertion pass is verified.',
        action: 'done',
        line: -1,
      };
    },
  },

  heapSort: {
    name: 'Heap Sort',
    category: 'Selection / Heap Priority',
    stability: false,
    inPlace: true,
    description:
      'Builds a Max-Heap from the array in O(n) time, then repeatedly extracts the maximum root element to the end of the array and heapifies the remaining structure.',
    whenToUse:
      'Systems requiring strict worst-case O(n log n) time guarantees with constant O(1) auxiliary space (e.g. real-time embedded systems or Linux kernel sorting).',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Heap Tree Structure: Complete Binary Tree in 0-indexed array',
      'Stability: Unstable (root swaps bypass sibling order)',
      'In-Place: Strictly Auxiliary Space O(1)',
    ],
    complexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-fn">heapSort</span>(arr):',
      '  build max heap from array',
      '  <span class="pseudo-kw">for</span> i = n-1 <span class="pseudo-kw">down to</span> 1:',
      '    <span class="pseudo-fn">swap</span>(arr[0], arr[i])',
      '    heapify root on reduced heap',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr], n = a.length;

      function* heapify(size: number, rootIdx: number): Generator<SortStep> {
        let largest = rootIdx;
        const left = 2 * rootIdx + 1;
        const right = 2 * rootIdx + 2;

        if (left < size) {
          yield {
            arr: [...a],
            cmp: [rootIdx, left],
            swap: false,
            done: Array.from({ length: n - size }, (_, k) => n - 1 - k),
            pointers: { root: rootIdx, left },
            reason: `Heapify: comparing parent arr[${rootIdx}]=${a[rootIdx]} with left child arr[${left}]=${a[left]}`,
            action: 'compare',
            line: 4,
            metrics: delta(1, 0, 2),
          };
          if (a[left] > a[largest]) largest = left;
        }

        if (right < size) {
          yield {
            arr: [...a],
            cmp: [largest, right],
            swap: false,
            done: Array.from({ length: n - size }, (_, k) => n - 1 - k),
            pointers: { currentMax: largest, right },
            reason: `Heapify: comparing current max arr[${largest}]=${a[largest]} with right child arr[${right}]=${a[right]}`,
            action: 'compare',
            line: 4,
            metrics: delta(1, 0, 2),
          };
          if (a[right] > a[largest]) largest = right;
        }

        if (largest !== rootIdx) {
          [a[rootIdx], a[largest]] = [a[largest], a[rootIdx]];
          yield {
            arr: [...a],
            cmp: [rootIdx, largest],
            swap: true,
            done: Array.from({ length: n - size }, (_, k) => n - 1 - k),
            pointers: { root: rootIdx, swappedChild: largest },
            reason: `Heap property violated: swapped arr[${rootIdx}] and arr[${largest}] to bubble larger value up`,
            action: 'swap',
            line: 4,
            metrics: delta(0, 1, 4),
          };
          yield* heapify(size, largest);
        }
      }

      // 1. Build heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield {
          arr: [...a],
          cmp: [i],
          swap: false,
          done: [],
          pointers: { root: i },
          reason: `Building initial Max-Heap: heapifying subtree rooted at index ${i}`,
          action: 'pivot',
          line: 1,
        };
        yield* heapify(n, i);
      }

      // 2. Extract max one by one
      for (let i = n - 1; i > 0; i--) {
        [a[0], a[i]] = [a[i], a[0]];
        yield {
          arr: [...a],
          cmp: [0, i],
          swap: true,
          done: Array.from({ length: n - i }, (_, k) => n - 1 - k),
          pointers: { root: 0, extracted: i },
          reason: `Extracted maximum element ${a[i]} to sorted position index ${i}`,
          action: 'swap',
          line: 3,
          metrics: delta(0, 1, 4),
        };

        yield* heapify(i, 0);
      }

      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Heap Sort complete! All heap extractions completed into sorted array.',
        action: 'done',
        line: -1,
      };
    },
  },

  cocktail: {
    name: 'Cocktail Shaker Sort',
    category: 'Exchanging / Bidirectional',
    stability: true,
    inPlace: true,
    description:
      'Bidirectional variation of Bubble Sort. Alternates passes left-to-right (bubbling the largest item to the end) and right-to-left (bubbling the smallest item to the beginning). Eliminates turtles (small values near the end).',
    whenToUse:
      'Useful over standard Bubble Sort when small values are concentrated near the end of the array, preventing slow one-step-at-a-time propagation.',
    constraints: [
      'Input Array Size: 5 <= N <= 48 elements',
      'Bidirectional Scan: Alternating forward and backward passes',
      'Stability: Stable (equal items maintain relative order)',
      'In-Place: Auxiliary Space O(1)',
    ],
    complexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">do</span>:',
      '  bubble largest forward (left to right)',
      '  decrement right bound',
      '  bubble smallest backward (right to left)',
      '  increment left bound',
      '<span class="pseudo-kw">while</span> elements were swapped',
    ],
    *generator(arr: number[]): Generator<SortStep> {
      const a = [...arr], n = a.length;
      let start = 0, end = n - 1;
      let swapped = true;
      const doneIndices: number[] = [];

      while (swapped) {
        swapped = false;

        // Forward pass: left to right
        for (let i = start; i < end; i++) {
          yield {
            arr: [...a],
            cmp: [i, i + 1],
            swap: false,
            done: [...doneIndices],
            pointers: { forward: i, 'next': i + 1 },
            reason: `Forward pass: comparing arr[${i}]=${a[i]} with arr[${i + 1}]=${a[i + 1]}`,
            action: 'compare',
            line: 1,
            metrics: delta(1, 0, 2),
          };

          if (a[i] > a[i + 1]) {
            [a[i], a[i + 1]] = [a[i + 1], a[i]];
            swapped = true;
            yield {
              arr: [...a],
              cmp: [i, i + 1],
              swap: true,
              done: [...doneIndices],
              pointers: { forward: i, 'next': i + 1 },
              reason: `Forward pass: swapped ${a[i + 1]} and ${a[i]} to bubble larger item rightward`,
              action: 'swap',
              line: 1,
              metrics: delta(0, 1, 4),
            };
          }
        }

        doneIndices.push(end);
        end--;

        if (!swapped) break;
        swapped = false;

        // Backward pass: right to left
        for (let i = end - 1; i >= start; i--) {
          yield {
            arr: [...a],
            cmp: [i, i + 1],
            swap: false,
            done: [...doneIndices],
            pointers: { backward: i, 'prev': i + 1 },
            reason: `Backward pass: comparing arr[${i}]=${a[i]} with arr[${i + 1}]=${a[i + 1]}`,
            action: 'compare',
            line: 3,
            metrics: delta(1, 0, 2),
          };

          if (a[i] > a[i + 1]) {
            [a[i], a[i + 1]] = [a[i + 1], a[i]];
            swapped = true;
            yield {
              arr: [...a],
              cmp: [i, i + 1],
              swap: true,
              done: [...doneIndices],
              pointers: { backward: i, 'prev': i + 1 },
              reason: `Backward pass: swapped ${a[i + 1]} and ${a[i]} to sink smaller item leftward`,
              action: 'swap',
              line: 3,
              metrics: delta(0, 1, 4),
            };
          }
        }

        doneIndices.push(start);
        start++;
      }

      yield {
        arr: [...a],
        cmp: [],
        swap: false,
        done: a.map((_, i) => i),
        reason: 'Cocktail Shaker Sort complete! Array is sorted from both ends simultaneously.',
        action: 'done',
        line: -1,
      };
    },
  },
};
