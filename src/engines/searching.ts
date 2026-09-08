import { AlgorithmMeta, SearchStep, MetricsDelta } from '@/types';

const delta = (comparisons = 0, swaps = 0, accesses = 0): MetricsDelta => ({ comparisons, swaps, accesses });

export const SEARCHING_ALGORITHMS: Record<string, AlgorithmMeta<SearchStep>> = {
  linear: {
    name: 'Linear Search',
    category: 'Sequential Scan',
    stability: true,
    inPlace: true,
    description:
      'Sequentially checks every element in the array starting from index 0 until the target is found or the end of the array is reached.',
    whenToUse:
      'Unordered/unsorted datasets, very small collections (n < 16), or single-use searches where the overhead of pre-sorting exceeds O(n).',
    complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">for</span> i = 0 <span class="pseudo-kw">to</span> n-1:',
      '  <span class="pseudo-kw">if</span> arr[i] == target:',
      '    <span class="pseudo-kw">return</span> i',
      '<span class="pseudo-kw">return</span> -1',
    ],
    *generator(arr: number[], target: number): Generator<SearchStep> {
      for (let i = 0; i < arr.length; i++) {
        const searched = Array.from({ length: i }, (_, k) => k);

        yield {
          arr,
          target,
          current: i,
          found: -1,
          searched,
          pointers: { curr: i },
          reason: `Checking arr[${i}]=${arr[i]} against target ${target}`,
          action: 'scan',
          line: 1,
          metrics: delta(1, 0, 1),
        };

        if (arr[i] === target) {
          yield {
            arr,
            target,
            current: i,
            found: i,
            searched,
            pointers: { found: i },
            reason: `Target ${target} matches element at index ${i}!`,
            action: 'found',
            done: true,
            line: 2,
            metrics: delta(0, 0, 0),
          };
          return;
        }
      }

      yield {
        arr,
        target,
        current: -1,
        found: -2,
        searched: arr.map((_, i) => i),
        reason: `Target ${target} was not found after scanning all ${arr.length} elements.`,
        action: 'not_found',
        done: true,
        line: 3,
        metrics: delta(0, 0, 0),
      };
    },
  },

  binary: {
    name: 'Binary Search',
    category: 'Divide and Conquer',
    stability: true,
    inPlace: true,
    description:
      'Calculates the midpoint of a sorted search window. Compares the midpoint value to the target, discarding the half that cannot contain the target.',
    whenToUse:
      'Standard lookup on sorted arrays. Excellent logarithmic performance (only ~17 comparisons for 100,000 items). Requires pre-sorted array with random access.',
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
        const discarded = [
          ...Array.from({ length: lo }, (_, k) => k),
          ...Array.from({ length: sorted.length - 1 - hi }, (_, k) => hi + 1 + k),
        ];

        yield {
          arr: sorted,
          target,
          lo,
          hi,
          mid,
          current: mid,
          found: -1,
          range: [lo, hi],
          discarded,
          pointers: { lo, mid, hi },
          reason: `Window [${lo}..${hi}]: probing midpoint arr[${mid}]=${value}`,
          action: 'probe',
          line: 2,
          metrics: delta(1, 0, 1),
        };

        if (value === target) {
          yield {
            arr: sorted,
            target,
            lo,
            hi,
            mid,
            current: mid,
            found: mid,
            range: [lo, hi],
            discarded,
            pointers: { found: mid },
            reason: `Target ${target} found at midpoint index ${mid}!`,
            action: 'found',
            done: true,
            line: 3,
            metrics: delta(0, 0, 0),
          };
          return;
        }

        if (value < target) {
          yield {
            arr: sorted,
            target,
            lo,
            hi,
            mid,
            found: -1,
            range: [lo, hi],
            discarded,
            pointers: { lo, mid, hi },
            reason: `arr[${mid}]=${value} < ${target}: target must be to the right. Discarding [${lo}..${mid}]`,
            action: 'narrow',
            line: 4,
            metrics: delta(0, 0, 0),
          };
          lo = mid + 1;
        } else {
          yield {
            arr: sorted,
            target,
            lo,
            hi,
            mid,
            found: -1,
            range: [lo, hi],
            discarded,
            pointers: { lo, mid, hi },
            reason: `arr[${mid}]=${value} > ${target}: target must be to the left. Discarding [${mid}..${hi}]`,
            action: 'narrow',
            line: 5,
            metrics: delta(0, 0, 0),
          };
          hi = mid - 1;
        }
      }

      yield {
        arr: sorted,
        target,
        lo: -1,
        hi: -1,
        mid: -1,
        found: -2,
        discarded: sorted.map((_, i) => i),
        reason: `Search space exhausted (lo > hi). Target ${target} is not present in the array.`,
        action: 'not_found',
        done: true,
        line: 5,
        metrics: delta(0, 0, 0),
      };
    },
  },

  jump: {
    name: 'Jump Search',
    category: 'Block Probing',
    stability: true,
    inPlace: true,
    description:
      'Jumps ahead by fixed block size m = floor(sqrt(n)). Once an element greater than the target is reached, performs a linear scan backward within that block.',
    whenToUse:
      'When binary search jump-back costs are high or on systems where jumping backward is expensive (e.g. tape drives or skip-lists). Balances forward jumps with linear scan.',
    complexity: { best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
    pseudo: [
      'step = floor(sqrt(n)), prev = 0',
      '<span class="pseudo-kw">while</span> arr[min(step, n)-1] < target:',
      '  prev = step; step += floor(sqrt(n))',
      '  <span class="pseudo-kw">if</span> prev >= n: <span class="pseudo-kw">return</span> -1',
      '<span class="pseudo-kw">while</span> arr[prev] < target:',
      '  prev++; <span class="pseudo-kw">if</span> prev == min(step, n): <span class="pseudo-kw">return</span> -1',
      '<span class="pseudo-kw">if</span> arr[prev] == target: <span class="pseudo-kw">return</span> prev',
    ],
    *generator(arr: number[], target: number): Generator<SearchStep> {
      const sorted = [...arr].sort((a, b) => a - b);
      const n = sorted.length;
      const stepSize = Math.max(1, Math.floor(Math.sqrt(n)));
      let prev = 0;
      let step = stepSize;

      // Phase 1: Block Jumps
      while (sorted[Math.min(step, n) - 1] < target) {
        const probeIdx = Math.min(step, n) - 1;
        yield {
          arr: sorted,
          target,
          current: probeIdx,
          found: -1,
          range: [prev, probeIdx],
          pointers: { blockStart: prev, blockEnd: probeIdx },
          reason: `Block end arr[${probeIdx}]=${sorted[probeIdx]} < ${target}: jumping ahead by stride ${stepSize}`,
          action: 'jump',
          line: 1,
          metrics: delta(1, 0, 1),
        };

        prev = step;
        step += stepSize;
        if (prev >= n) {
          yield {
            arr: sorted,
            target,
            found: -2,
            discarded: sorted.map((_, i) => i),
            reason: `Target ${target} exceeds maximum element in array. Not found.`,
            action: 'not_found',
            done: true,
            line: 3,
            metrics: delta(0, 0, 0),
          };
          return;
        }
      }

      // Phase 2: Local Linear Scan
      const blockLimit = Math.min(step, n);
      yield {
        arr: sorted,
        target,
        range: [prev, blockLimit - 1],
        pointers: { scanFrom: prev, scanTo: blockLimit - 1 },
        reason: `Target is bounded in block [${prev}..${blockLimit - 1}]. Commencing linear search.`,
        action: 'narrow',
        found: -1,
        line: 4,
        metrics: delta(0, 0, 0),
      };

      while (sorted[prev] < target) {
        yield {
          arr: sorted,
          target,
          current: prev,
          range: [prev, blockLimit - 1],
          pointers: { curr: prev },
          found: -1,
          reason: `Scanning block element arr[${prev}]=${sorted[prev]} < ${target}`,
          action: 'scan',
          line: 5,
          metrics: delta(1, 0, 1),
        };
        prev++;
        if (prev === blockLimit) {
          yield {
            arr: sorted,
            target,
            found: -2,
            reason: `Reached end of target block without finding ${target}. Not found.`,
            action: 'not_found',
            done: true,
            line: 5,
            metrics: delta(0, 0, 0),
          };
          return;
        }
      }

      if (sorted[prev] === target) {
        yield {
          arr: sorted,
          target,
          current: prev,
          found: prev,
          pointers: { found: prev },
          reason: `Target ${target} found at index ${prev}!`,
          action: 'found',
          done: true,
          line: 6,
          metrics: delta(1, 0, 1),
        };
        return;
      }

      yield {
        arr: sorted,
        target,
        found: -2,
        discarded: sorted.map((_, i) => i),
        reason: `Target ${target} not found in array.`,
        action: 'not_found',
        done: true,
        line: 5,
        metrics: delta(1, 0, 1),
      };
    },
  },

  interpolation: {
    name: 'Interpolation Search',
    category: 'Formula Probe',
    stability: true,
    inPlace: true,
    description:
      'Estimates the position of the target using a linear interpolation gradient formula based on values at the bounds, similar to searching a phone directory.',
    whenToUse:
      'Uniformly distributed sorted numbers (e.g. linear sensor readings or timestamps). Reaches O(log log n) average time, outperforming binary search on uniform data.',
    complexity: { best: 'O(1)', avg: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
    pseudo: [
      'lo = 0, hi = n-1',
      '<span class="pseudo-kw">while</span> lo <= hi <span class="pseudo-kw">and</span> target >= arr[lo] <span class="pseudo-kw">and</span> target <= arr[hi]:',
      '  pos = lo + floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]))',
      '  <span class="pseudo-kw">if</span> arr[pos] == target: <span class="pseudo-kw">return</span> pos',
      '  <span class="pseudo-kw">if</span> arr[pos] < target: lo = pos+1',
      '  <span class="pseudo-kw">else</span>: hi = pos-1',
    ],
    *generator(arr: number[], target: number): Generator<SearchStep> {
      const sorted = [...arr].sort((a, b) => a - b);
      let lo = 0, hi = sorted.length - 1;

      while (lo <= hi && target >= sorted[lo] && target <= sorted[hi]) {
        if (lo === hi) {
          if (sorted[lo] === target) {
            yield {
              arr: sorted,
              target,
              current: lo,
              found: lo,
              pointers: { found: lo },
              reason: `Target ${target} found at index ${lo}!`,
              action: 'found',
              done: true,
              line: 3,
              metrics: delta(1, 0, 1),
            };
            return;
          }
          break;
        }

        // Interpolation probe formula
        const fraction = (target - sorted[lo]) / (sorted[hi] - sorted[lo]);
        const pos = lo + Math.floor(fraction * (hi - lo));
        const value = sorted[pos];
        const discarded = [
          ...Array.from({ length: lo }, (_, k) => k),
          ...Array.from({ length: sorted.length - 1 - hi }, (_, k) => hi + 1 + k),
        ];

        yield {
          arr: sorted,
          target,
          lo,
          hi,
          mid: pos,
          current: pos,
          found: -1,
          range: [lo, hi],
          discarded,
          pointers: { lo, probe: pos, hi },
          reason: `Interpolated probe at index ${pos} (arr[${pos}]=${value}). Gradient estimate: ${(fraction * 100).toFixed(0)}% across [${lo}..${hi}]`,
          action: 'probe',
          line: 2,
          metrics: delta(1, 0, 2),
        };

        if (value === target) {
          yield {
            arr: sorted,
            target,
            lo,
            hi,
            mid: pos,
            current: pos,
            found: pos,
            range: [lo, hi],
            discarded,
            pointers: { found: pos },
            reason: `Target ${target} found at probe position ${pos}!`,
            action: 'found',
            done: true,
            line: 3,
            metrics: delta(0, 0, 0),
          };
          return;
        }

        if (value < target) {
          yield {
            arr: sorted,
            target,
            lo,
            hi,
            mid: pos,
            found: -1,
            range: [lo, hi],
            discarded,
            pointers: { lo, probe: pos, hi },
            reason: `Probe value ${value} < ${target}: target is in upper interval [${pos + 1}..${hi}]`,
            action: 'narrow',
            line: 4,
            metrics: delta(0, 0, 0),
          };
          lo = pos + 1;
        } else {
          yield {
            arr: sorted,
            target,
            lo,
            hi,
            mid: pos,
            found: -1,
            range: [lo, hi],
            discarded,
            pointers: { lo, probe: pos, hi },
            reason: `Probe value ${value} > ${target}: target is in lower interval [${lo}..${pos - 1}]`,
            action: 'narrow',
            line: 5,
            metrics: delta(0, 0, 0),
          };
          hi = pos - 1;
        }
      }

      yield {
        arr: sorted,
        target,
        lo: -1,
        hi: -1,
        mid: -1,
        found: -2,
        discarded: sorted.map((_, i) => i),
        reason: `Target ${target} is outside bounds or not found.`,
        action: 'not_found',
        done: true,
        line: 5,
        metrics: delta(1, 0, 0),
      };
    },
  },

  exponential: {
    name: 'Exponential Search',
    category: 'Range Bounding',
    stability: true,
    inPlace: true,
    description:
      'Finds the range where the target resides by repeated doubling of indices (1, 2, 4, 8, ...), then performs a binary search within that bounded range.',
    whenToUse:
      'Unbounded or infinite arrays where the size is unknown beforehand, or when searching for targets located near the beginning of the list.',
    complexity: { best: 'O(1)', avg: 'O(log i)', worst: 'O(log n)', space: 'O(1)' },
    pseudo: [
      '<span class="pseudo-kw">if</span> arr[0] == target: <span class="pseudo-kw">return</span> 0',
      'i = 1',
      '<span class="pseudo-kw">while</span> i < n <span class="pseudo-kw">and</span> arr[i] <= target: i *= 2',
      '<span class="pseudo-kw">return</span> binarySearch(arr, i/2, min(i, n-1), target)',
    ],
    *generator(arr: number[], target: number): Generator<SearchStep> {
      const sorted = [...arr].sort((a, b) => a - b);
      const n = sorted.length;

      if (sorted[0] === target) {
        yield {
          arr: sorted,
          target,
          current: 0,
          found: 0,
          pointers: { found: 0 },
          reason: `Target ${target} found at initial index 0!`,
          action: 'found',
          done: true,
          line: 0,
          metrics: delta(1, 0, 1),
        };
        return;
      }

      let i = 1;
      while (i < n && sorted[i] <= target) {
        yield {
          arr: sorted,
          target,
          current: i,
          found: -1,
          pointers: { bound: i },
          range: [Math.floor(i / 2), Math.min(i, n - 1)],
          reason: `Exponential leap: checking index ${i} (arr[${i}]=${sorted[i]} <= ${target}). Doubling step to ${i * 2}.`,
          action: 'jump',
          line: 2,
          metrics: delta(1, 0, 1),
        };
        i *= 2;
      }

      const lo = Math.floor(i / 2);
      const hi = Math.min(i, n - 1);

      yield {
        arr: sorted,
        target,
        range: [lo, hi],
        pointers: { lo, hi },
        reason: `Target bounded in window [${lo}..${hi}]. Commencing binary search within window.`,
        action: 'narrow',
        found: -1,
        line: 3,
        metrics: delta(0, 0, 0),
      };

      // Binary Search Phase within bounded window
      let bLo = lo, bHi = hi;
      while (bLo <= bHi) {
        const mid = Math.floor((bLo + bHi) / 2);
        const val = sorted[mid];

        yield {
          arr: sorted,
          target,
          lo: bLo,
          hi: bHi,
          mid,
          current: mid,
          found: -1,
          range: [bLo, bHi],
          pointers: { lo: bLo, mid, hi: bHi },
          reason: `Window [${bLo}..${bHi}]: probing mid arr[${mid}]=${val}`,
          action: 'probe',
          line: 3,
          metrics: delta(1, 0, 1),
        };

        if (val === target) {
          yield {
            arr: sorted,
            target,
            lo: bLo,
            hi: bHi,
            mid,
            current: mid,
            found: mid,
            pointers: { found: mid },
            reason: `Target ${target} found at index ${mid}!`,
            action: 'found',
            done: true,
            line: 3,
            metrics: delta(0, 0, 0),
          };
          return;
        }

        if (val < target) {
          bLo = mid + 1;
        } else {
          bHi = mid - 1;
        }
      }

      yield {
        arr: sorted,
        target,
        found: -2,
        discarded: sorted.map((_, idx) => idx),
        reason: `Target ${target} not found within bounded window.`,
        action: 'not_found',
        done: true,
        line: 3,
        metrics: delta(0, 0, 0),
      };
    },
  },
};
