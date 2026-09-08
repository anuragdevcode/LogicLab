import { DataStructureInfo } from '@/types';

export const LINKED_LIST_INFO: DataStructureInfo = {
  name: 'Singly Linked List',
  category: 'Linear Pointer Structure',
  description:
    'Sequential linear collection of nodes where each node stores a data value and a pointer reference to the next contiguous node in the chain.',
  whenToUse:
    'Constant time O(1) head insertion/removal, dynamic memory allocation where collection size varies widely, building blocks for stacks and queues.',
  constraints: [
    'Structure: Singly linked unidirectional pointer (data | next)',
    'Random Access: Not supported (O(n) sequential traversal required)',
    'Capacity: Max 10 nodes for horizontal visual layout',
    'Memory Overhead: Extra reference pointer per data payload',
  ],
  complexity: {
    insert_head: 'O(1)',
    insert_tail: 'O(n)',
    delete: 'O(n)',
    search: 'O(n)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Node</span>: val, next = null',
    '<span class="pseudo-fn">insertHead</span>(val):',
    '  node = new Node(val)',
    '  node.next = head; head = node',
    '<span class="pseudo-fn">delete</span>(val):',
    '  traverse until node.next.val == val',
    '  node.next = node.next.next',
  ],
};
