'use strict';

// ─── App State ────────────────────────────────────────────────
const App = {
  module: 'sorting',
  algo: 'bubble',
  arr: [],
  target: 42,
  steps: [],
  stepIdx: 0,
  playing: false,
  timer: null,
  metrics: { comparisons: 0, swaps: 0, accesses: 0 },
  bst: null,
  heap: null,
  heapType: 'min',
  stackData: [],
  queueData: [],
  llData: [],
  graphAlgo: 'bfs',
  graphState: null,
  dpAlgo: 'lcs',
  dpState: null,
};

// ─── DOM refs ─────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const domLayer = document.getElementById('dom-layer');
const algoTabs = document.getElementById('algo-tabs');
const moduleTitle = document.getElementById('module-title');
const complexityBadge = document.getElementById('complexity-badge');
const pseudocodeBox = document.getElementById('pseudocode-box');
const complexityTable = document.getElementById('complexity-table');
const mComparisons = document.getElementById('m-comparisons');
const mSwaps = document.getElementById('m-swaps');
const mAccesses = document.getElementById('m-accesses');
const mStatus = document.getElementById('m-status');
const speedSlider = document.getElementById('speed-slider');

// ─── Resize canvas ────────────────────────────────────────────
function resizeCanvas() {
  const rect = document.getElementById('viz-area').getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  redraw();
}

window.addEventListener('resize', resizeCanvas);

// ─── Module setup ─────────────────────────────────────────────
const MODULE_CONFIG = {
  sorting: {
    title: 'Sorting Algorithms',
    algos: Object.keys(SortingEngine.ALGORITHMS),
    algoName: k => SortingEngine.ALGORITHMS[k].name,
  },
  searching: {
    title: 'Searching Algorithms',
    algos: Object.keys(SearchingEngine.ALGORITHMS),
    algoName: k => SearchingEngine.ALGORITHMS[k].name,
  },
  stack: {
    title: 'Stack & Queue',
    algos: ['stack', 'queue'],
    algoName: k => k === 'stack' ? 'Stack (LIFO)' : 'Queue (FIFO)',
  },
  linkedlist: {
    title: 'Linked List',
    algos: ['singly'],
    algoName: () => 'Singly Linked List',
  },
  bst: {
    title: 'Binary Search Tree',
    algos: ['bst'],
    algoName: () => 'BST',
  },
  heap: {
    title: 'Heap / Priority Queue',
    algos: ['minheap', 'maxheap'],
    algoName: k => k === 'minheap' ? 'Min Heap' : 'Max Heap',
  },
  graph: {
    title: 'Graph Traversal',
    algos: ['bfs', 'dfs', 'dijkstra'],
    algoName: k => GraphEngine.INFO[k].name,
  },
  dp: {
    title: 'Dynamic Programming',
    algos: ['lcs', 'knapsack'],
    algoName: k => DPEngine.ALGORITHMS[k].name,
  },
};

// ─── Switch module ────────────────────────────────────────────
function switchModule(mod) {
  App.module = mod;
  stopPlay();
  const cfg = MODULE_CONFIG[mod];
  moduleTitle.textContent = cfg.title;

  // nav highlight
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.module === mod);
  });

  // build algo tabs
  algoTabs.innerHTML = '';
  cfg.algos.forEach((k, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = cfg.algoName(k);
    btn.dataset.algo = k;
    btn.addEventListener('click', () => switchAlgo(k));
    algoTabs.appendChild(btn);
  });

  App.algo = cfg.algos[0];
  initModule();
}

function switchAlgo(algo) {
  App.algo = algo;
  stopPlay();
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.algo === algo);
  });
  initModule();
}

