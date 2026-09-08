import { create } from 'zustand';
import {
  ModuleId,
  Step,
  Metrics,
  MetricsDelta,
  ComplexityInfo,
  AlgoListItem,
  AlgorithmMeta,
  StackNarrative,
  LinkedListMode,
  LinkedListNarrative,
  BSTMode,
  BSTNarrative,
} from '@/types';
import { BST } from '@/engines/bst';
import { Heap } from '@/engines/heap';
import {
  SORTING_ALGORITHMS,
  SEARCHING_ALGORITHMS,
  DP_ALGORITHMS,
  DEFAULT_NODES,
  DEFAULT_EDGES,
  bfsGen,
  dfsGen,
  dijkstraGen,
  GRAPH_INFO,
  STACK_INFO,
  QUEUE_INFO,
  CIRCULAR_QUEUE_INFO,
  MIN_STACK_INFO,
  STACK_CAPACITY,
  STACK_DATA_STRUCTURES,
  HEAP_INFO,
  LINKED_LIST_CAPACITY,
  LINKED_LIST_INFOS,
  BST_CAPACITY,
  BST_INFOS,
} from '@/engines';
import { playFrequencyTone } from '@/components/canvas/CanvasRenderer';

export interface AppState {
  // Navigation
  module: ModuleId;
  algo: string;
  setModule: (module: ModuleId) => void;
  setAlgo: (algo: string) => void;

  // Module display info
  moduleTitle: string;
  setModuleTitle: (title: string) => void;
  algoList: AlgoListItem[];
  setAlgoList: (list: AlgoListItem[]) => void;
  algoName: string;
  setAlgoName: (name: string) => void;

  // Complexity & pseudocode (for UI components)
  complexityInfo: ComplexityInfo | null;
  setComplexityInfo: (info: ComplexityInfo | null) => void;
  pseudocode: string[];
  setPseudocode: (lines: string[]) => void;
  currentLine: number;
  algoMeta: AlgorithmMeta | null;

  // Playback
  steps: Step[];
  stepIdx: number;
  playing: boolean;
  speed: number;
  hidePlayback: boolean;
  showGenerate: boolean;

  // Array data
  arr: number[];
  target: number;
  generateArray: (forSearch?: boolean, size?: number) => void;
  setArrayPreset: (
    preset: 'random' | 'nearlySorted' | 'reversed' | 'fewUnique' | 'sortedUniform' | 'sortedRandom',
    count?: number
  ) => void;
  setArr: (arr: number[]) => void;
  setTarget: (target: number) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Metrics
  metrics: Metrics;
  status: string;
  statusColor: string;
  resetMetrics: () => void;
  addMetricDelta: (delta?: MetricsDelta) => void;
  setStatus: (text: string, color?: string) => void;

  // BST
  bst: BST | null;
  bstMode: BSTMode;
  bstActiveNodes: number[];
  bstFoundNode: number | null;
  bstNarrative: BSTNarrative | null;
  bstTraversalOutput: number[] | null;
  heap: Heap | null;
  heapType: 'min' | 'max';
  stackData: number[];
  minStackData: number[];
  queueData: (number | null)[];
  queueFront: number;
  queueRear: number;
  queueCount: number;
  stackHighlightIdx: number | null;
  stackNarrative: StackNarrative | null;
  // Linked List
  llMode: LinkedListMode;
  llData: number[];
  llActivePointer: number | null;
  llPrevPointer: number | null;
  llNarrative: LinkedListNarrative | null;
  llTraversals: number;

  // Data structure actions
  stackAction: (action: string, value?: number | string) => void;
  queueAction: (action: string, value?: number | string) => void;
  setLinkedListMode: (mode: LinkedListMode) => void;
  llAction: (action: string, value?: number | string, index?: number) => void;
  llSearch: (target: number) => Promise<boolean>;
  llReverse: () => Promise<void>;
  resetLinkedListData: () => void;
  setBst: (bst: BST | null) => void;
  setBSTMode: (mode: BSTMode) => void;
  bstInsert: (val: number) => boolean;
  bstDelete: (val: number) => boolean;
  bstSearch: (target: number) => Promise<boolean>;
  bstRunTraversal: (type?: BSTMode) => Promise<number[]>;
  bstFindMin: () => number | null;
  bstFindMax: () => number | null;
  bstLoadPreset: (preset: 'balanced' | 'skewed') => void;
  setHeap: (heap: Heap | null) => void;
  setHeapType: (type: 'min' | 'max') => void;

  // Graph
  graphAlgo: string;
  graphStart: number;
  graphTarget: number;
  setGraphAlgo: (algo: string) => void;
  setGraphStart: (id: number) => void;
  setGraphTarget: (id: number) => void;

  // DP
  dpAlgo: string;
  dpConfig: {
    s1: string;
    s2: string;
    items: { w: number; v: number }[];
    capacity: number;
  };
  dpState: Step | null;
  setDpAlgo: (algo: string) => void;
  setDpConfig: (config: Partial<AppState['dpConfig']>) => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Actions
  buildSteps: () => void;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;

  // Page lifecycle helpers
  loadInfo: (info: { name?: string; complexity?: ComplexityInfo; pseudo?: string[] }) => void;
  setCustomControls: (controls: React.ReactNode | null) => void;
  customControls: React.ReactNode | null;
  hidePlayControls: (hide: boolean) => void;
  showGenerateButton: (show: boolean) => void;
  stopPlay: () => void;
  initBST: () => void;
  initHeap: (type?: string) => void;
  initGraph: () => void;
  initDP: () => void;
  resetStackQueueData: () => void;
}

