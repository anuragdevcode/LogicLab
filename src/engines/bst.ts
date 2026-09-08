import { TreeLayoutItem, DataStructureInfo, BSTMode } from '@/types';

export const BST_CAPACITY = 15;

export const BST_OPERATIONS_INFO: DataStructureInfo = {
  name: 'Binary Search Tree Operations',
  category: 'Hierarchical Tree Structure',
  description:
    'Node-based hierarchical binary tree data structure where each node satisfies the BST ordering invariant: all keys in the left subtree are smaller than the node, and all keys in the right subtree are larger.',
  whenToUse:
    'Dynamic set membership testing, ordered traversal (in-order produces sorted sequence), associative lookup tables with frequent insertions and deletions in O(log n) average time.',
  constraints: [
    `Capacity: Maximum ${BST_CAPACITY} nodes (depth <= 4) for clean canvas visibility`,
    'BST Invariant: Left subtree keys < Node key < Right subtree keys',
    'Unique Keys: Duplicate keys are not permitted in a standard BST',
    'Degenerate Risk: Unbalanced insertions degrade search/insert time from O(log n) to O(n)',
    'Domain: Positive integers from 0 to 999',
  ],
  complexity: {
    search: 'O(log n) avg / O(n) worst',
    insert: 'O(log n) avg / O(n) worst',
    delete: 'O(log n) avg / O(n) worst',
    find_min: 'O(log n) avg / O(n) worst',
    find_max: 'O(log n) avg / O(n) worst',
    space: 'O(n)',
  },
  pseudo: [
    '<span class="pseudo-fn">search</span>(val):',
    '  curr = root',
    '  while curr != null:',
    '    if val == curr.val: return FOUND',
    '    elif val < curr.val: curr = curr.left',
    '    else: curr = curr.right',
    '  return NOT_FOUND',
    '<span class="pseudo-fn">insert</span>(val):',
    '  if root == null: root = Node(val); return',
    '  traverse until appropriate vacant child; attach Node(val)',
  ],
};

export const BST_INORDER_INFO: DataStructureInfo = {
  name: 'In-Order Traversal (L → Root → R)',
  category: 'Tree Traversal Algorithm',
  description:
    'Depth-first traversal recursively visiting the Left subtree, then the Root node, then the Right subtree. On any valid BST, in-order traversal yields elements in strictly ascending sorted order.',
  whenToUse:
    'Extracting sorted elements from a BST without sorting algorithms, verifying tree BST invariant properties, in-order predecessor/successor queries.',
  constraints: [
    'Order: Left subtree → Current Root → Right subtree',
    'Mathematical Invariant: Monotonically increasing key sequence',
    'Time Complexity: Strict O(n) visiting each node exactly once',
    'Call Stack Depth: O(h) auxiliary memory',
  ],
  complexity: {
    time: 'O(n)',
    space: 'O(h) stack depth',
    output: 'Sorted Ascending',
  },
  pseudo: [
    '<span class="pseudo-fn">inorder</span>(node):',
    '  if node == null: return',
    '  inorder(node.left)',
    '  visit(node.val)  <span class="pseudo-comm">// Root processed between subtrees</span>',
    '  inorder(node.right)',
  ],
};

export const BST_PREORDER_INFO: DataStructureInfo = {
  name: 'Pre-Order Traversal (Root → L → R)',
  category: 'Tree Traversal Algorithm',
  description:
    'Depth-first traversal that inspects the Root node first, followed recursively by the Left subtree, then the Right subtree. Root-first inspection preserves the hierarchy.',
  whenToUse:
    'Creating exact deep copies of trees, serializing tree topologies to disk/network, expression tree prefix evaluation.',
  constraints: [
    'Order: Current Root → Left subtree → Right subtree',
    'Topological Invariant: Parent is always visited before any of its children',
    'Time Complexity: Strict O(n) visiting each node exactly once',
    'Call Stack Depth: O(h) auxiliary memory',
  ],
  complexity: {
    time: 'O(n)',
    space: 'O(h) stack depth',
    output: 'Prefix Hierarchy',
  },
  pseudo: [
    '<span class="pseudo-fn">preorder</span>(node):',
    '  if node == null: return',
    '  visit(node.val)  <span class="pseudo-comm">// Root processed first</span>',
    '  preorder(node.left)',
    '  preorder(node.right)',
  ],
};

export const BST_POSTORDER_INFO: DataStructureInfo = {
  name: 'Post-Order Traversal (L → R → Root)',
  category: 'Tree Traversal Algorithm',
  description:
    'Depth-first traversal that recursively processes both the Left and Right subtrees completely before inspecting the Root node itself. Children are guaranteed to be visited before their parents.',
  whenToUse:
    'Bottom-up tree evaluation (e.g. subtree size or height calculation), directory file size computation, safe post-order deletion of nodes.',
  constraints: [
    'Order: Left subtree → Right subtree → Current Root',
    'Bottom-Up Invariant: All descendants are processed prior to their ancestor',
    'Time Complexity: Strict O(n) visiting each node exactly once',
    'Call Stack Depth: O(h) auxiliary memory',
  ],
  complexity: {
    time: 'O(n)',
    space: 'O(h) stack depth',
    output: 'Postfix / Bottom-up',
  },
  pseudo: [
    '<span class="pseudo-fn">postorder</span>(node):',
    '  if node == null: return',
    '  postorder(node.left)',
    '  postorder(node.right)',
    '  visit(node.val)  <span class="pseudo-comm">// Root processed after children</span>',
  ],
};

