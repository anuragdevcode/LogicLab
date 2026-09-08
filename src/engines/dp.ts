import { AlgorithmMeta, DPStep, MetricsDelta } from '@/types';

const delta = (comparisons = 0, swaps = 0, accesses = 0): MetricsDelta => ({ comparisons, swaps, accesses });

export const DP_ALGORITHMS: Record<string, AlgorithmMeta<DPStep>> = {
  lcs: {
    name: 'Longest Common Subsequence',
    complexity: { time: 'O(m×n)', space: 'O(m×n)', best: 'O(m×n)', worst: 'O(m×n)' },
    pseudo: [
      '<span class="pseudo-fn">LCS</span>(s1, s2):',
      '  build a table with one extra empty row and column',
      '  <span class="pseudo-kw">if</span> characters match: diagonal + 1',
      '  <span class="pseudo-kw">else</span>: max(top, left)',
      '  answer is the bottom-right cell',
    ],
    *generator(s1: string, s2: string): Generator<DPStep> {
      const m = s1.length, n = s2.length;
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const a = s1[i - 1];
          const b = s2[j - 1];

          if (a === b) {
            const diag = dp[i - 1][j - 1];
            dp[i][j] = diag + 1;
            yield {
              dp: dp.map(r => [...r]),
              active: [i, j],
              s1,
              s2,
              match: true,
              explain: `${a} = ${b}: diagonal ${diag} + 1 -> ${dp[i][j]}`,
              line: 2,
              metrics: delta(1, 0, 2),
            };
          } else {
            const top = dp[i - 1][j];
            const left = dp[i][j - 1];
            dp[i][j] = Math.max(top, left);
            yield {
              dp: dp.map(r => [...r]),
              active: [i, j],
              s1,
              s2,
              match: false,
              explain: `${a} != ${b}: max(top ${top}, left ${left}) -> ${dp[i][j]}`,
              line: 3,
              metrics: delta(1, 0, 3),
            };
          }
        }
      }

      yield { dp: dp.map(r => [...r]), active: null, s1, s2, done: true, result: dp[m][n], line: 4, match: false, explain: '' };
    }
  },

  knapsack: {
    name: '0/1 Knapsack',
    complexity: { time: 'O(n×W)', space: 'O(n×W)', best: 'O(n×W)', worst: 'O(n×W)' },
    pseudo: [
      '<span class="pseudo-fn">Knapsack</span>(items, capacity):',
      '  row i means first i items are allowed',
      '  column w means current capacity is w',
      '  <span class="pseudo-kw">if</span> item fits: max(skip, take)',
      '  <span class="pseudo-kw">else</span>: copy value from row above',
    ],
    *generator(items: { w: number; v: number }[], W: number): Generator<DPStep> {
      const n = items.length;
      const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

      for (let i = 1; i <= n; i++) {
        const { w: wt, v: val } = items[i - 1];
        for (let cap = 0; cap <= W; cap++) {
          if (wt <= cap) {
            const skip = dp[i - 1][cap];
            const take = dp[i - 1][cap - wt] + val;
            dp[i][cap] = Math.max(skip, take);
            yield {
              dp: dp.map(r => [...r]),
              active: [i, cap],
              items,
              W,
              match: true,
              explain: `Item ${i} fits: max(skip ${skip}, take ${take}) -> ${dp[i][cap]}`,
              line: 3,
              metrics: delta(1, 0, 3),
            };
          } else {
            const copied = dp[i - 1][cap];
            dp[i][cap] = copied;
            yield {
              dp: dp.map(r => [...r]),
              active: [i, cap],
              items,
              W,
              match: false,
              explain: `Item ${i} is too heavy for capacity ${cap}: copy ${copied}`,
              line: 4,
              metrics: delta(1, 0, 2),
            };
          }
        }
      }

      yield { dp: dp.map(r => [...r]), active: null, items, W, done: true, result: dp[n][W], line: 4, match: false, explain: '' };
    }
  }
};
