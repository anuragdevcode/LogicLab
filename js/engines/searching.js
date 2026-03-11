'use strict';

window.SearchingEngine = (() => {
  const ALGORITHMS = {
    linear: {
      name: 'Linear Search',
      complexity: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
      pseudo: [
        '<span class="pseudo-kw">for</span> i = 0 <span class="pseudo-kw">to</span> n-1:',
        '  <span class="pseudo-kw">if</span> arr[i] == target:',
        '    <span class="pseudo-kw">return</span> i  <span class="pseudo-cmt">// found</span>',
        '<span class="pseudo-kw">return</span> -1  <span class="pseudo-cmt">// not found</span>',
      ],
      * gen(arr, target) {
        for (let i = 0; i < arr.length; i++) {
          yield { arr, current: i, found: -1, searched: Array.from({length:i},(_,k)=>k), line: 1 };
          if (arr[i] === target) {
            yield { arr, current: i, found: i, searched: [], line: 2 };
            return;
          }
        }
        yield { arr, current: -1, found: -1, searched: arr.map((_,i)=>i), line: 3 };
      }
    },
    binary: {
      name: 'Binary Search',
      complexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
      pseudo: [
        'lo = 0, hi = n-1',
        '<span class="pseudo-kw">while</span> lo <= hi:',
        '  mid = (lo + hi) / 2',
        '  <span class="pseudo-kw">if</span> arr[mid] == target: <span class="pseudo-kw">return</span> mid',
        '  <span class="pseudo-kw">elif</span> arr[mid] < target: lo = mid+1',
        '  <span class="pseudo-kw">else</span>: hi = mid-1',
        '<span class="pseudo-kw">return</span> -1',
      ],
      * gen(arr, target) {
        const sorted = [...arr].sort((a,b)=>a-b);
        let lo = 0, hi = sorted.length - 1;
        while (lo <= hi) {
          const mid = Math.floor((lo+hi)/2);
          yield { arr: sorted, lo, hi, mid, found: -1, line: 2 };
          if (sorted[mid] === target) {
            yield { arr: sorted, lo, hi, mid, found: mid, line: 3 };
            return;
          }
          if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1;
          yield { arr: sorted, lo, hi, mid, found: -1, line: sorted[mid] < target ? 4 : 5 };
        }
        yield { arr: sorted, lo: -1, hi: -1, mid: -1, found: -2, line: 6 };
      }
    }
  };
  return { ALGORITHMS };
})();
