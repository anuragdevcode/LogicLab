'use strict';

window.StackEngine = (() => {
  const INFO = {
    stack: {
      name: 'Stack (LIFO)',
      complexity: { push: 'O(1)', pop: 'O(1)', peek: 'O(1)', space: 'O(n)' },
      pseudo: [
        '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Stack</span>:',
        '  <span class="pseudo-fn">push</span>(val): top++; arr[top] = val',
        '  <span class="pseudo-fn">pop</span>():  val = arr[top]; top--; return val',
        '  <span class="pseudo-fn">peek</span>(): return arr[top]',
        '  <span class="pseudo-cmt">// LIFO — Last In, First Out</span>',
      ]
    },
    queue: {
      name: 'Queue (FIFO)',
      complexity: { enqueue: 'O(1)', dequeue: 'O(1)', front: 'O(1)', space: 'O(n)' },
      pseudo: [
        '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Queue</span>:',
        '  <span class="pseudo-fn">enqueue</span>(val): rear++; arr[rear] = val',
        '  <span class="pseudo-fn">dequeue</span>(): val = arr[front]; front++; return val',
        '  <span class="pseudo-fn">front</span>(): return arr[front]',
        '  <span class="pseudo-cmt">// FIFO — First In, First Out</span>',
      ]
    }
  };
  return { INFO };
})();