// ─── Init each module ─────────────────────────────────────────
function initModule() {
  const m = App.module;
  resetMetrics();
  clearDOM();
  Renderer.clear(ctx, canvas.width, canvas.height);
  hidePlayControls(false);

  if (m === 'sorting') {
    generateArray();
    loadInfo(SortingEngine.ALGORITHMS[App.algo]);
  } else if (m === 'searching') {
    generateArray(true);
    loadInfo(SearchingEngine.ALGORITHMS[App.algo]);
  } else if (m === 'stack') {
    hidePlayControls(true);
    // Reset data each time algo switches (stack vs queue are different)
    if (App.algo === 'stack') App.stackData = [];
    else App.queueData = [];
    loadInfo(StackEngine.INFO[App.algo]);
    renderStack();
  } else if (m === 'linkedlist') {
    hidePlayControls(true);
    App.llData = [];  // reset so defaults are seeded fresh
    loadInfo(LinkedListEngine.INFO.singly);
    renderLinkedList();
  } else if (m === 'bst') {
    hidePlayControls(true);
    App.bst = new BSTEngine.BST();
    [15, 8, 22, 4, 11, 18, 26].forEach(v => App.bst.insert(v));
    loadInfo(BSTEngine.INFO);
    redraw();
    renderBSTControls();
  } else if (m === 'heap') {
    hidePlayControls(true);
    App.heap = new HeapEngine.Heap(App.algo === 'minheap' ? 'min' : 'max');
    [10, 4, 15, 20, 1, 9].forEach(v => App.heap.insert(v));
    loadInfo(HeapEngine.INFO[App.algo]);
    redraw();
    renderHeapControls();
  } else if (m === 'graph') {
    App.graphState = null;
    App.steps = [];
    App.stepIdx = 0;
    loadInfo(GraphEngine.INFO[App.algo]);
    Renderer.drawGraph(ctx, canvas.width, canvas.height, GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, {});
    renderGraphControls();
  } else if (m === 'dp') {
    hidePlayControls(false);
    App.dpState = null;
    loadInfo(DPEngine.ALGORITHMS[App.algo]);
    initDP();
  }
}

function hidePlayControls(hide) {
  ['btn-play','btn-step','btn-reset','btn-generate','speed-slider'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = hide ? 'none' : '';
  });
  document.querySelector('.ctrl-label').style.display = hide ? 'none' : '';
}

// ─── Array generation ─────────────────────────────────────────
function generateArray(forSearch = false) {
  const n = 20;
  App.arr = Array.from({length: n}, () => Math.floor(Math.random() * 90) + 10);
  if (forSearch) {
    App.target = App.arr[Math.floor(Math.random() * n)];
  }
  App.steps = [];
  App.stepIdx = 0;
  resetMetrics();
  buildSteps();
  redraw();
}

function buildSteps() {
  const m = App.module, a = App.algo;
  if (m === 'sorting') {
    App.steps = [...SortingEngine.ALGORITHMS[a].gen(App.arr)];
  } else if (m === 'searching') {
    App.steps = [...SearchingEngine.ALGORITHMS[a].gen(App.arr, App.target)];
  } else if (m === 'graph') {
    const gen = a === 'bfs' ? GraphEngine.bfsGen :
                a === 'dfs' ? GraphEngine.dfsGen : GraphEngine.dijkstraGen;
    App.steps = [...gen(GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, 0)];
  } else if (m === 'dp') {
    const alg = DPEngine.ALGORITHMS[a];
    if (a === 'lcs') App.steps = [...alg.gen('ABCBDAB', 'BDCAB')];
    else App.steps = [...alg.gen([{w:2,v:6},{w:2,v:10},{w:3,v:12}], 5)];
  }
  App.stepIdx = 0;
}

// ─── Playback ─────────────────────────────────────────────────
function getDelay() {
  const v = parseInt(speedSlider.value);
  return Math.round(1200 / v);
}

function startPlay() {
  if (App.stepIdx >= App.steps.length) {
    App.stepIdx = 0;
    resetMetrics();
  }
  App.playing = true;
  document.getElementById('btn-play').textContent = '⏸ Pause';
  App.timer = setInterval(() => {
    if (App.stepIdx >= App.steps.length) {
      stopPlay();
      mStatus.textContent = 'Done ✓';
      mStatus.style.color = 'var(--accent2)';
      return;
    }
    applyStep(App.steps[App.stepIdx++]);
  }, getDelay());
}

function stopPlay() {
  App.playing = false;
  clearInterval(App.timer);
  document.getElementById('btn-play').textContent = '▶ Play';
}

