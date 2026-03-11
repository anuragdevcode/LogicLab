'use strict';

window.BSTEngine = (() => {
  const INFO = {
    complexity: { insert: 'O(log n)', delete: 'O(log n)', search: 'O(log n)', space: 'O(n)', worst: 'O(n)' },
    pseudo: [
      '<span class="pseudo-fn">insert</span>(val):',
      '  <span class="pseudo-kw">if</span> root == null: root = Node(val)',
      '  <span class="pseudo-kw">elif</span> val < node.val: go left',
      '  <span class="pseudo-kw">elif</span> val > node.val: go right',
      '  <span class="pseudo-kw">else</span>: duplicate — skip',
      '<span class="pseudo-fn">inorder</span>: left → root → right',
    ]
  };

  class Node {
    constructor(val) { this.val = val; this.left = null; this.right = null; }
  }

  class BST {
    constructor() { this.root = null; }
    insert(val) {
      const node = new Node(val);
      if (!this.root) { this.root = node; return; }
      let cur = this.root;
      while (true) {
        if (val < cur.val) {
          if (!cur.left) { cur.left = node; break; }
          cur = cur.left;
        } else if (val > cur.val) {
          if (!cur.right) { cur.right = node; break; }
          cur = cur.right;
        } else break;
      }
    }
    remove(val) {
      this.root = this._remove(this.root, val);
    }
    _remove(node, val) {
      if (!node) return null;
      if (val < node.val) { node.left = this._remove(node.left, val); }
      else if (val > node.val) { node.right = this._remove(node.right, val); }
      else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        let min = node.right;
        while (min.left) min = min.left;
        node.val = min.val;
        node.right = this._remove(node.right, min.val);
      }
      return node;
    }
    toLayout(w, h) {
      const items = [];
      function calc(node, depth, lo, hi) {
        if (!node) return;
        const x = ((lo + hi) / 2) * w;
        const y = 50 + depth * 70;
        // Draw edge to parent first (edge items)
        if (node._parentX !== undefined) {
          items.push({ edge: true, from: [node._parentX, node._parentY], to: [x, y] });
        }
        items.push({ edge: false, val: node.val, x, y });
        if (node.left) {
          node.left._parentX = x; node.left._parentY = y;
          calc(node.left, depth + 1, lo, (lo + hi) / 2);
        }
        if (node.right) {
          node.right._parentX = x; node.right._parentY = y;
          calc(node.right, depth + 1, (lo + hi) / 2, hi);
        }
      }
      if (this.root) calc(this.root, 0, 0, 1);
      return items;
    }
  }

  return { INFO, BST };
})();
