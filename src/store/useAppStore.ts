import { create } from 'zustand';
import { ModuleId, Step, Metrics, MetricsDelta, ComplexityInfo, AlgoListItem, AlgorithmMeta } from '@/types';
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
  HEAP_INFO,
} from '@/engines';

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

  // Data structures
  bst: BST | null;
  heap: Heap | null;
  heapType: 'min' | 'max';
  stackData: (string | number)[];
  queueData: (string | number)[];
  llData: number[];

  // Data structure actions
  stackAction: (action: string, value?: string) => void;
  queueAction: (action: string, value?: string) => void;
  llAction: (action: string, value?: string) => void;
  setBst: (bst: BST | null) => void;
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
  resetLinkedListData: () => void;
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
      if (algo === 'queue') {
        get().loadInfo(QUEUE_INFO);
      } else {
        get().loadInfo(STACK_INFO);
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
  heap: null,
  heapType: 'min',
  stackData: [],
  queueData: [],
  llData: [],

  // Data structure actions
  stackAction: (action, value) => {
    set((state) => {
      const data = [...state.stackData];
      if (action === 'push' && value !== undefined) {
        const num = Number(value);
        data.push(isNaN(num) ? value : num);
      } else if (action === 'pop') {
        data.pop();
      }
      // peek is just visual highlight, no state change
      return { stackData: data };
    });
  },
  queueAction: (action, value) => {
    set((state) => {
      const data = [...state.queueData];
      if (action === 'enqueue' && value !== undefined) {
        const num = Number(value);
        data.push(isNaN(num) ? value : num);
      } else if (action === 'dequeue') {
        data.shift();
      }
      return { queueData: data };
    });
  },
  llAction: (action, value) => {
    set((state) => {
      const data = [...state.llData];
      const numVal = value !== undefined ? Number(value) : NaN;
      if (action === 'insert_head' && !isNaN(numVal)) {
        data.unshift(numVal);
      } else if (action === 'insert_tail' && !isNaN(numVal)) {
        data.push(numVal);
      } else if (action === 'delete' && !isNaN(numVal)) {
        const idx = data.indexOf(numVal);
        if (idx !== -1) data.splice(idx, 1);
      } else if (action === 'clear') {
        return { llData: [] };
      }
      return { llData: data };
    });
  },
  setBst: (bst) => set({ bst }),
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
  initBST: () => set({ bst: new BST() }),
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
  resetStackQueueData: () => set({ stackData: [], queueData: [] }),
  resetLinkedListData: () => set({ llData: [] }),

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