function applyStep(step) {
  const m = App.module;
  if (m === 'sorting') {
    if (step.swap) App.metrics.swaps++;
    if (step.cmp && step.cmp.length) { App.metrics.comparisons++; App.metrics.accesses += 2; }
    updateMetrics();
    // draw this exact step's state
    Renderer.drawSortBars(ctx, canvas.width, canvas.height, step);
  } else if (m === 'searching') {
    App.metrics.comparisons++;
    App.metrics.accesses++;
    updateMetrics();
    Renderer.drawSearchBars(ctx, canvas.width, canvas.height, step);
  } else if (m === 'graph') {
    App.graphState = step;
    App.metrics.comparisons++;
    updateMetrics();
    Renderer.drawGraph(ctx, canvas.width, canvas.height, GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, App.graphState);
  } else if (m === 'dp') {
    App.dpState = step;
    App.metrics.accesses++;
    updateMetrics();
    // clear canvas behind DOM layer
    Renderer.clear(ctx, canvas.width, canvas.height);
    renderDP(step);
  }
  // highlight pseudocode line
  if (step.line !== undefined) highlightLine(step.line);
}

// ─── Draw ─────────────────────────────────────────────────────
function redraw() {
  const w = canvas.width, h = canvas.height;
  const m = App.module;
  // Use the last applied step (stepIdx-1), or fall back to initial state
  const step = App.stepIdx > 0 ? (App.steps[App.stepIdx - 1] || {}) : {};

  if (m === 'sorting') {
    Renderer.drawSortBars(ctx, w, h, step.arr ? step : {arr: App.arr, cmp:[], done:[], swap:false});
  } else if (m === 'searching') {
    Renderer.drawSearchBars(ctx, w, h, step.arr ? step : {arr: App.arr, current:-1, found:-1, searched:[]});
  } else if (m === 'bst') {
    const layout = App.bst ? App.bst.toLayout(w, h) : [];
    Renderer.drawTree(ctx, w, h, layout);
  } else if (m === 'heap') {
    if (App.heap) {
      const {nodes, edges} = App.heap.toLayout(w, h);
      Renderer.clear(ctx, w, h);
      edges.forEach(e => {
        ctx.strokeStyle = 'rgba(99,132,255,0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(e.from[0], e.from[1]);
        ctx.lineTo(e.to[0], e.to[1]);
        ctx.stroke();
      });
      Renderer.drawTree(ctx, w, h, nodes.map(n => ({...n, edge: false})));
    } else {
      Renderer.clear(ctx, w, h);
    }
  } else if (m === 'graph') {
    Renderer.drawGraph(ctx, w, h, GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, App.graphState || {});
  } else {
    Renderer.clear(ctx, w, h);
  }
}

// ─── Info panel ───────────────────────────────────────────────
function loadInfo(info) {
  // Pseudocode
  const pseudo = info.pseudo || [];
  pseudocodeBox.innerHTML = pseudo.map((line, i) =>
    `<div class="pseudo-line" id="pline-${i}">${line}</div>`
  ).join('');

  // Complexity
  const cx = info.complexity || {};
  const entries = Object.entries(cx);
  const labels = {
    best: 'Best Case', avg: 'Average', worst: 'Worst Case', space: 'Space',
    time: 'Time', push: 'Push', pop: 'Pop', peek: 'Peek',
    enqueue: 'Enqueue', dequeue: 'Dequeue', front: 'Front',
    insert: 'Insert', delete: 'Delete', search: 'Search',
    insert_head: 'Insert Head', insert_tail: 'Insert Tail',
    extractMin: 'Extract Min', extractMax: 'Extract Max',
  };
  const badColor = (v) => {
    if (v.includes('n²') || v.includes('n³')) return 'bad';
    if (v.includes('n log') || v.includes('n·')) return 'ok';
    return '';
  };

  complexityTable.innerHTML = `
    <div class="cx-title">${info.name || 'Complexity'}</div>
    ${entries.map(([k, v]) =>
      `<div class="cx-row">
        <span class="cx-key">${labels[k] || k}</span>
        <span class="cx-val ${badColor(v)}">${v}</span>
       </div>`
    ).join('')}`;

  // Badges in topbar
  complexityBadge.innerHTML = '';
  if (cx.avg || cx.time) {
    const v = cx.avg || cx.time;
    const cls = badColor(v);
    complexityBadge.innerHTML += `<span class="badge ${cls}">Time: ${v}</span>`;
  }
  if (cx.space) {
    complexityBadge.innerHTML += `<span class="badge green">Space: ${cx.space}</span>`;
  }
}

