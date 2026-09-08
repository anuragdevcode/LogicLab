import { DataStructureInfo, LinkedListMode } from '@/types';

export const LINKED_LIST_CAPACITY = 8;

export const SINGLY_LL_INFO: DataStructureInfo = {
  name: 'Singly Linked List',
  category: 'Linear Dynamic Data Structure',
  description:
    'Linear sequence of nodes where each node stores a data value and a unidirectional pointer reference to the subsequent node, terminating at NULL.',
  whenToUse:
    'Frequent head insertions/removals in O(1) time without contiguous memory reallocation, underlying engine for stacks, simple linear streaming pipelines.',
  constraints: [
    `Capacity: Fixed visual limit of ${LINKED_LIST_CAPACITY} nodes for clean horizontal visibility`,
    'Pointers: Unidirectional next pointer only (no backwards navigation)',
    'Random Access: Not supported (O(n) sequential pointer traversal required)',
    'Value Domain: 0 to 999 positive integers',
    'Index Range: 0 to size bounds enforced',
  ],
  complexity: {
    insert_head: 'O(1)',
    insert_tail: 'O(n)',
    insert_at: 'O(n)',
    delete_head: 'O(1)',
    delete_val: 'O(n)',
    search: 'O(n)',
    reverse: 'O(n)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Node</span>: val, next = null',
    '<span class="pseudo-fn">insertHead</span>(val):',
    '  node = new Node(val)',
    '  node.next = head; head = node',
    '<span class="pseudo-fn">insertAt</span>(idx, val):',
    '  traverse to (idx - 1); node.next = curr.next; curr.next = node',
    '<span class="pseudo-fn">delete</span>(val):',
    '  traverse until curr.next.val == val',
    '  curr.next = curr.next.next',
    '<span class="pseudo-fn">reverse</span>():',
    '  prev = null; curr = head',
    '  while curr: next = curr.next; curr.next = prev; prev = curr; curr = next',
    '  head = prev',
  ],
};

export const DOUBLY_LL_INFO: DataStructureInfo = {
  name: 'Doubly Linked List',
  category: 'Bidirectional Dynamic Data Structure',
  description:
    'Linear sequence of nodes where each node contains data and two pointer references: one forward to next, and one backward to prev, enabling seamless bidirectional traversal.',
  whenToUse:
    'Applications requiring two-way navigation (undo/redo, browser history), constant time O(1) deletion given node pointer, O(1) insertions at both head and tail.',
  constraints: [
    `Capacity: Fixed visual limit of ${LINKED_LIST_CAPACITY} nodes for clean horizontal visibility`,
    'Pointers: Bidirectional prev and next pointers per node',
    'Memory Overhead: 2 pointer references per data payload',
    'Value Domain: 0 to 999 positive integers',
    'Index Range: 0 to size bounds enforced',
  ],
  complexity: {
    insert_head: 'O(1)',
    insert_tail: 'O(1)',
    insert_at: 'O(n)',
    delete_head: 'O(1)',
    delete_tail: 'O(1)',
    delete_node: 'O(1)',
    search: 'O(n)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Node</span>: val, prev = null, next = null',
    '<span class="pseudo-fn">insertHead</span>(val):',
    '  node = new Node(val)',
    '  node.next = head; if head: head.prev = node; head = node',
    '<span class="pseudo-fn">insertTail</span>(val):',
    '  node = new Node(val)',
    '  node.prev = tail; if tail: tail.next = node; tail = node',
    '<span class="pseudo-fn">deleteNode</span>(node):',
    '  node.prev.next = node.next',
    '  node.next.prev = node.prev',
  ],
};

export const CIRCULAR_LL_INFO: DataStructureInfo = {
  name: 'Circular Linked List',
  category: 'Closed Ring Dynamic Data Structure',
  description:
    'Linear linked structure where the last node links back to the head node instead of pointing to NULL, forming an unbroken continuous ring.',
  whenToUse:
    'Round-robin CPU task scheduling, continuous circular playback buffers, multiplayer turn sequence routing.',
  constraints: [
    `Capacity: Fixed visual limit of ${LINKED_LIST_CAPACITY} nodes for clean horizontal visibility`,
    'Ring Invariant: Tail.next == Head (never terminates with NULL)',
    'Loop Termination: Traversal requires termination check (curr == head)',
    'Value Domain: 0 to 999 positive integers',
    'Index Range: 0 to size bounds enforced',
  ],
  complexity: {
    insert_head: 'O(1)',
    insert_tail: 'O(1)',
    delete_head: 'O(1)',
    search: 'O(n)',
    cycle_check: 'O(1)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Node</span>: val, next = head',
    '<span class="pseudo-fn">insertHead</span>(val):',
    '  node = new Node(val)',
    '  node.next = head; tail.next = node; head = node',
    '<span class="pseudo-fn">insertTail</span>(val):',
    '  node = new Node(val)',
    '  node.next = head; tail.next = node; tail = node',
    '<span class="pseudo-fn">traverse</span>():',
    '  curr = head; do: visit(curr); curr = curr.next while curr != head',
  ],
};

export const LINKED_LIST_INFOS: Record<LinkedListMode, DataStructureInfo> = {
  singly: SINGLY_LL_INFO,
  doubly: DOUBLY_LL_INFO,
  circular: CIRCULAR_LL_INFO,
};

// Default export for backwards compatibility
export const LINKED_LIST_INFO = SINGLY_LL_INFO;
