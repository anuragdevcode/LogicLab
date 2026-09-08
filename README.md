# LogicLab - Modern Algorithm & Data Structure Visualization Engine

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5_Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)

## 📌 Overview
Understanding the dynamic, runtime behavior of complex data structures and algorithms is a major hurdle in computer science. Static textbook examples often fail to capture the intricacies of recursion, pointer manipulation, and memory allocation. 

**LogicLab** is an interactive, client-side simulation engine designed to solve this. It provides an interactive sandbox to visualize the execution flow of algorithms in real-time, bridging the gap between theoretical concepts and actual machine logic.

Now upgraded to **React 18**, **TypeScript**, and **Tailwind CSS** with **Zustand** state management and **Framer Motion** micro-interactions!

---

## 🚀 Core Features
* **Multi-Module Visualizer:** Supports real-time animations for:
  * **Sorting:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort (Lomuto Partition).
  * **Searching:** Linear Search, Binary Search with low/mid/high pointer annotations.
  * **Data Structures:** Stack (LIFO), Queue (FIFO), Singly Linked List with interactive mutation.
  * **Trees & Heaps:** Binary Search Tree (insert/remove/rebalance layout), Min-Heap & Max-Heap (bubble up/down).
  * **Graph Traversal:** Breadth-First Search (BFS), Depth-First Search (DFS), and Dijkstra's Shortest Path Algorithm on weighted graphs.
  * **Dynamic Programming:** Longest Common Subsequence (LCS) & 0/1 Knapsack problem with live cell computation tables.
* **Granular Playback Controller:** Pause, play, step-by-step frame execution, and a dynamic speed slider (1x–10x).
* **Interactive Data Input:** Generate randomized datasets or specify custom array inputs, key targets, or graph endpoints.
* **Live Performance Metrics:** Real-time analytics tracking comparisons, array swaps, memory accesses, and algorithm status.
* **Pseudocode & Complexity Analysis:** Integrated line-by-line pseudocode tracking synchronized with execution, alongside asymptotic time & space complexity tables.

---

## 🏗️ Modern System Architecture

* **Frontend Framework:** React 18 with TypeScript for type-safe component architecture.
* **State Management:** Zustand store (`src/store/useAppStore.ts`) coordinating playback loops, module switching, and metrics.
* **Styling & Design System:** Tailwind CSS v3 with a custom dark theme palette (`#0b0f19`, `#0f172a`, `#1e293b`) and responsive layout breakpoints.
* **Rendering Pipeline:**
  * **HTML5 Canvas:** Utilized with device-pixel-ratio scaling for linear arrays (Sorting, Searching), tree hierarchies (BST, Heap), and non-linear node graphs (Graph Traversals).
  * **React + Framer Motion:** Fluid animated DOM elements for Stack frames, Queue slots, and Linked List pointer links.
* **Bundler & Tooling:** Vite with zero-latency HMR and fast production builds.

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ and npm installed

### Installation & Development
```bash
# Clone repository
git clone https://github.com/anuragdevcode/LogicLab.git
cd LogicLab

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Type-check and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
LogicLab/
├── src/
│   ├── components/
│   │   ├── canvas/       # Canvas visualizers (Sorting, Searching, Tree, Graph)
│   │   ├── controls/     # Module input controls (Array, Search, Graph, DP, BST, Heap)
│   │   ├── layout/       # App shell (Sidebar, Topbar, ControlsBar, MetricsBar, InfoPanel)
│   │   ├── ui/           # Reusable UI (AlgoTabs, ComplexityTable, PseudocodeBox)
│   │   └── visualizers/  # DOM visualizers (StackView, QueueView, LinkedListView, DPTableView)
│   ├── engines/          # Pure TypeScript algorithm generators (Sorting, Searching, Graph, DP, etc.)
│   ├── hooks/            # Custom hooks (usePlayback, useCanvasSize)
│   ├── pages/            # 8 Module route views
│   ├── store/            # Zustand global application state
│   ├── types/            # TypeScript interfaces & types
│   ├── App.tsx           # Router and root layout
│   ├── main.tsx          # Vite React entry point
│   └── index.css         # Tailwind directives & base styles
├── tailwind.config.js    # Design tokens & color palette
├── vite.config.ts        # Vite configuration with @ path alias
└── tsconfig.json         # TypeScript compiler configuration
```