function highlightLine(lineIdx) {
  document.querySelectorAll('.pseudo-line').forEach((el, i) => {
    el.classList.toggle('active', i === lineIdx);
  });
}

// ─── Metrics ──────────────────────────────────────────────────
function resetMetrics() {
  App.metrics = { comparisons: 0, swaps: 0, accesses: 0 };
  updateMetrics();
  mStatus.textContent = 'Ready';
  mStatus.style.color = 'var(--accent)';
}
function updateMetrics() {
  mComparisons.textContent = App.metrics.comparisons;
  mSwaps.textContent = App.metrics.swaps;
  mAccesses.textContent = App.metrics.accesses;
}

// ─── DOM layer clear ──────────────────────────────────────────
function clearDOM() { domLayer.innerHTML = ''; }

// ─── Stack / Queue rendering ──────────────────────────────────
function renderStack() {
  // Note: clearDOM() already called by initModule() — don't call again here
  const isQueue = App.algo === 'queue';
  const wrap = document.createElement('div');
  wrap.className = isQueue ? 'dom-queue-wrap' : 'dom-stack-wrap';

  if (!isQueue) {
    // Stack UI
    const inputArea = document.createElement('div');
    inputArea.className = 'stack-input-area';
    const inp = document.createElement('input');
    inp.type = 'number'; inp.placeholder = 'Value';
    const pushBtn = document.createElement('button');
    pushBtn.className = 'stack-btn'; pushBtn.textContent = 'Push';
    const popBtn = document.createElement('button');
    popBtn.className = 'stack-btn'; popBtn.textContent = 'Pop';
    const peekBtn = document.createElement('button');
    peekBtn.className = 'stack-btn'; peekBtn.textContent = 'Peek';
    inputArea.append(inp, pushBtn, popBtn, peekBtn);

    const container = document.createElement('div');
    container.className = 'stack-container';

    const inner = document.createElement('div');
    inner.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:16px;';
    inner.append(inputArea, container);
    wrap.appendChild(inner);

    function refreshStack() {
      container.innerHTML = '';
      if (!App.stackData.length) {
        // Always create a fresh emptyLabel — never reuse a detached node
        const el = document.createElement('div');
        el.className = 'stack-empty-label';
        el.textContent = '[ empty ]';
        container.appendChild(el);
        return;
      }
      App.stackData.forEach((val, i) => {
        const frame = document.createElement('div');
        frame.className = 'stack-frame' + (i === App.stackData.length - 1 ? ' highlight top-tag' : '');
        frame.textContent = val;
        container.appendChild(frame);
      });
    }

    pushBtn.addEventListener('click', () => {
      const raw = inp.value.trim();
      if (raw === '') return;  // allow 0
      App.stackData.push(raw); inp.value = '';
      refreshStack();
      mStatus.textContent = `Pushed ${raw}`;
      App.metrics.accesses++;
      updateMetrics();
    });
    popBtn.addEventListener('click', () => {
      if (!App.stackData.length) { mStatus.textContent = 'Stack is empty!'; return; }
      const v = App.stackData.pop();
      refreshStack();
      mStatus.textContent = `Popped ${v}`;
      App.metrics.accesses++;
      updateMetrics();
    });
    peekBtn.addEventListener('click', () => {
      if (!App.stackData.length) { mStatus.textContent = 'Stack is empty!'; return; }
      const top = App.stackData[App.stackData.length - 1];
      mStatus.textContent = `Peek → ${top}`;
      // Flash top frame
      const frames = container.querySelectorAll('.stack-frame');
      if (frames.length) {
        frames[frames.length - 1].style.boxShadow = '0 0 12px var(--accent2)';
        setTimeout(() => { frames[frames.length - 1].style.boxShadow = ''; }, 600);
      }
    });
    refreshStack();
  } else {
    // Queue UI
    const outer = document.createElement('div');
    outer.className = 'queue-outer';
    const inputArea = document.createElement('div');
    inputArea.className = 'stack-input-area';
    const inp = document.createElement('input');
    inp.type = 'number'; inp.placeholder = 'Value';
    const enqBtn = document.createElement('button');
    enqBtn.className = 'stack-btn'; enqBtn.textContent = 'Enqueue';
    const deqBtn = document.createElement('button');
    deqBtn.className = 'stack-btn'; deqBtn.textContent = 'Dequeue';
    const frontBtn = document.createElement('button');
    frontBtn.className = 'stack-btn'; frontBtn.textContent = 'Front';
    inputArea.append(inp, enqBtn, deqBtn, frontBtn);
    const track = document.createElement('div');
    track.className = 'queue-track';
    const labels = document.createElement('div');
    labels.style.cssText = 'display:flex;gap:20px;font-size:11px;font-family:Space Mono;color:var(--text3);';
    labels.innerHTML = '<span style="color:var(--accent2)">← FRONT (dequeue)</span><span style="color:var(--accent4)">REAR (enqueue) →</span>';
    outer.append(inputArea, track, labels);
    wrap.appendChild(outer);

    function refreshQueue() {
      track.innerHTML = '';
      if (!App.queueData.length) {
        const empty = document.createElement('span');
        empty.style.cssText = 'color:var(--text3);font-family:Space Mono;font-size:13px;';
        empty.textContent = '[ empty ]';
        track.appendChild(empty);
        return;
      }
      App.queueData.forEach((val, i) => {
        const cell = document.createElement('div');
        cell.className = 'queue-cell' +
          (i === 0 ? ' front' : i === App.queueData.length - 1 ? ' back' : '');
        cell.textContent = val;
        track.appendChild(cell);
      });
    }
    enqBtn.addEventListener('click', () => {
      const raw = inp.value.trim(); if (raw === '') return;
      App.queueData.push(raw); inp.value = '';
      refreshQueue();
      mStatus.textContent = `Enqueued ${raw}`;
      App.metrics.accesses++; updateMetrics();
    });
    deqBtn.addEventListener('click', () => {
      if (!App.queueData.length) { mStatus.textContent = 'Queue is empty!'; return; }
      const v = App.queueData.shift();
      refreshQueue();
      mStatus.textContent = `Dequeued ${v}`;
      App.metrics.accesses++; updateMetrics();
    });
    frontBtn.addEventListener('click', () => {
      if (!App.queueData.length) { mStatus.textContent = 'Queue is empty!'; return; }
      mStatus.textContent = `Front → ${App.queueData[0]}`;
      const cells = track.querySelectorAll('.queue-cell');
      if (cells.length) {
        cells[0].style.boxShadow = '0 0 12px var(--accent2)';
        setTimeout(() => { cells[0].style.boxShadow = ''; }, 600);
      }
    });
    refreshQueue();
  }
  domLayer.appendChild(wrap);
}

