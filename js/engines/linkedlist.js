'use strict';

window.LinkedListEngine = (() => {
  const INFO = {
    singly: {
      name: 'Singly Linked List',
      complexity: { insert_head: 'O(1)', insert_tail: 'O(n)', delete: 'O(n)', search: 'O(n)', space: 'O(n)' },
      pseudo: [
        '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Node</span>: val, next = null',
        '<span class="pseudo-fn">insertHead</span>(val):',
        '  node = new Node(val)',
        '  node.next = head; head = node',
        '<span class="pseudo-fn">delete</span>(val):',
        '  traverse until node.next.val == val',
        '  node.next = node.next.next',
      ]
    }
  };
  return { INFO };
})();
