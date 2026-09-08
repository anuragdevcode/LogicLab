import { DataStructureInfo } from '@/types';

export const STACK_CAPACITY = 8;

export const STACK_INFO: DataStructureInfo = {
  name: 'Stack (LIFO)',
  category: 'Linear Data Structure',
  description:
    'Sequential collection constrained by the Last-In-First-Out (LIFO) discipline. All insertions (push) and deletions (pop) occur exclusively at one end designated as the TOP pointer.',
  whenToUse:
    'Function call recursion management, arithmetic expression evaluation & parenthesis matching, undo/redo state histories, depth-first search (DFS), and monotonic stack range queries.',
  constraints: [
    'Capacity: Max 8 slots (indices [0]..[7])',
    'Discipline: Last-In, First-Out (LIFO) at TOP',
    'Overflow Guard: Rejected when size == 8 (top == 7)',
    'Underflow Guard: Rejected when size == 0 (top == -1)',
    'Time Complexity: Strict O(1) for push, pop, peek',
    'Values Domain: Integers [0 .. 999]',
  ],
  complexity: {
    push: 'O(1)',
    pop: 'O(1)',
    peek: 'O(1)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">Stack</span>:',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">push</span>(val):',
    '    <span class="pseudo-kw">if</span> top >= capacity - 1: <span class="pseudo-kw">throw</span> <span class="pseudo-str">"Overflow"</span>',
    '    top = top + 1; arr[top] = val',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">pop</span>():',
    '    <span class="pseudo-kw">if</span> top == -1: <span class="pseudo-kw">throw</span> <span class="pseudo-str">"Underflow"</span>',
    '    val = arr[top]; top = top - 1; <span class="pseudo-kw">return</span> val',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">peek</span>():',
    '    <span class="pseudo-kw">return</span> arr[top] <span class="pseudo-kw">if</span> top != -1 <span class="pseudo-kw">else</span> <span class="pseudo-num">null</span>',
  ],
};

export const QUEUE_INFO: DataStructureInfo = {
  name: 'Queue (FIFO)',
  category: 'Linear Data Structure',
  description:
    'Sequential collection operating under the First-In-First-Out (FIFO) discipline. Elements enter at the REAR pointer (enqueue) and exit at the FRONT pointer (dequeue). In a linear array without shifting, false overflow can occur when rear reaches the end.',
  whenToUse:
    'Breadth-First Search (BFS) level-order traversals, asynchronous event loops, CPU task scheduling, print job buffering, and rate-limiting sliding windows.',
  constraints: [
    'Capacity: Max 8 slots (indices [0]..[7])',
    'Discipline: First-In, First-Out (FIFO)',
    'Linear Array Constraint: rear < 8 (false overflow if front > 0)',
    'Underflow Guard: Rejected when empty (front == -1)',
    'Time Complexity: O(1) without shifting',
    'Values Domain: Integers [0 .. 999]',
  ],
  complexity: {
    enqueue: 'O(1)',
    dequeue: 'O(1)',
    front: 'O(1)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">LinearQueue</span>:',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">enqueue</span>(val):',
    '    <span class="pseudo-kw">if</span> rear >= capacity - 1: <span class="pseudo-kw">throw</span> <span class="pseudo-str">"Overflow"</span>',
    '    <span class="pseudo-kw">if</span> front == -1: front = 0',
    '    rear = rear + 1; arr[rear] = val',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">dequeue</span>():',
    '    <span class="pseudo-kw">if</span> front == -1 <span class="pseudo-kw">or</span> front > rear: <span class="pseudo-kw">throw</span> <span class="pseudo-str">"Underflow"</span>',
    '    val = arr[front]; front = front + 1; <span class="pseudo-kw">return</span> val',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">front</span>():',
    '    <span class="pseudo-kw">return</span> arr[front]',
  ],
};

export const CIRCULAR_QUEUE_INFO: DataStructureInfo = {
  name: 'Circular Queue (Ring Buffer)',
  category: 'Ring Buffer Data Structure',
  description:
    'A circular queue connects the last position back to the first position using modular arithmetic (rear + 1) % capacity. It solves the memory wastage of linear queues by reusing dequeued memory slots at the front.',
  whenToUse:
    'Hardware audio/video streaming ring buffers, real-time traffic signal controllers, fixed-memory OS networking packet queues, producer-consumer ring queues.',
  constraints: [
    'Capacity: Fixed 8 slots ring buffer',
    'Index Modulo Wrapping: (rear + 1) % 8, (front + 1) % 8',
    'Overflow Invariant: (rear + 1) % 8 == front (count == 8)',
    'Underflow Invariant: front == -1 or count == 0',
    'Memory Efficiency: 100% reusable memory without reallocation',
    'Time Complexity: Strict O(1) for all operations',
  ],
  complexity: {
    enqueue: 'O(1)',
    dequeue: 'O(1)',
    front: 'O(1)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">CircularQueue</span>:',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">enqueue</span>(val):',
    '    <span class="pseudo-kw">if</span> (rear + 1) % capacity == front: <span class="pseudo-kw">throw</span> <span class="pseudo-str">"Overflow"</span>',
    '    <span class="pseudo-kw">if</span> front == -1: front = 0',
    '    rear = (rear + 1) % capacity; arr[rear] = val',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">dequeue</span>():',
    '    <span class="pseudo-kw">if</span> front == -1: <span class="pseudo-kw">throw</span> <span class="pseudo-str">"Underflow"</span>',
    '    val = arr[front]',
    '    <span class="pseudo-kw">if</span> front == rear: front = -1; rear = -1',
    '    <span class="pseudo-kw">else</span>: front = (front + 1) % capacity',
    '    <span class="pseudo-kw">return</span> val',
  ],
};

export const MIN_STACK_INFO: DataStructureInfo = {
  name: 'Min Stack (O(1) Min)',
  category: 'Augmented LIFO Data Structure',
  description:
    'Maintains an auxiliary min-tracker stack in lockstep with the primary stack. Every push pairs the element with the running minimum at that depth, enabling getMin() in strictly constant O(1) time without inspecting the whole stack.',
  whenToUse:
    'Constant-time minimum queries in stream processing, sliding window minimum tracking, interview canonical problem for space-time tradeoff optimization.',
  constraints: [
    'Capacity: Max 8 slots parallel dual-stack',
    'Auxiliary Space: O(n) prefix min tracking stack',
    'getMin() Time Bound: O(1) constant time without scan',
    'Monotonic Invariant: minStack[i] = min(val, minStack[i-1])',
    'Overflow/Underflow: Bound guards active in lockstep',
  ],
  complexity: {
    push: 'O(1)',
    pop: 'O(1)',
    peek: 'O(1)',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-kw">class</span> <span class="pseudo-fn">MinStack</span>:',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">push</span>(val):',
    '    stack.push(val)',
    '    newMin = min(val, minStack.top()) <span class="pseudo-kw">if</span> minStack <span class="pseudo-kw">else</span> val',
    '    minStack.push(newMin)',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">pop</span>():',
    '    minStack.pop(); <span class="pseudo-kw">return</span> stack.pop()',
    '  <span class="pseudo-kw">def</span> <span class="pseudo-fn">getMin</span>():',
    '    <span class="pseudo-kw">return</span> minStack.top()',
  ],
};

export const STACK_DATA_STRUCTURES: Record<string, DataStructureInfo> = {
  stack: STACK_INFO,
  queue: QUEUE_INFO,
  circular_queue: CIRCULAR_QUEUE_INFO,
  min_stack: MIN_STACK_INFO,
};