// ─── Linked List ───────────────────────────────────────────────
function renderLinkedList() {
  // Seed defaults only on very first visit (llData empty)
  if (!App.llData.length) App.llData = [10, 20, 30, 40];

  const wrap = document.createElement('div');
  wrap.className = 'dom-ll-wrap';
  const outer = document.createElement('div');
  outer.className = 'll-outer';

  const inputArea = document.createElement('div');
  inputArea.className = 'stack-input-area';
  const inp = document.createElement('input');
  inp.type = 'number'; inp.placeholder = 'Value';
  const addHead = document.createElement('button'); addHead.className = 'stack-btn'; addHead.textContent = 'Insert Head';
  const addTail = document.createElement('button'); addTail.className = 'stack-btn'; addTail.textContent = 'Insert Tail';
  const del = document.createElement('button'); del.className = 'stack-btn'; del.textContent = 'Delete';
  const clearBtn = document.createElement('button'); clearBtn.className = 'stack-btn'; clearBtn.textContent = 'Clear';
  inputArea.append(inp, addHead, addTail, del, clearBtn);

  const track = document.createElement('div');
  track.className = 'll-track';

  function refreshLL() {
    track.innerHTML = '';
    if (!App.llData.length) {
      const empty = document.createElement('span');
      empty.style.cssText = 'color:var(--text3);font-family:Space Mono;font-size:13px;';
      empty.textContent = '[ empty list ]';
      track.appendChild(empty);
      return;
    }
    App.llData.forEach((val, i) => {
      const node = document.createElement('div');
      node.className = 'll-node';
      const box = document.createElement('div'); box.className = 'll-box';
      const data = document.createElement('div'); data.className = 'll-data'; data.textContent = val;
      const next = document.createElement('div'); next.className = 'll-next'; next.textContent = i < App.llData.length-1 ? '→' : '∅';
      box.append(data, next);
      if (i < App.llData.length - 1) {
        const arrow = document.createElement('span'); arrow.className = 'll-arrow'; arrow.textContent = '→';
        node.append(box, arrow);
      } else {
        const nullLabel = document.createElement('span'); nullLabel.className = 'll-null'; nullLabel.textContent = 'null';
        node.append(box, nullLabel);
      }
      track.appendChild(node);
    });
  }

  addHead.addEventListener('click', () => {
    const raw = inp.value.trim();
    if (raw === '') return;  // allow 0
    App.llData.unshift(Number(raw)); inp.value = ''; refreshLL();
    mStatus.textContent = `Inserted ${raw} at head`; App.metrics.accesses++; updateMetrics();
  });
  addTail.addEventListener('click', () => {
    const raw = inp.value.trim();
    if (raw === '') return;
    App.llData.push(Number(raw)); inp.value = ''; refreshLL();
    mStatus.textContent = `Inserted ${raw} at tail`; App.metrics.accesses++; updateMetrics();
  });
  del.addEventListener('click', () => {
    const raw = inp.value.trim();
    if (raw === '') return;
    const v = Number(raw);
    const idx = App.llData.indexOf(v);
    if (idx !== -1) {
      App.llData.splice(idx, 1); inp.value = ''; refreshLL();
      mStatus.textContent = `Deleted ${v}`; App.metrics.accesses++; updateMetrics();
    } else {
      mStatus.textContent = `${v} not found in list`;
    }
  });
  clearBtn.addEventListener('click', () => {
    App.llData = []; refreshLL(); mStatus.textContent = 'List cleared';
  });

  outer.append(inputArea, track);
  wrap.appendChild(outer);
  domLayer.appendChild(wrap);
  refreshLL();
}