export const BST_LEVELORDER_INFO: DataStructureInfo = {
  name: 'Level-Order Traversal (BFS)',
  category: 'Tree Traversal Algorithm',
  description:
    'Breadth-first traversal exploring the tree level-by-level from top to bottom, left-to-right, using an auxiliary FIFO queue to manage unvisited children.',
  whenToUse:
    'Finding shortest distance in unweighted trees, level-by-level serialization, finding node depth or level width.',
  constraints: [
    'Discipline: Breadth-First Search (FIFO Queue)',
    'Order: Level 0 (Root) → Level 1 → Level 2 → ...',
    'Queue Memory: Up to O(w) where w is maximum tree width (w <= 2^(h-1))',
  ],
  complexity: {
    time: 'O(n)',
    space: 'O(w) queue capacity',
    output: 'Breadth-first Levels',
  },
  pseudo: [
    '<span class="pseudo-fn">levelOrder</span>(root):',
    '  if root == null: return',
    '  q = new Queue(); q.enqueue(root)',
    '  while not q.isEmpty():',
    '    curr = q.dequeue()',
    '    visit(curr.val)',
    '    if curr.left: q.enqueue(curr.left)',
    '    if curr.right: q.enqueue(curr.right)',
  ],
};

export const BST_INFOS: Record<BSTMode, DataStructureInfo> = {
  bst: BST_OPERATIONS_INFO,
  inorder: BST_INORDER_INFO,
  preorder: BST_PREORDER_INFO,
  postorder: BST_POSTORDER_INFO,
  levelorder: BST_LEVELORDER_INFO,
};

export const BST_INFO = BST_OPERATIONS_INFO;

export class Node {
  val: number;
  left: Node | null;
  right: Node | null;
  _parentX?: number;
  _parentY?: number;

  constructor(val: number) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

export class BST {
  root: Node | null;

  constructor() {
    this.root = null;
  }

  insert(val: number): { success: boolean; reason?: string } {
    const node = new Node(val);
    if (!this.root) {
      this.root = node;
      return { success: true };
    }

    let cur = this.root;
    while (true) {
      if (val === cur.val) {
        return { success: false, reason: 'duplicate' };
      }
      if (val < cur.val) {
        if (!cur.left) {
          cur.left = node;
          return { success: true };
        }
        cur = cur.left;
      } else {
        if (!cur.right) {
          cur.right = node;
          return { success: true };
        }
        cur = cur.right;
      }
    }
  }

  remove(val: number): boolean {
    let found = false;
    const removeNode = (node: Node | null, target: number): Node | null => {
      if (!node) return null;
      if (target < node.val) {
        node.left = removeNode(node.left, target);
      } else if (target > node.val) {
        node.right = removeNode(node.right, target);
      } else {
        found = true;
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let min = node.right;
        while (min.left) min = min.left;
        node.val = min.val;
        node.right = removeNode(node.right, min.val);
      }
      return node;
    };

    this.root = removeNode(this.root, val);
    return found;
  }

  contains(val: number): boolean {
    let cur = this.root;
    while (cur) {
      if (val === cur.val) return true;
      cur = val < cur.val ? cur.left : cur.right;
    }
    return false;
  }

  searchPath(val: number): { path: number[]; found: boolean } {
    const path: number[] = [];
    let cur = this.root;
    while (cur) {
      path.push(cur.val);
      if (val === cur.val) {
        return { path, found: true };
      }
      cur = val < cur.val ? cur.left : cur.right;
    }
    return { path, found: false };
  }

  inorder(): number[] {
    const res: number[] = [];
    const traverse = (node: Node | null) => {
      if (!node) return;
      traverse(node.left);
      res.push(node.val);
      traverse(node.right);
    };
    traverse(this.root);
    return res;
  }

  preorder(): number[] {
    const res: number[] = [];
    const traverse = (node: Node | null) => {
      if (!node) return;
      res.push(node.val);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return res;
  }

  postorder(): number[] {
    const res: number[] = [];
    const traverse = (node: Node | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      res.push(node.val);
    };
    traverse(this.root);
    return res;
  }

  levelOrder(): number[] {
    const res: number[] = [];
    if (!this.root) return res;
    const q: Node[] = [this.root];
    while (q.length > 0) {
      const cur = q.shift()!;
      res.push(cur.val);
      if (cur.left) q.push(cur.left);
      if (cur.right) q.push(cur.right);
    }
    return res;
  }

  getMin(): number | null {
    if (!this.root) return null;
    let cur = this.root;
    while (cur.left) cur = cur.left;
    return cur.val;
  }

  getMax(): number | null {
    if (!this.root) return null;
    let cur = this.root;
    while (cur.right) cur = cur.right;
    return cur.val;
  }

  getHeight(node: Node | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  getNodeCount(node: Node | null = this.root): number {
    if (!node) return 0;
    return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
  }

  toLayout(w: number, h: number): TreeLayoutItem[] {
    const items: TreeLayoutItem[] = [];
    const maxDepth = this.getHeight();
    const depthSpacing = Math.min(75, Math.max(48, (h - 140) / Math.max(1, maxDepth)));
    const startY = 55;

    const calc = (node: Node | null, depth: number, lo: number, hi: number) => {
      if (!node) return;
      const x = ((lo + hi) / 2) * w;
      const y = startY + depth * depthSpacing;

      if (node._parentX !== undefined && node._parentY !== undefined) {
        items.push({ edge: true, from: [node._parentX, node._parentY], to: [x, y] });
      }

      items.push({ val: node.val, x, y } as TreeLayoutItem);

      if (node.left) {
        node.left._parentX = x;
        node.left._parentY = y;
        calc(node.left, depth + 1, lo, (lo + hi) / 2);
      }
      if (node.right) {
        node.right._parentX = x;
        node.right._parentY = y;
        calc(node.right, depth + 1, (lo + hi) / 2, hi);
      }
    };

    if (this.root) calc(this.root, 0, 0, 1);
    return items;
  }
}
