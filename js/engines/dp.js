'use strict';

window.DPEngine = (() => {
  const ALGORITHMS = {
    lcs: {
      name: 'LCS',
      complexity: { time: 'O(m×n)', space: 'O(m×n)', best: 'O(m×n)', worst: 'O(m×n)' },
      pseudo: [
        '<span class="pseudo-fn">LCS</span>(s1, s2):',
        '  dp[i][j] = 0 if i==0 or j==0',
        '  <span class="pseudo-kw">if</span> s1[i-1] == s2[j-1]:',
        '    dp[i][j] = dp[i-1][j-1] + 1',
        '  <span class="pseudo-kw">else</span>:',
        '    dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
      ],
      * gen(s1, s2) {
        const m = s1.length, n = s2.length;
        const dp = Array.from({length:m+1}, () => new Array(n+1).fill(0));
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            yield { dp: dp.map(r=>[...r]), active: [i,j], s1, s2, line: 2 };
            if (s1[i-1] === s2[j-1]) {
              dp[i][j] = dp[i-1][j-1] + 1;
              yield { dp: dp.map(r=>[...r]), active: [i,j], s1, s2, match: true, line: 3 };
            } else {
              dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
              yield { dp: dp.map(r=>[...r]), active: [i,j], s1, s2, match: false, line: 5 };
            }
          }
        }
        yield { dp: dp.map(r=>[...r]), active: null, s1, s2, done: true, result: dp[m][n], line: -1 };
      }
    },
    knapsack: {
      name: 'Knapsack',
      complexity: { time: 'O(n×W)', space: 'O(n×W)', best: 'O(n×W)', worst: 'O(n×W)' },
      pseudo: [
        '<span class="pseudo-fn">Knapsack</span>(weights, values, W):',
        '  dp[0][w] = 0 for all w',
        '  <span class="pseudo-kw">for</span> i = 1 <span class="pseudo-kw">to</span> n:',
        '    <span class="pseudo-kw">for</span> w = 0 <span class="pseudo-kw">to</span> W:',
        '      <span class="pseudo-kw">if</span> weights[i] <= w:',
        '        dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt]+val)',
        '      <span class="pseudo-kw">else</span>: dp[i][w] = dp[i-1][w]',
      ],
      * gen(items, W) {
        const n = items.length;
        const dp = Array.from({length:n+1}, () => new Array(W+1).fill(0));
        for (let i = 1; i <= n; i++) {
          const {w: wt, v: val} = items[i-1];
          for (let w = 0; w <= W; w++) {
            yield { dp: dp.map(r=>[...r]), active: [i,w], items, W, line: 4 };
            if (wt <= w) {
              dp[i][w] = Math.max(dp[i-1][w], dp[i-1][w-wt] + val);
              yield { dp: dp.map(r=>[...r]), active: [i,w], items, W, match: true, line: 5 };
            } else {
              dp[i][w] = dp[i-1][w];
              yield { dp: dp.map(r=>[...r]), active: [i,w], items, W, match: false, line: 6 };
            }
          }
        }
        yield { dp: dp.map(r=>[...r]), active: null, items, W, done: true, result: dp[n][W], line: -1 };
      }
    }
  };
  return { ALGORITHMS };
})();