// ─── BST controls ─────────────────────────────────────────────
function renderBSTControls() {
  // Note: clearDOM() already called by initModule before redraw() and this call
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;top:10px;right:14px;display:flex;flex-direction:column;gap:6px;z-index:5;pointer-events:all;';
  const inp = document.createElement('input');
  inp.type='number'; inp.placeholder='Value';
  inp.style.cssText='padding:6px 10px;background:var(--bg3);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:Space Mono;font-size:13px;outline:none;width:110px;';
  const insBtn = document.createElement('button');
  insBtn.className='stack-btn'; insBtn.textContent='Insert';
  const delBtn = document.createElement('button');
  delBtn.className='stack-btn'; delBtn.textContent='Delete';
  const clearBtn = document.createElement('button');
  clearBtn.className='stack-btn'; clearBtn.textContent='Clear';
  wrap.append(inp, insBtn, delBtn, clearBtn);
  insBtn.addEventListener('click', () => {
    const v=+inp.value; if(!v) return; App.bst.insert(v); inp.value=''; redraw(); mStatus.textContent=`Inserted ${v}`; App.metrics.accesses++; updateMetrics();
  });
  delBtn.addEventListener('click', () => {
    const v=+inp.value; if(!v) return; App.bst.remove(v); inp.value=''; redraw(); mStatus.textContent=`Deleted ${v}`; App.metrics.accesses++; updateMetrics();
  });
  clearBtn.addEventListener('click', () => { App.bst=new BSTEngine.BST(); redraw(); mStatus.textContent='Cleared'; });
  domLayer.appendChild(wrap);
}

// ─── Heap controls ────────────────────────────────────────────
function renderHeapControls() {
  // Note: clearDOM() already called by initModule
  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:absolute;top:10px;right:14px;display:flex;flex-direction:column;gap:6px;z-index:5;pointer-events:all;';
  const inp = document.createElement('input');
  inp.type='number'; inp.placeholder='Value';
  inp.style.cssText='padding:6px 10px;background:var(--bg3);border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:Space Mono;font-size:13px;outline:none;width:110px;';
  const insBtn = document.createElement('button'); insBtn.className='stack-btn'; insBtn.textContent='Insert';
  const extBtn = document.createElement('button'); extBtn.className='stack-btn'; extBtn.textContent='Extract Top';
  wrap.append(inp, insBtn, extBtn);
  insBtn.addEventListener('click', () => {
    const v=+inp.value; if(!v) return; App.heap.insert(v); inp.value=''; redraw(); mStatus.textContent=`Inserted ${v}`; App.metrics.accesses++; updateMetrics();
  });
  extBtn.addEventListener('click', () => {
    const v=App.heap.extract(); redraw(); mStatus.textContent=v!=null?`Extracted ${v}`:'Empty'; App.metrics.accesses++; updateMetrics();
  });
  domLayer.appendChild(wrap);
}