let playbackTimer: ReturnType<typeof setInterval> | null = null;

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  module: 'sorting',
  algo: 'bubble',
  setModule: (module) => {
    get().pause();
    set({ module, steps: [], stepIdx: 0 });
    get().resetMetrics();
  },
  setAlgo: (algo) => {
    get().pause();
    const currentMod = get().module;
    set({ algo, steps: [], stepIdx: 0 });
    get().resetMetrics();

    if (currentMod === 'sorting' && SORTING_ALGORITHMS[algo]) {
      get().loadInfo(SORTING_ALGORITHMS[algo]);
      get().buildSteps();
    } else if (currentMod === 'searching' && SEARCHING_ALGORITHMS[algo]) {
      get().loadInfo(SEARCHING_ALGORITHMS[algo]);
      get().buildSteps();
    } else if (currentMod === 'graph' && GRAPH_INFO[algo]) {
      get().loadInfo(GRAPH_INFO[algo]);
      get().buildSteps();
    } else if (currentMod === 'dp' && DP_ALGORITHMS[algo]) {
      set({ dpAlgo: algo });
      get().loadInfo(DP_ALGORITHMS[algo]);
      get().buildSteps();
    } else if (currentMod === 'stack') {
      if (STACK_DATA_STRUCTURES[algo]) {
        get().loadInfo(STACK_DATA_STRUCTURES[algo]);
      } else {
        get().loadInfo(STACK_INFO);
      }
      get().resetStackQueueData();
    } else if (currentMod === 'linkedlist') {
      const mode = (algo === 'doubly' || algo === 'circular') ? algo : 'singly';
      set({
        llMode: mode,
        llActivePointer: null,
        llPrevPointer: null,
        status: `Switched to ${LINKED_LIST_INFOS[mode]?.name || 'Linked List'}`,
        statusColor: '',
        llNarrative: {
          action: 'mode_switch',
          badge: 'PARADIGM',
          reason: LINKED_LIST_INFOS[mode]?.description || '',
        },
      });
      if (LINKED_LIST_INFOS[mode]) {
        get().loadInfo(LINKED_LIST_INFOS[mode]);
      }
    } else if (currentMod === 'bst') {
      const mode = (['bst', 'inorder', 'preorder', 'postorder', 'levelorder'].includes(algo) ? algo : 'bst') as BSTMode;
      set({
        bstMode: mode,
        bstActiveNodes: [],
        bstFoundNode: null,
        bstTraversalOutput: null,
        status: `Switched to ${BST_INFOS[mode]?.name || 'Binary Search Tree'}`,
        statusColor: '',
        bstNarrative: {
          action: 'mode_switch',
          badge: 'PARADIGM',
          reason: BST_INFOS[mode]?.description || 'Binary Search Tree mode selected.',
        },
      });
      if (BST_INFOS[mode]) {
        get().loadInfo(BST_INFOS[mode]);
      }
    } else if (currentMod === 'heap' && HEAP_INFO[algo]) {
      get().loadInfo(HEAP_INFO[algo]);
    }
  },

  // Module display
  moduleTitle: 'Sorting Algorithms',
  setModuleTitle: (title) => set({ moduleTitle: title }),
  algoList: [],
  setAlgoList: (list) => set({ algoList: list }),
  algoName: '',
  setAlgoName: (name) => set({ algoName: name }),

  // Complexity & pseudocode
  complexityInfo: null,
  setComplexityInfo: (info) => set({ complexityInfo: info }),
  pseudocode: [],
  setPseudocode: (lines) => set({ pseudocode: lines }),
  currentLine: -1,
  algoMeta: null,

  // Playback
  steps: [],
  stepIdx: 0,
  playing: false,
  speed: 5,
  hidePlayback: false,
  showGenerate: true,

  // Array data
  arr: [],
  target: 42,
  generateArray: (forSearch = false, size = 20) => {
    const n = Math.max(5, Math.min(60, size || 20));
    const newArr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    if (forSearch) {
      newArr.sort((a, b) => a - b);
    }
    const newTarget = forSearch ? newArr[Math.floor(Math.random() * n)] : get().target;
    set({ arr: newArr, target: newTarget, steps: [], stepIdx: 0 });
    get().resetMetrics();
    get().buildSteps();
  },
  setArrayPreset: (
    preset: 'random' | 'nearlySorted' | 'reversed' | 'fewUnique' | 'sortedUniform' | 'sortedRandom',
    count = 20
  ) => {
    const n = Math.max(5, Math.min(60, count || 20));
    let newArr: number[] = [];
    if (preset === 'random') {
      newArr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
    } else if (preset === 'nearlySorted') {
      newArr = Array.from({ length: n }, (_, i) => Math.floor(10 + (i * 85) / n));
      const perturbCount = Math.max(1, Math.floor(n * 0.15));
      for (let k = 0; k < perturbCount; k++) {
        const i1 = Math.floor(Math.random() * n);
        const i2 = Math.min(n - 1, i1 + 1);
        [newArr[i1], newArr[i2]] = [newArr[i2], newArr[i1]];
      }
    } else if (preset === 'reversed') {
      newArr = Array.from({ length: n }, (_, i) => Math.floor(95 - (i * 85) / n));
    } else if (preset === 'fewUnique') {
      const pool = [18, 38, 58, 78, 92];
      newArr = Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)]);
    } else if (preset === 'sortedUniform') {
      const step = Math.max(2, Math.floor(80 / n));
      const start = 10;
      newArr = Array.from({ length: n }, (_, i) => start + i * step);
    } else if (preset === 'sortedRandom') {
      newArr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b);
    }

    // If in searching module and current target is not in array or array changed, ensure target is in array or kept
    let currentTarget = get().target;
    if (get().module === 'searching' && !newArr.includes(currentTarget) && newArr.length > 0) {
      currentTarget = newArr[Math.floor(newArr.length / 2)];
    }

    set({ arr: newArr, target: currentTarget, steps: [], stepIdx: 0 });
    get().resetMetrics();
    get().buildSteps();
  },
  setArr: (arr) => {
    set({ arr, steps: [], stepIdx: 0 });
    get().resetMetrics();
    get().buildSteps();
  },
  setTarget: (target) => {
    set({ target, steps: [], stepIdx: 0 });
    get().resetMetrics();
    if (get().module === 'searching') {
      get().buildSteps();
    }
  },

  // Sound
  soundEnabled: false,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

  // Metrics
  metrics: { comparisons: 0, swaps: 0, accesses: 0 },
  status: 'Ready',
  statusColor: '',
  resetMetrics: () => set({ metrics: { comparisons: 0, swaps: 0, accesses: 0 }, status: 'Ready' }),
  addMetricDelta: (delta) => {
    if (!delta) return;
    set((state) => ({
      metrics: {
        comparisons: state.metrics.comparisons + (delta.comparisons || 0),
        swaps: state.metrics.swaps + (delta.swaps || 0),
        accesses: state.metrics.accesses + (delta.accesses || 0),
      },
    }));
  },
  setStatus: (text, color) => set({ status: text, statusColor: color || '' }),

  // Data structures
  bst: null,
  bstMode: 'bst',
  bstActiveNodes: [],
  bstFoundNode: null,
  bstNarrative: {
    action: 'ready',
    badge: 'READY',
    reason: 'Binary Search Tree initialized. Insert keys to construct the tree (capacity: 15 nodes).',
  },
  bstTraversalOutput: null,
  heap: null,
  heapType: 'min',
  stackData: [24, 45, 68],
  minStackData: [24, 24, 24],
  queueData: [15, 32, 48, null, null, null, null, null],
  queueFront: 0,
  queueRear: 2,
  queueCount: 3,
  stackHighlightIdx: null,
  stackNarrative: {
    action: 'ready',
    badge: 'READY',
    reason: 'Initialized memory slots. Ready for operations.',
  },
  llMode: 'singly',
  llData: [12, 35, 64, 88],
  llActivePointer: null,
  llPrevPointer: null,
  llNarrative: {
    action: 'ready',
    badge: 'READY',
    reason: 'Initialized Singly Linked List with 4 sample nodes. Ready for operations.',
  },
  llTraversals: 0,

  // Data structure actions
  stackAction: (action, value) => {
    const state = get();
    const isMinStack = state.algo === 'min_stack';

    if (action === 'push') {
      const num =
        value !== undefined && String(value).trim() !== ''
          ? Number(value)
          : Math.floor(Math.random() * 85) + 12;

      if (!Number.isFinite(num)) {
        set({ status: 'Enter a valid number to push', statusColor: '#f43f5e' });
        return;
      }

      if (state.stackData.length >= STACK_CAPACITY) {
        if (state.soundEnabled) playFrequencyTone(15, 100, 160);
        set({
          status: `Stack Overflow: Exceeded maximum capacity (${STACK_CAPACITY})!`,
          statusColor: '#f43f5e',
          stackNarrative: {
            action: 'overflow',
            badge: 'OVERFLOW',
            reason: `Stack Overflow: Cannot push ${num}. Memory limit of ${STACK_CAPACITY} slots is full (top == ${STACK_CAPACITY - 1}).`,
            isError: true,
          },
        });
        return;
      }

      const newStack = [...state.stackData, num];
      const newMinStack =
        state.minStackData.length === 0
          ? [num]
          : [...state.minStackData, Math.min(num, state.minStackData[state.minStackData.length - 1])];

      if (state.soundEnabled) playFrequencyTone(num, 100, 75);

      set((s) => ({
        stackData: newStack,
        minStackData: newMinStack,
        stackHighlightIdx: newStack.length - 1,
        metrics: { ...s.metrics, accesses: s.metrics.accesses + 1 },
        status: `Pushed ${num} onto TOP [slot ${newStack.length - 1}]`,
        statusColor: '#10b981',
        stackNarrative: {
          action: 'push',
          badge: 'PUSH',
          reason: `Pushed value ${num} onto TOP at slot [${newStack.length - 1}]. Stack depth is now ${newStack.length}/${STACK_CAPACITY}.${
            isMinStack ? ` Current minimum: ${newMinStack[newMinStack.length - 1]}.` : ''
          }`,
        },
      }));

      setTimeout(() => {
        if (get().stackHighlightIdx === newStack.length - 1) {
          set({ stackHighlightIdx: null });
        }
      }, 900);
    } else if (action === 'pop') {
      if (state.stackData.length === 0) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: 'Stack Underflow: Cannot pop from an empty stack!',
          statusColor: '#f43f5e',
          stackNarrative: {
            action: 'underflow',
            badge: 'UNDERFLOW',
            reason: 'Stack Underflow: Attempted to pop when stack depth is 0 (top == -1).',
            isError: true,
          },
        });
        return;
      }

      const poppedVal = state.stackData[state.stackData.length - 1];
      const poppedIdx = state.stackData.length - 1;
      const newStack = state.stackData.slice(0, -1);
      const newMinStack = state.minStackData.slice(0, -1);

      if (state.soundEnabled) playFrequencyTone(poppedVal, 100, 90);

      set((s) => ({
        stackData: newStack,
        minStackData: newMinStack,
        stackHighlightIdx: null,
        metrics: { ...s.metrics, swaps: s.metrics.swaps + 1 },
        status: `Popped ${poppedVal} from TOP [was slot ${poppedIdx}]`,
        statusColor: '#f59e0b',
        stackNarrative: {
          action: 'pop',
          badge: 'POP',
          reason: `Popped value ${poppedVal} from TOP. New TOP is ${
            newStack.length > 0 ? `${newStack[newStack.length - 1]} at [${newStack.length - 1}]` : 'empty (top == -1)'
          }.${isMinStack && newMinStack.length > 0 ? ` Minimum is now: ${newMinStack[newMinStack.length - 1]}.` : ''}`,
        },
      }));
    } else if (action === 'peek') {
      if (state.stackData.length === 0) {
        set({
          status: 'Stack is empty: nothing to peek',
          statusColor: '#f43f5e',
          stackNarrative: {
            action: 'peek_empty',
            badge: 'EMPTY',
            reason: 'Peek failed: stack has no elements (top == -1).',
            isError: true,
          },
        });
        return;
      }

      const topIdx = state.stackData.length - 1;
      const topVal = state.stackData[topIdx];

      if (state.soundEnabled) playFrequencyTone(topVal, 100, 120);

      set((s) => ({
        stackHighlightIdx: topIdx,
        metrics: { ...s.metrics, comparisons: s.metrics.comparisons + 1 },
        status: `Peek: TOP element is ${topVal} at slot [${topIdx}]`,
        statusColor: '#3b82f6',
        stackNarrative: {
          action: 'peek',
          badge: 'PEEK',
          reason: `Inspected TOP element arr[${topIdx}] = ${topVal} in O(1) time without modifying stack state.${
            isMinStack ? ` Current minimum: ${state.minStackData[state.minStackData.length - 1]}.` : ''
          }`,
        },
      }));

      setTimeout(() => {
        if (get().stackHighlightIdx === topIdx) {
          set({ stackHighlightIdx: null });
        }
      }, 1200);
    } else if (action === 'clear') {
      set({
        stackData: [],
        minStackData: [],
        stackHighlightIdx: null,
        status: 'Stack cleared',
        statusColor: '#94a3b8',
        stackNarrative: {
          action: 'clear',
          badge: 'CLEAR',
          reason: 'Cleared all elements from stack memory. top reset to -1.',
        },
      });
    } else if (action === 'fill') {
      const sample = [18, 35, 52, 79];
      let minArr: number[] = [];
      sample.forEach((v) => {
        minArr.push(minArr.length === 0 ? v : Math.min(v, minArr[minArr.length - 1]));
      });
      set((s) => ({
        stackData: sample,
        minStackData: minArr,
        stackHighlightIdx: null,
        metrics: { ...s.metrics, accesses: s.metrics.accesses + 4 },
        status: 'Populated stack with 4 sample elements',
        statusColor: '#10b981',
        stackNarrative: {
          action: 'sample',
          badge: 'SAMPLE',
          reason: 'Populated stack with 4 sample values [18, 35, 52, 79].',
        },
      }));
    } else if (action === 'fillMax') {
      const sample = [12, 24, 36, 48, 60, 72, 84, 96];
      let minArr: number[] = [];
      sample.forEach((v) => {
        minArr.push(minArr.length === 0 ? v : Math.min(v, minArr[minArr.length - 1]));
      });
      set((s) => ({
        stackData: sample,
        minStackData: minArr,
        stackHighlightIdx: null,
        metrics: { ...s.metrics, accesses: s.metrics.accesses + 8 },
        status: 'Filled stack to maximum capacity (8 elements)',
        statusColor: '#3b82f6',
        stackNarrative: {
          action: 'fillMax',
          badge: 'CAPACITY',
          reason: 'Filled stack to maximum capacity (8 elements). Next push will demonstrate Overflow.',
        },
      }));
    }
  },

  queueAction: (action, value) => {
    const state = get();
    const isCircular = state.algo === 'circular_queue';

    if (action === 'enqueue') {
      const num =
        value !== undefined && String(value).trim() !== ''
          ? Number(value)
          : Math.floor(Math.random() * 85) + 12;

      if (!Number.isFinite(num)) {
        set({ status: 'Enter a valid number to enqueue', statusColor: '#f43f5e' });
        return;
      }

      if (isCircular) {
        if (state.queueCount >= STACK_CAPACITY) {
          if (state.soundEnabled) playFrequencyTone(15, 100, 160);
          set({
            status: 'Circular Queue Overflow: Ring buffer is full (8/8)!',
            statusColor: '#f43f5e',
            stackNarrative: {
              action: 'overflow',
              badge: 'OVERFLOW',
              reason: 'Circular Queue Overflow: (rear + 1) % 8 == front. Buffer is completely occupied.',
              isError: true,
            },
          });
          return;
        }

        const newRear = state.queueFront === -1 ? 0 : (state.queueRear + 1) % STACK_CAPACITY;
        const newFront = state.queueFront === -1 ? 0 : state.queueFront;
        const nextData = [...state.queueData];
        nextData[newRear] = num;
        const nextCount = state.queueCount + 1;

        if (state.soundEnabled) playFrequencyTone(num, 100, 75);

        set((s) => ({
          queueData: nextData,
          queueFront: newFront,
          queueRear: newRear,
          queueCount: nextCount,
          stackHighlightIdx: newRear,
          metrics: { ...s.metrics, accesses: s.metrics.accesses + 1 },
          status: `Enqueued ${num} at REAR [slot ${newRear}] via (rear+1)%8`,
          statusColor: '#10b981',
          stackNarrative: {
            action: 'enqueue',
            badge: 'ENQUEUE',
            reason: `Enqueued ${num} at circular slot [${newRear}] via (rear + 1) % 8. Occupancy: ${nextCount}/${STACK_CAPACITY}.`,
          },
        }));

        setTimeout(() => {
          if (get().stackHighlightIdx === newRear) {
            set({ stackHighlightIdx: null });
          }
        }, 900);
      } else {
        // Linear Queue
        if (state.queueRear >= STACK_CAPACITY - 1) {
          if (state.soundEnabled) playFrequencyTone(15, 100, 160);
          const isFalseOverflow = state.queueFront > 0;
          set({
            status: isFalseOverflow
              ? 'Linear Queue False Overflow: rear at limit (7)'
              : 'Queue Overflow: Capacity limit reached (8/8)!',
            statusColor: '#f43f5e',
            stackNarrative: {
              action: 'overflow',
              badge: 'OVERFLOW',
              reason: isFalseOverflow
                ? `False Overflow! rear == 7. Even though slots [0..${state.queueFront - 1}] are freed, linear queues cannot wrap. Switch to Circular Queue to reuse freed memory!`
                : 'Queue Overflow: Cannot enqueue. Memory capacity exhausted (rear == 7).',
              isError: true,
            },
          });
          return;
        }

        const newRear = state.queueRear + 1;
        const newFront = state.queueFront === -1 ? 0 : state.queueFront;
        const nextData = [...state.queueData];
        nextData[newRear] = num;
        const nextCount = state.queueCount + 1;

        if (state.soundEnabled) playFrequencyTone(num, 100, 75);

        set((s) => ({
          queueData: nextData,
          queueFront: newFront,
          queueRear: newRear,
          queueCount: nextCount,
          stackHighlightIdx: newRear,
          metrics: { ...s.metrics, accesses: s.metrics.accesses + 1 },
          status: `Enqueued ${num} at REAR [slot ${newRear}]`,
          statusColor: '#10b981',
          stackNarrative: {
            action: 'enqueue',
            badge: 'ENQUEUE',
            reason: `Enqueued ${num} at rear slot [${newRear}]. FRONT=[${newFront}], REAR=[${newRear}]. Occupancy: ${nextCount}/${STACK_CAPACITY}.`,
          },
        }));

        setTimeout(() => {
          if (get().stackHighlightIdx === newRear) {
            set({ stackHighlightIdx: null });
          }
        }, 900);
      }
    } else if (action === 'dequeue') {
      if (state.queueCount === 0 || state.queueFront === -1) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: 'Queue Underflow: Cannot dequeue from an empty queue!',
          statusColor: '#f43f5e',
          stackNarrative: {
            action: 'underflow',
            badge: 'UNDERFLOW',
            reason: 'Queue Underflow: Attempted dequeue when queue occupancy is 0 (front == -1).',
            isError: true,
          },
        });
        return;
      }

      const frontIdx = state.queueFront;
      const val = state.queueData[frontIdx];
      const nextData = [...state.queueData];
      nextData[frontIdx] = null;
      const nextCount = state.queueCount - 1;

      let newFront = -1;
      let newRear = state.queueRear;

      if (isCircular) {
        if (state.queueFront === state.queueRear) {
          newFront = -1;
          newRear = -1;
        } else {
          newFront = (state.queueFront + 1) % STACK_CAPACITY;
        }
      } else {
        newFront = frontIdx + 1;
        if (newFront > newRear) {
          newFront = -1;
          newRear = -1;
        }
      }

      if (state.soundEnabled && val !== null) playFrequencyTone(val, 100, 90);

      set((s) => ({
        queueData: nextData,
        queueFront: newFront,
        queueRear: newRear,
        queueCount: nextCount,
        stackHighlightIdx: null,
        metrics: { ...s.metrics, swaps: s.metrics.swaps + 1 },
        status: `Dequeued ${val} from FRONT [was slot ${frontIdx}]`,
        statusColor: '#f59e0b',
        stackNarrative: {
          action: 'dequeue',
          badge: 'DEQUEUE',
          reason: `Dequeued value ${val} from FRONT at slot [${frontIdx}]. FRONT advanced to ${
            newFront >= 0 ? `[${newFront}]` : 'empty (-1)'
          }.`,
        },
      }));
    } else if (action === 'front') {
      if (state.queueCount === 0 || state.queueFront === -1) {
        set({
          status: 'Queue is empty: nothing at FRONT',
          statusColor: '#f43f5e',
          stackNarrative: {
            action: 'front_empty',
            badge: 'EMPTY',
            reason: 'Front inspection failed: queue has 0 elements.',
            isError: true,
          },
        });
        return;
      }

      const frontIdx = state.queueFront;
      const frontVal = state.queueData[frontIdx];

      if (state.soundEnabled && frontVal !== null) playFrequencyTone(frontVal, 100, 120);

      set((s) => ({
        stackHighlightIdx: frontIdx,
        metrics: { ...s.metrics, comparisons: s.metrics.comparisons + 1 },
        status: `FRONT element is ${frontVal} at slot [${frontIdx}]`,
        statusColor: '#3b82f6',
        stackNarrative: {
          action: 'front',
          badge: 'FRONT',
          reason: `Inspected FRONT pointer element arr[${frontIdx}] = ${frontVal} in O(1) time without dequeuing.`,
        },
      }));

      setTimeout(() => {
        if (get().stackHighlightIdx === frontIdx) {
          set({ stackHighlightIdx: null });
        }
      }, 1200);
    } else if (action === 'clear') {
      set({
        queueData: Array(STACK_CAPACITY).fill(null),
        queueFront: -1,
        queueRear: -1,
        queueCount: 0,
        stackHighlightIdx: null,
        status: 'Queue cleared',
        statusColor: '#94a3b8',
        stackNarrative: {
          action: 'clear',
          badge: 'CLEAR',
          reason: 'Cleared all queue slots. FRONT and REAR reset to -1.',
        },
      });
    } else if (action === 'fill') {
      const sample = [15, 32, 48];
      const data: (number | null)[] = Array(STACK_CAPACITY).fill(null);
      sample.forEach((v, i) => (data[i] = v));
      set((s) => ({
        queueData: data,
        queueFront: 0,
        queueRear: 2,
        queueCount: 3,
        stackHighlightIdx: null,
        metrics: { ...s.metrics, accesses: s.metrics.accesses + 3 },
        status: 'Populated queue with 3 sample elements',
        statusColor: '#10b981',
        stackNarrative: {
          action: 'sample',
          badge: 'SAMPLE',
          reason: 'Populated queue with 3 sample items [15, 32, 48]. FRONT=[0], REAR=[2].',
        },
      }));
    } else if (action === 'fillMax') {
      const sample = [11, 22, 33, 44, 55, 66, 77, 88];
      set((s) => ({
        queueData: [...sample],
        queueFront: 0,
        queueRear: 7,
        queueCount: 8,
        stackHighlightIdx: null,
        metrics: { ...s.metrics, accesses: s.metrics.accesses + 8 },
        status: 'Filled queue to maximum capacity (8 elements)',
        statusColor: '#3b82f6',
        stackNarrative: {
          action: 'fillMax',
          badge: 'CAPACITY',
          reason: 'Filled queue to capacity (8 elements). Next enqueue will demonstrate Overflow.',
        },
      }));
    }
  },
  setLinkedListMode: (mode: LinkedListMode) => {
    set({
      llMode: mode,
      llActivePointer: null,
      llPrevPointer: null,
      status: `Switched to ${LINKED_LIST_INFOS[mode].name}`,
      statusColor: '',
      llNarrative: {
        action: 'mode_switch',
        badge: 'PARADIGM',
        reason: LINKED_LIST_INFOS[mode].description || '',
      },
    });
    get().loadInfo(LINKED_LIST_INFOS[mode]);
  },
  llAction: (action, value, index) => {
    const state = get();
    const mode = state.llMode;
    const num = value !== undefined ? Number(value) : NaN;
    const idx = index !== undefined ? Number(index) : NaN;

    if (action === 'insert_head') {
      if (isNaN(num)) {
        set({ status: 'Enter a valid number to insert', statusColor: '#f43f5e' });
        return;
      }
      if (state.llData.length >= LINKED_LIST_CAPACITY) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: `Capacity Limit Reached (${LINKED_LIST_CAPACITY}/${LINKED_LIST_CAPACITY})!`,
          statusColor: '#f43f5e',
          llNarrative: {
            action: 'overflow',
            badge: 'OVERFLOW',
            reason: `Visualizer capacity capped at ${LINKED_LIST_CAPACITY} nodes for clean horizontal rendering. Delete a node or clear list to add more.`,
            isError: true,
          },
        });
        return;
      }

      const nextData = [num, ...state.llData];
      if (state.soundEnabled) playFrequencyTone(num, 100, 80);
      set({
        llData: nextData,
        llActivePointer: 0,
        llPrevPointer: null,
        metrics: { ...state.metrics, accesses: state.metrics.accesses + 1 },
        status: `Inserted ${num} at Head`,
        statusColor: '#10b981',
        llNarrative: {
          action: 'insert_head',
          badge: 'INSERT HEAD',
          reason: `Created new node(${num}). Set node.next = Head (${state.llData[0] ?? 'null'}); Head now points to node(${num}) in O(1) time.`,
        },
      });
      setTimeout(() => {
        if (get().llActivePointer === 0) set({ llActivePointer: null });
      }, 900);
    } else if (action === 'insert_tail') {
      if (isNaN(num)) {
        set({ status: 'Enter a valid number to insert', statusColor: '#f43f5e' });
        return;
      }
      if (state.llData.length >= LINKED_LIST_CAPACITY) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: `Capacity Limit Reached (${LINKED_LIST_CAPACITY}/${LINKED_LIST_CAPACITY})!`,
          statusColor: '#f43f5e',
          llNarrative: {
            action: 'overflow',
            badge: 'OVERFLOW',
            reason: `Visualizer capacity capped at ${LINKED_LIST_CAPACITY} nodes for clean horizontal rendering. Delete a node or clear list to add more.`,
            isError: true,
          },
        });
        return;
      }

      const nextData = [...state.llData, num];
      const newIdx = nextData.length - 1;
      if (state.soundEnabled) playFrequencyTone(num, 100, 80);
      set({
        llData: nextData,
        llActivePointer: newIdx,
        llPrevPointer: newIdx > 0 ? newIdx - 1 : null,
        metrics: { ...state.metrics, accesses: state.metrics.accesses + 1 },
        status: `Inserted ${num} at Tail`,
        statusColor: '#10b981',
        llNarrative: {
          action: 'insert_tail',
          badge: 'INSERT TAIL',
          reason: mode === 'doubly'
            ? `Attached node(${num}) to Tail in O(1) time using tail.next = node and node.prev = tail.`
            : mode === 'circular'
            ? `Appended node(${num}) at Tail and closed the ring: node.next points back to Head (${nextData[0]}).`
            : `Traversed list to tail node. Spliced tail.next = node(${num}) and node.next = null in O(n) time.`,
        },
      });
      setTimeout(() => {
        if (get().llActivePointer === newIdx) set({ llActivePointer: null, llPrevPointer: null });
      }, 900);
    } else if (action === 'insert_at') {
      if (isNaN(num)) {
        set({ status: 'Enter a valid number to insert', statusColor: '#f43f5e' });
        return;
      }
      if (state.llData.length >= LINKED_LIST_CAPACITY) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: `Capacity Limit Reached (${LINKED_LIST_CAPACITY}/${LINKED_LIST_CAPACITY})!`,
          statusColor: '#f43f5e',
          llNarrative: {
            action: 'overflow',
            badge: 'OVERFLOW',
            reason: `Visualizer capacity capped at ${LINKED_LIST_CAPACITY} nodes. Cannot insert at index.`,
            isError: true,
          },
        });
        return;
      }

      const insertIdx = isNaN(idx) ? 0 : Math.max(0, Math.min(idx, state.llData.length));
      const nextData = [...state.llData];
      nextData.splice(insertIdx, 0, num);
      if (state.soundEnabled) playFrequencyTone(num, 100, 80);
      set({
        llData: nextData,
        llActivePointer: insertIdx,
        llPrevPointer: insertIdx > 0 ? insertIdx - 1 : null,
        metrics: { ...state.metrics, accesses: state.metrics.accesses + insertIdx + 1 },
        status: `Inserted ${num} at index [${insertIdx}]`,
        statusColor: '#10b981',
        llNarrative: {
          action: 'insert_at',
          badge: 'INSERT AT',
          reason: `Traversed ${insertIdx} step(s) to position [${insertIdx}]. Re-pointed predecessor next to node(${num}) and node.next to successor.`,
        },
      });
      setTimeout(() => {
        if (get().llActivePointer === insertIdx) set({ llActivePointer: null, llPrevPointer: null });
      }, 900);
    } else if (action === 'delete') {
      if (state.llData.length === 0) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: 'Underflow: List is empty!',
          statusColor: '#f43f5e',
          llNarrative: {
            action: 'underflow',
            badge: 'EMPTY',
            reason: 'Cannot delete from an empty list (Head == null).',
            isError: true,
          },
        });
        return;
      }

      const targetVal = num;
      const targetIdx = state.llData.indexOf(targetVal);
      if (targetIdx === -1) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: `Value ${targetVal} not found in list`,
          statusColor: '#f43f5e',
          llNarrative: {
            action: 'delete_fail',
            badge: 'NOT FOUND',
            reason: `Traversed complete list (${state.llData.length} nodes). Node with value ${targetVal} does not exist.`,
            isError: true,
          },
        });
        return;
      }

      const nextData = [...state.llData];
      nextData.splice(targetIdx, 1);
      if (state.soundEnabled) playFrequencyTone(targetVal, 100, 95);
      set({
        llData: nextData,
        llActivePointer: targetIdx < nextData.length ? targetIdx : null,
        llPrevPointer: targetIdx > 0 ? targetIdx - 1 : null,
        metrics: { ...state.metrics, swaps: state.metrics.swaps + 1, accesses: state.metrics.accesses + targetIdx + 1 },
        status: `Deleted node(${targetVal}) at index [${targetIdx}]`,
        statusColor: '#f59e0b',
        llNarrative: {
          action: 'delete',
          badge: 'DELETE',
          reason: `Located node(${targetVal}) at index [${targetIdx}]. Bypassed node pointer: predecessor.next now points directly to successor.`,
        },
      });
      setTimeout(() => {
        set({ llActivePointer: null, llPrevPointer: null });
      }, 900);
    } else if (action === 'delete_head') {
      if (state.llData.length === 0) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: 'Underflow: List is empty!',
          statusColor: '#f43f5e',
          llNarrative: { action: 'underflow', badge: 'EMPTY', reason: 'Cannot delete head from an empty list.', isError: true },
        });
        return;
      }
      const removed = state.llData[0];
      const nextData = state.llData.slice(1);
      if (state.soundEnabled) playFrequencyTone(removed, 100, 95);
      set({
        llData: nextData,
        llActivePointer: 0,
        llPrevPointer: null,
        metrics: { ...state.metrics, accesses: state.metrics.accesses + 1 },
        status: `Removed Head node(${removed})`,
        statusColor: '#f59e0b',
        llNarrative: {
          action: 'delete_head',
          badge: 'DELETE HEAD',
          reason: `Removed head node(${removed}) in O(1) time. Head now points to successor (${nextData[0] ?? 'null'}).`,
        },
      });
      setTimeout(() => { set({ llActivePointer: null }); }, 800);
    } else if (action === 'delete_tail') {
      if (state.llData.length === 0) {
        if (state.soundEnabled) playFrequencyTone(10, 100, 160);
        set({
          status: 'Underflow: List is empty!',
          statusColor: '#f43f5e',
          llNarrative: { action: 'underflow', badge: 'EMPTY', reason: 'Cannot delete tail from an empty list.', isError: true },
        });
        return;
      }
      const removed = state.llData[state.llData.length - 1];
      const nextData = state.llData.slice(0, -1);
      if (state.soundEnabled) playFrequencyTone(removed, 100, 95);
      set({
        llData: nextData,
        llActivePointer: nextData.length - 1 >= 0 ? nextData.length - 1 : null,
        llPrevPointer: null,
        metrics: { ...state.metrics, accesses: state.metrics.accesses + state.llData.length },
        status: `Removed Tail node(${removed})`,
        statusColor: '#f59e0b',
        llNarrative: {
          action: 'delete_tail',
          badge: 'DELETE TAIL',
          reason: mode === 'doubly'
            ? `Removed tail node(${removed}) in O(1) time via tail.prev reference.`
            : `Traversed to (tail - 1) node and set next = null in O(n) time.`,
        },
      });
      setTimeout(() => { set({ llActivePointer: null }); }, 800);
    } else if (action === 'fill_sample') {
      const sample = [12, 35, 64, 88];
      set({
        llData: sample,
        llActivePointer: null,
        llPrevPointer: null,
        status: 'Loaded sample list (4 nodes)',
        statusColor: '#38bdf8',
        llNarrative: {
          action: 'sample',
          badge: 'SAMPLE',
          reason: 'Loaded standard 4-node test dataset. Ready for operations.',
        },
      });
    } else if (action === 'fill_max') {
      const full = [10, 20, 30, 40, 50, 60, 70, 80];
      set({
        llData: full,
        llActivePointer: null,
        llPrevPointer: null,
        status: 'Filled list to maximum capacity (8 nodes)',
        statusColor: '#3b82f6',
        llNarrative: {
          action: 'fill_max',
          badge: 'CAPACITY',
          reason: 'Loaded 8 nodes (maximum capacity limit). Next insertion will demonstrate Overflow guard.',
        },
      });
    } else if (action === 'clear') {
      set({
        llData: [],
        llActivePointer: null,
        llPrevPointer: null,
        status: 'List cleared',
        statusColor: '',
        llNarrative: {
          action: 'clear',
          badge: 'CLEARED',
          reason: 'Cleared all node references. Head = null. Memory deallocated.',
        },
      });
    }
  },
  llSearch: async (target: number) => {
    const state = get();
    const data = state.llData;
    if (data.length === 0) {
      if (state.soundEnabled) playFrequencyTone(10, 100, 160);
      set({
        status: 'Search failed: List is empty!',
        statusColor: '#f43f5e',
        llNarrative: { action: 'search_fail', badge: 'EMPTY', reason: 'Cannot search an empty linked list.', isError: true },
      });
      return false;
    }

    set((s) => ({
      llTraversals: s.llTraversals + 1,
      status: `Searching for key ${target}...`,
      statusColor: '#38bdf8',
    }));

    for (let i = 0; i < data.length; i++) {
      const val = data[i];
      if (get().soundEnabled) playFrequencyTone(val, 100, 50);
      set({
        llActivePointer: i,
        llPrevPointer: i > 0 ? i - 1 : null,
        llNarrative: {
          action: 'probing',
          badge: 'TRAVERSE',
          reason: `Inspecting node [${i}] = ${val}. Comparing against search key ${target}...`,
        },
      });
      await new Promise((res) => setTimeout(res, 380));

      if (val === target) {
        if (get().soundEnabled) playFrequencyTone(target, 100, 140);
        set({
          status: `Found key ${target} at node index [${i}]!`,
          statusColor: '#10b981',
          llNarrative: {
            action: 'found',
            badge: 'FOUND',
            reason: `Target ${target} matched node at index [${i}] in ${i + 1} pointer hop(s)! Time complexity: O(${i + 1}).`,
          },
        });
        setTimeout(() => { set({ llActivePointer: null, llPrevPointer: null }); }, 1500);
        return true;
      }
    }

    if (get().soundEnabled) playFrequencyTone(10, 100, 160);
    set({
      status: `Key ${target} not found in list`,
      statusColor: '#f43f5e',
      llNarrative: {
        action: 'not_found',
        badge: 'NOT FOUND',
        reason: state.llMode === 'circular'
          ? `Traversed all ${data.length} nodes and looped back to Head. Key ${target} does not exist in list.`
          : `Reached end of list (next == null) after ${data.length} hops. Key ${target} does not exist.`,
        isError: true,
      },
    });
    setTimeout(() => { set({ llActivePointer: null, llPrevPointer: null }); }, 1200);
    return false;
  },
  llReverse: async () => {
    const state = get();
    const data = [...state.llData];
    if (data.length <= 1) {
      set({
        status: 'List has <= 1 nodes; reverse is trivial',
        statusColor: '',
        llNarrative: { action: 'reverse', badge: 'REVERSED', reason: 'List of size <= 1 remains identical when reversed.' },
      });
      return;
    }

    set({
      status: 'Reversing linked list pointers in-place...',
      statusColor: '#a855f7',
      llNarrative: {
        action: 'reversing',
        badge: 'REVERSING',
        reason: 'Classical in-place pointer reversal: prev = null, curr = head. Splicing curr.next = prev on each hop.',
      },
    });

    for (let i = 0; i < data.length; i++) {
      set({ llActivePointer: i, llPrevPointer: i > 0 ? i - 1 : null });
      if (get().soundEnabled) playFrequencyTone(data[i], 100, 60);
      await new Promise((res) => setTimeout(res, 280));
    }

    data.reverse();
    if (get().soundEnabled) playFrequencyTone(80, 100, 120);
    set({
      llData: data,
      llActivePointer: 0,
      llPrevPointer: null,
      status: 'Linked list successfully reversed',
      statusColor: '#10b981',
      llNarrative: {
        action: 'reversed',
        badge: 'REVERSED',
        reason: `Reversal complete in O(n) time and O(1) auxiliary space. Previous Tail (${data[0]}) is now new Head.`,
      },
    });
    setTimeout(() => { set({ llActivePointer: null }); }, 1200);
  },
  setBst: (bst) => set({ bst }),
  setBSTMode: (mode) => {
    set({
      bstMode: mode,
      bstActiveNodes: [],
      bstFoundNode: null,
      bstTraversalOutput: null,
      status: `Switched to ${BST_INFOS[mode]?.name || 'Binary Search Tree'}`,
      statusColor: '',
      bstNarrative: {
        action: 'mode_switch',
        badge: 'PARADIGM',
        reason: BST_INFOS[mode]?.description || 'Binary Search Tree mode selected.',
      },
    });
    if (BST_INFOS[mode]) {
      get().loadInfo(BST_INFOS[mode]);
    }
  },
  bstInsert: (val) => {
    const num = Number(val);
    if (!Number.isFinite(num)) {
      set({
        status: 'Enter a valid number to insert',
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'error',
          badge: 'INVALID',
          reason: 'Input is not a valid integer. Enter a numeric key between 0 and 999.',
          isError: true,
        },
      });
      return false;
    }

    let tree = get().bst;
    if (!tree) {
      tree = new BST();
    }

    if (tree.getNodeCount() >= BST_CAPACITY) {
      if (get().soundEnabled) playFrequencyTone(15, 100, 160);
      set({
        status: `Tree at capacity: Cannot exceed maximum ${BST_CAPACITY} nodes!`,
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'overflow',
          badge: 'CAPACITY',
          reason: `Tree capacity limit reached (${BST_CAPACITY} nodes). Remove nodes before inserting new keys.`,
          isError: true,
        },
      });
      return false;
    }

    const res = tree.insert(num);
    if (!res.success) {
      if (get().soundEnabled) playFrequencyTone(20, 100, 140);
      set({
        status: `Key ${num} already exists in BST!`,
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'duplicate',
          badge: 'DUPLICATE',
          reason: `Duplicate key ${num} rejected. Standard BST invariant requires all keys to be unique.`,
          isError: true,
        },
      });
      return false;
    }

    if (get().soundEnabled) playFrequencyTone(num, 100, 75);

    const cloned = Object.assign(new BST(), tree);
    set((s) => ({
      bst: cloned,
      bstActiveNodes: [num],
      bstFoundNode: null,
      metrics: {
        ...s.metrics,
        accesses: s.metrics.accesses + 1,
        comparisons: s.metrics.comparisons + cloned.getHeight(),
      },
      status: `Inserted ${num} into BST`,
      statusColor: '#10b981',
      bstNarrative: {
        action: 'insert',
        badge: 'INSERT',
        reason: `Inserted key ${num}. Tree depth: ${cloned.getHeight()}, node count: ${cloned.getNodeCount()}/${BST_CAPACITY}.`,
      },
    }));

    setTimeout(() => {
      if (get().bstActiveNodes.includes(num)) {
        set({ bstActiveNodes: [] });
      }
    }, 900);

    return true;
  },
  bstDelete: (val) => {
    const num = Number(val);
    const tree = get().bst;
    if (!tree || !tree.root) {
      set({
        status: 'BST is empty: nothing to delete',
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'underflow',
          badge: 'EMPTY',
          reason: 'Cannot delete from empty tree. Tree contains 0 nodes.',
          isError: true,
        },
      });
      return false;
    }

    const removed = tree.remove(num);
    if (!removed) {
      if (get().soundEnabled) playFrequencyTone(20, 100, 140);
      set({
        status: `Key ${num} not found in BST`,
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'not_found',
          badge: 'MISS',
          reason: `Cannot delete key ${num}: key does not exist in the BST.`,
          isError: true,
        },
      });
      return false;
    }

    if (get().soundEnabled) playFrequencyTone(num, 100, 60);

    const cloned = Object.assign(new BST(), tree);
    set((s) => ({
      bst: cloned,
      bstActiveNodes: [],
      bstFoundNode: null,
      metrics: { ...s.metrics, accesses: s.metrics.accesses + 1 },
      status: `Deleted ${num} from BST`,
      statusColor: '#10b981',
      bstNarrative: {
        action: 'delete',
        badge: 'DELETE',
        reason: `Removed key ${num}. Remaining nodes: ${cloned.getNodeCount()}. Subtree pointers updated.`,
      },
    }));

    return true;
  },
  bstSearch: async (target) => {
    const num = Number(target);
    const tree = get().bst;
    if (!tree || !tree.root) {
      set({
        status: 'BST is empty: search aborted',
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'underflow',
          badge: 'EMPTY',
          reason: 'Tree is empty. Cannot search.',
          isError: true,
        },
      });
      return false;
    }

    const { path, found } = tree.searchPath(num);
    set({ bstFoundNode: null, bstActiveNodes: [] });

    for (let i = 0; i < path.length; i++) {
      const cur = path[i];
      const isLast = i === path.length - 1;
      const isMatch = isLast && found;

      set((s) => ({
        bstActiveNodes: [cur],
        metrics: {
          ...s.metrics,
          comparisons: s.metrics.comparisons + 1,
          accesses: s.metrics.accesses + 1,
        },
        status: isMatch
          ? `Found ${num} at node!`
          : `Comparing ${num} with ${cur}: ${num < cur ? `${num} < ${cur}, branch left` : `${num} > ${cur}, branch right`}`,
        statusColor: isMatch ? '#10b981' : '#3b82f6',
        bstNarrative: {
          action: 'compare',
          badge: 'COMPARE',
          reason: isMatch
            ? `Target ${num} matches current node ${cur}. Value found!`
            : `Inspecting node ${cur}. Target ${num} is ${num < cur ? `less than ${cur}, descending to left subtree` : `greater than ${cur}, descending to right subtree`}.`,
        },
      }));

      if (get().soundEnabled) playFrequencyTone(cur, 100, 60);
      await new Promise((r) => setTimeout(r, 420));
    }

    if (found) {
      if (get().soundEnabled) playFrequencyTone(num + 30, 100, 150);
      set({
        bstFoundNode: num,
        bstActiveNodes: [],
        status: `Found key ${num} in ${path.length} comparison${path.length > 1 ? 's' : ''}`,
        statusColor: '#10b981',
        bstNarrative: {
          action: 'found',
          badge: 'FOUND',
          reason: `Found key ${num} successfully after traversing ${path.length} node${path.length > 1 ? 's' : ''} [${path.join(' → ')}].`,
        },
      });
      setTimeout(() => {
        if (get().bstFoundNode === num) {
          set({ bstFoundNode: null });
        }
      }, 2000);
      return true;
    } else {
      if (get().soundEnabled) playFrequencyTone(20, 100, 150);
      set({
        bstFoundNode: null,
        bstActiveNodes: [],
        status: `Key ${num} not found in BST`,
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'not_found',
          badge: 'NOT FOUND',
          reason: `Key ${num} was not found in the BST. Reached null child after path [${path.join(' → ')}].`,
          isError: true,
        },
      });
      return false;
    }
  },
  bstRunTraversal: async (type) => {
    const tree = get().bst;
    if (!tree || !tree.root) {
      set({
        status: 'BST is empty: cannot traverse',
        statusColor: '#f43f5e',
        bstNarrative: {
          action: 'underflow',
          badge: 'EMPTY',
          reason: 'Tree is empty. Cannot run traversal.',
          isError: true,
        },
      });
      return [];
    }

    const tMode = type || get().bstMode;
    let sequence: number[] = [];
    let title = 'In-Order';
    if (tMode === 'preorder') {
      sequence = tree.preorder();
      title = 'Pre-Order (Root → L → R)';
    } else if (tMode === 'postorder') {
      sequence = tree.postorder();
      title = 'Post-Order (L → R → Root)';
    } else if (tMode === 'levelorder') {
      sequence = tree.levelOrder();
      title = 'Level-Order (BFS)';
    } else {
      sequence = tree.inorder();
      title = 'In-Order (L → Root → R)';
    }

    set({
      bstTraversalOutput: [],
      bstActiveNodes: [],
      bstFoundNode: null,
      status: `Starting ${title} traversal...`,
      statusColor: '#3b82f6',
      bstNarrative: {
        action: 'traversal_start',
        badge: 'TRAVERSAL',
        reason: `Starting ${title} traversal across ${sequence.length} nodes.`,
      },
    });

    const accumulated: number[] = [];
    for (let i = 0; i < sequence.length; i++) {
      const val = sequence[i];
      accumulated.push(val);
      set((s) => ({
        bstActiveNodes: [val],
        bstTraversalOutput: [...accumulated],
        metrics: { ...s.metrics, accesses: s.metrics.accesses + 1 },
        status: `Visiting node ${val} (${i + 1}/${sequence.length})`,
        statusColor: '#3b82f6',
        bstNarrative: {
          action: 'visit',
          badge: `NODE ${i + 1}/${sequence.length}`,
          reason: `Visited node ${val}. Current sequence output: [${accumulated.join(', ')}].`,
        },
      }));

      if (get().soundEnabled) playFrequencyTone(val, 100, 60);
      await new Promise((r) => setTimeout(r, 340));
    }

    set({
      bstActiveNodes: [],
      status: `Completed ${title} traversal: [${accumulated.join(', ')}]`,
      statusColor: '#10b981',
      bstNarrative: {
        action: 'complete',
        badge: 'COMPLETE',
        reason: `${title} complete: visited all ${sequence.length} nodes. Output sequence: [${accumulated.join(', ')}].`,
      },
    });

    return sequence;
  },
  bstFindMin: () => {
    const tree = get().bst;
    if (!tree || !tree.root) return null;
    let cur = tree.root;
    const spine: number[] = [];
    while (cur) {
      spine.push(cur.val);
      if (!cur.left) break;
      cur = cur.left;
    }
    const minVal = cur.val;
    set({
      bstActiveNodes: spine,
      bstFoundNode: minVal,
      status: `Minimum key is ${minVal} (leftmost leaf)`,
      statusColor: '#10b981',
      bstNarrative: {
        action: 'min',
        badge: 'MINIMUM',
        reason: `Traversed leftmost spine [${spine.join(' → ')}]. Found minimum key ${minVal} with no left child.`,
      },
    });
    if (get().soundEnabled) playFrequencyTone(minVal, 100, 100);
    setTimeout(() => {
      set({ bstActiveNodes: [], bstFoundNode: null });
    }, 2000);
    return minVal;
  },
  bstFindMax: () => {
    const tree = get().bst;
    if (!tree || !tree.root) return null;
    let cur = tree.root;
    const spine: number[] = [];
    while (cur) {
      spine.push(cur.val);
      if (!cur.right) break;
      cur = cur.right;
    }
    const maxVal = cur.val;
    set({
      bstActiveNodes: spine,
      bstFoundNode: maxVal,
      status: `Maximum key is ${maxVal} (rightmost leaf)`,
      statusColor: '#10b981',
      bstNarrative: {
        action: 'max',
        badge: 'MAXIMUM',
        reason: `Traversed rightmost spine [${spine.join(' → ')}]. Found maximum key ${maxVal} with no right child.`,
      },
    });
    if (get().soundEnabled) playFrequencyTone(maxVal, 100, 100);
    setTimeout(() => {
      set({ bstActiveNodes: [], bstFoundNode: null });
    }, 2000);
    return maxVal;
  },
  bstLoadPreset: (preset) => {
    const tree = new BST();
    const values =
      preset === 'balanced'
        ? [50, 25, 75, 12, 36, 62, 88]
        : [10, 20, 30, 40, 50];

    values.forEach((v) => tree.insert(v));

    set({
      bst: tree,
      bstActiveNodes: [],
      bstFoundNode: null,
      bstTraversalOutput: null,
      metrics: { comparisons: 0, swaps: 0, accesses: values.length },
      status: `Loaded ${preset} BST preset (${values.length} nodes)`,
      statusColor: '#10b981',
      bstNarrative: {
        action: 'preset',
        badge: preset.toUpperCase(),
        reason:
          preset === 'balanced'
            ? 'Loaded balanced tree preset with optimal O(log n) height.'
            : 'Loaded degenerate skewed tree preset demonstrating O(n) worst-case degradation.',
      },
    });
  },
  setHeap: (heap) => set({ heap }),
  setHeapType: (type) => set({ heapType: type }),

  // Graph
  graphAlgo: 'bfs',
  graphStart: 0,
  graphTarget: 5,
  setGraphAlgo: (algo) => set({ graphAlgo: algo }),
  setGraphStart: (id) => set({ graphStart: id }),
  setGraphTarget: (id) => set({ graphTarget: id }),

  // DP
  dpAlgo: 'lcs',
  dpConfig: {
    s1: 'ABCBDAB',
    s2: 'BDCAB',
    items: [
      { w: 2, v: 6 },
      { w: 2, v: 10 },
      { w: 3, v: 12 },
    ],
    capacity: 5,
  },
  dpState: null,
  setDpAlgo: (algo) => set({ dpAlgo: algo }),
  setDpConfig: (config) => set((state) => ({ dpConfig: { ...state.dpConfig, ...config } })),

  // UI
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Custom controls (React element stored for page-specific controls)
  customControls: null,
  setCustomControls: (controls) => set({ customControls: controls }),

  // Page lifecycle
  loadInfo: (info) => {
    set({
      algoName: info.name || '',
      complexityInfo: info.complexity || null,
      pseudocode: info.pseudo || [],
      algoMeta: info as unknown as AlgorithmMeta,
    });
  },
  hidePlayControls: (hide) => set({ hidePlayback: hide }),
  showGenerateButton: (show) => set({ showGenerate: show }),
  stopPlay: () => get().pause(),
  initBST: () => {
    const tree = new BST();
    [50, 25, 75, 12, 36, 62, 88].forEach((v) => tree.insert(v));
    set({
      bst: tree,
      bstMode: 'bst',
      bstActiveNodes: [],
      bstFoundNode: null,
      bstTraversalOutput: null,
      metrics: { comparisons: 0, swaps: 0, accesses: 7 },
      status: 'Ready',
      statusColor: '',
      bstNarrative: {
        action: 'ready',
        badge: 'READY',
        reason: 'Binary Search Tree initialized with 7 balanced nodes. Ready for operations.',
      },
    });
    get().loadInfo(BST_INFOS.bst);
  },
  initHeap: (type) => {
    const heapType = (type === 'maxheap' ? 'max' : 'min') as 'min' | 'max';
    set({ heap: new Heap(heapType), heapType });
  },
  initGraph: () => {
    // Graph uses default nodes/edges, no initialization needed
  },
  initDP: () => {
    // DP uses default config, no initialization needed
  },
  resetStackQueueData: () => {
    const isQueue = get().algo === 'queue' || get().algo === 'circular_queue';
    set({
      stackData: isQueue ? [] : [24, 45, 68],
      minStackData: isQueue ? [] : [24, 24, 24],
      queueData: isQueue
        ? [15, 32, 48, null, null, null, null, null]
        : Array(STACK_CAPACITY).fill(null),
      queueFront: isQueue ? 0 : -1,
      queueRear: isQueue ? 2 : -1,
      queueCount: isQueue ? 3 : 0,
      stackHighlightIdx: null,
      metrics: { comparisons: 0, swaps: 0, accesses: 3 },
      status: 'Ready',
      statusColor: '',
      stackNarrative: {
        action: 'ready',
        badge: 'READY',
        reason: isQueue
          ? 'Initialized queue memory slots. FRONT=[0], REAR=[2]. Ready for operations.'
          : 'Initialized stack memory slots. TOP=[2]. Ready for operations.',
      },
    });
  },
  resetLinkedListData: () => {
    const mode = get().llMode || 'singly';
    set({
      llData: [12, 35, 64, 88],
      llActivePointer: null,
      llPrevPointer: null,
      llTraversals: 0,
      metrics: { comparisons: 0, swaps: 0, accesses: 4 },
      status: 'Ready',
      statusColor: '',
      llNarrative: {
        action: 'ready',
        badge: 'READY',
        reason: `Initialized ${LINKED_LIST_INFOS[mode]?.name || 'Linked List'} with 4 sample nodes. Ready for operations.`,
      },
    });
  },

  // Build steps from current module/algo/data
  buildSteps: () => {
    const { module, algo, arr, target, graphStart, graphTarget, dpConfig, dpAlgo } = get();
    let newSteps: Step[] = [];

    try {
      if (module === 'sorting' && SORTING_ALGORITHMS[algo]?.generator) {
        newSteps = [...SORTING_ALGORITHMS[algo].generator!(arr)] as Step[];
      } else if (module === 'searching' && SEARCHING_ALGORITHMS[algo]?.generator) {
        newSteps = [...SEARCHING_ALGORITHMS[algo].generator!(arr, target)] as Step[];
      } else if (module === 'graph') {
        const gen = algo === 'bfs' ? bfsGen : algo === 'dfs' ? dfsGen : dijkstraGen;
        newSteps = [...gen(DEFAULT_NODES, DEFAULT_EDGES, graphStart, graphTarget)] as Step[];
      } else if (module === 'dp' && DP_ALGORITHMS[dpAlgo]?.generator) {
        if (dpAlgo === 'lcs') {
          newSteps = [...DP_ALGORITHMS[dpAlgo].generator!(dpConfig.s1, dpConfig.s2)] as Step[];
        } else {
          newSteps = [...DP_ALGORITHMS[dpAlgo].generator!(dpConfig.items, dpConfig.capacity)] as Step[];
        }
      }
    } catch (e) {
      console.error('Error building steps:', e);
    }

    set({ steps: newSteps, stepIdx: 0 });
    get().resetMetrics();
  },

  play: () => {
    const state = get();
    if (state.playing) return;

    if (state.steps.length === 0) {
      get().buildSteps();
    }

    if (state.stepIdx >= state.steps.length && state.steps.length > 0) {
      set({ stepIdx: 0 });
      get().resetMetrics();
    }

    set({ playing: true });

    playbackTimer = setInterval(() => {
      const { stepIdx, steps, addMetricDelta } = get();
      if (stepIdx >= steps.length) {
        get().pause();
        get().setStatus('Complete', '#10b981');
        return;
      }

      const step = steps[stepIdx];
      if (step && 'metrics' in step && step.metrics) {
        addMetricDelta(step.metrics);
      }

      // Update currentLine for pseudocode highlighting
      if (step && 'line' in step) {
        set({ currentLine: (step as { line: number }).line });
      }

      set({ stepIdx: stepIdx + 1, status: `Step ${stepIdx + 1} / ${steps.length}` });
    }, Math.round(1200 / get().speed));
  },

  pause: () => {
    if (playbackTimer) {
      clearInterval(playbackTimer);
      playbackTimer = null;
    }
    set({ playing: false });
  },

  stepForward: () => {
    const { stepIdx, steps, addMetricDelta } = get();

    if (steps.length === 0) {
      get().buildSteps();
    }

    const currentSteps = get().steps;
    const currentIdx = get().stepIdx;

    if (currentIdx < currentSteps.length) {
      const step = currentSteps[currentIdx];
      if (step && 'metrics' in step && step.metrics) {
        addMetricDelta(step.metrics);
      }
      if (step && 'line' in step) {
        set({ currentLine: (step as { line: number }).line });
      }
      set({ stepIdx: currentIdx + 1, status: `Step ${currentIdx + 1} / ${currentSteps.length}` });
    }
  },

  reset: () => {
    get().pause();
    set({ stepIdx: 0, currentLine: -1 });
    get().resetMetrics();
  },

  setSpeed: (speed) => {
    set({ speed });
    const { playing } = get();
    if (playing) {
      get().pause();
      get().play();
    }
  },
}));