// ─── Graph controls ───────────────────────────────────────────
function renderGraphControls() {
  // Graph uses its own Run button; hide the top bar play controls
  hidePlayControls(true);

  const wrap = document.createElement('div');
  wrap.style.cssText='position:absolute;top:10px;right:14px;z-index:5;pointer-events:all;display:flex;flex-direction:column;gap:6px;';
  wrap.id = 'graph-ctrl';
  const runBtn = document.createElement('button');
  runBtn.className='stack-btn'; runBtn.textContent='▶ Run Algorithm';
  const stepBtn = document.createElement('button');
  stepBtn.className='stack-btn'; stepBtn.textContent='Step →';
  const resetBtn = document.createElement('button');
  resetBtn.className='stack-btn'; resetBtn.textContent='↺ Reset';

  wrap.append(runBtn, stepBtn, resetBtn);

  runBtn.addEventListener('click', () => {
    buildSteps();
    App.stepIdx = 0;
    resetMetrics();
    // Manual play loop for graph (without showing top controls)
    stopPlay();
    App.playing = true;
    App.timer = setInterval(() => {
      if (App.stepIdx >= App.steps.length) {
        stopPlay();
        mStatus.textContent = 'Done ✓';
        mStatus.style.color = 'var(--accent2)';
        return;
      }
      const step = App.steps[App.stepIdx++];
      App.graphState = step;
      App.metrics.comparisons++;
      updateMetrics();
      Renderer.drawGraph(ctx, canvas.width, canvas.height, GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, App.graphState);
      if (step.line !== undefined) highlightLine(step.line);
      if (step.order) mStatus.textContent = `Visited: ${step.order.map(id => GraphEngine.DEFAULT_NODES[id].label).join(' → ')}`;
    }, getDelay());
  });

  stepBtn.addEventListener('click', () => {
    if (!App.steps.length) { buildSteps(); App.stepIdx = 0; resetMetrics(); }
    if (App.stepIdx < App.steps.length) {
      const step = App.steps[App.stepIdx++];
      App.graphState = step;
      App.metrics.comparisons++;
      updateMetrics();
      Renderer.drawGraph(ctx, canvas.width, canvas.height, GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, App.graphState);
      if (step.line !== undefined) highlightLine(step.line);
      if (step.order) mStatus.textContent = `Visited: ${step.order.map(id => GraphEngine.DEFAULT_NODES[id].label).join(' → ')}`;
    }
  });

  resetBtn.addEventListener('click', () => {
    stopPlay();
    App.graphState = null;
    App.steps = [];
    App.stepIdx = 0;
    resetMetrics();
    Renderer.drawGraph(ctx, canvas.width, canvas.height, GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, {});
  });

  domLayer.appendChild(wrap);
}

// ─── DP ───────────────────────────────────────────────────────
function initDP() {
  buildSteps();
  App.dpState = null;
  clearDOM();
  const wrap = document.createElement('div');
  wrap.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:all;';
  wrap.id='dp-wrap';
  domLayer.appendChild(wrap);
  renderDP(null);
}

function renderDP(step) {
  const wrap = document.getElementById('dp-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  const outer = document.createElement('div');
  outer.className = 'dp-outer';

  if (!step) {
    const hint = document.createElement('div');
    hint.style.cssText = 'color:var(--text3);font-family:Space Mono;font-size:13px;text-align:center;line-height:2;';
    if (App.algo === 'lcs') {
      hint.innerHTML = 'LCS(<span style="color:var(--accent)">ABCBDAB</span>, <span style="color:var(--accent2)">BDCAB</span>)<br>Press ▶ Play to visualize';
    } else {
      hint.innerHTML = 'Knapsack — Items: [{w:2,v:6},{w:2,v:10},{w:3,v:12}], Capacity=5<br>Press ▶ Play to visualize';
    }
    outer.appendChild(hint);
    wrap.appendChild(outer);
    return;
  }

  const dp = step.dp;
  const rows = dp.length, cols = dp[0].length;

  // Build header row labels
  let colHeaders = [], rowHeaders = [];
  if (App.algo === 'lcs') {
    colHeaders = ['', ...(['ε', ...'BDCAB'.split('')])];
    rowHeaders = ['ε', ...'ABCBDAB'.split('')];
  } else {
    colHeaders = Array.from({length: cols}, (_, j) => j === 0 ? 'w→' : String(j - 1));
    rowHeaders = ['∅', 'i1', 'i2', 'i3'];
  }

  // Table with headers
  const table = document.createElement('div');
  table.className = 'dp-table';
  // cols + 1 for row-header column
  table.style.gridTemplateColumns = `36px repeat(${cols}, 40px)`;

  for (let i = 0; i < rows; i++) {
    // row header
    const rh = document.createElement('div');
    rh.className = 'dp-cell header';
    rh.style.cssText = 'font-size:10px;color:var(--accent4);background:var(--bg2);border-color:transparent;';
    rh.textContent = rowHeaders[i] !== undefined ? rowHeaders[i] : String(i);
    table.appendChild(rh);

    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      const isActive = step.active && step.active[0] === i && step.active[1] === j;
      // isDone: any cell in a fully processed row, or earlier cell in current row
      const isDone = step.active
        ? (i < step.active[0]) || (i === step.active[0] && j < step.active[1])
        : !!step.done;

      let cls = 'dp-cell';
      if (isActive) cls += ' active';
      else if (isDone) cls += ' done';  // show all done cells, even zeros
      cell.className = cls;
      cell.textContent = dp[i][j];
      table.appendChild(cell);
    }
  }

  // Column headers above table
  const colHeaderRow = document.createElement('div');
  colHeaderRow.className = 'dp-table';
  colHeaderRow.style.gridTemplateColumns = `36px repeat(${cols}, 40px)`;
  colHeaderRow.style.marginBottom = '2px';
  colHeaders.forEach((h, j) => {
    const cell = document.createElement('div');
    cell.className = 'dp-cell header';
    cell.style.cssText = 'font-size:10px;color:var(--accent);background:var(--bg2);border-color:transparent;height:24px;';
    cell.textContent = h;
    colHeaderRow.appendChild(cell);
  });

  if (step.done) {
    const res = document.createElement('div');
    res.style.cssText = 'font-family:Space Mono;font-size:14px;color:var(--accent2);margin-top:12px;text-align:center;';
    res.textContent = App.algo === 'lcs' ? `✓ LCS Length: ${step.result}` : `✓ Max Value: ${step.result}`;
    outer.append(colHeaderRow, table, res);
  } else {
    outer.append(colHeaderRow, table);
  }
  wrap.appendChild(outer);
}

// ─── Button wiring ────────────────────────────────────────────
document.getElementById('btn-play').addEventListener('click', () => {
  if (App.playing) stopPlay(); else startPlay();
});
document.getElementById('btn-step').addEventListener('click', () => {
  if (!App.steps.length) buildSteps();
  if (App.stepIdx < App.steps.length) {
    applyStep(App.steps[App.stepIdx++]);
    mStatus.textContent = `Step ${App.stepIdx}/${App.steps.length}`;
  }
});
document.getElementById('btn-reset').addEventListener('click', () => {
  stopPlay();
  App.stepIdx = 0;
  resetMetrics();
  if (App.module === 'dp') {
    Renderer.clear(ctx, canvas.width, canvas.height);
    clearDOM();
    initDP();
  } else if (App.module === 'graph') {
    App.graphState = null;
    App.steps = [];
    Renderer.drawGraph(ctx, canvas.width, canvas.height, GraphEngine.DEFAULT_NODES, GraphEngine.DEFAULT_EDGES, {});
  } else {
    redraw();
  }
});
document.getElementById('btn-generate').addEventListener('click', () => {
  stopPlay();
  if (App.module === 'sorting') generateArray();
  else if (App.module === 'searching') generateArray(true);
  else if (App.module === 'graph') { App.graphState=null; redraw(); App.steps=[]; }
});

// Nav buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchModule(btn.dataset.module));
});

// ─── Boot ─────────────────────────────────────────────────────
resizeCanvas();
switchModule('sorting');
