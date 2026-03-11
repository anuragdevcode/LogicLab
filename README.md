# LogicLab - Web Based Algorithm Visualization Engine

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](#)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5_Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)](#)

## 📌 Overview
Understanding the dynamic, runtime behavior of complex data structures and algorithms is a major hurdle in computer science. Static textbook examples often fail to capture the intricacies of recursion, pointer manipulation, and memory allocation. 

LogicLab is a lightweight, client-side simulation engine designed to solve this. It provides an interactive sandbox to visualize the execution flow of algorithms in real-time, bridging the gap between theoretical concepts and actual machine logic.

## 🚀 Core Features
* **Multi-Module Visualizer:** Supports real-time animations for Sorting arrays, Searching, Stacks, Queues, Linked Lists, Trees, and Graph traversals.
* **Granular Execution Control:** Features a custom playback controller allowing users to pause, play, and step through the algorithm frame-by-frame or adjust the global execution speed.
* **Interactive Data Input:** Users can generate randomized datasets or input custom arrays and edge cases to test how the algorithms respond dynamically.
* **Live Performance Metrics:** Displays real-time analytics including step counts, array swaps, and operation comparisons.

## 🏗️ System Architecture
LogicLab is built with zero backend dependencies, utilizing a strict Model-View-Controller (MVC) design pattern directly in the browser for maximum performance.

* **Frontend Engine:** Vanilla JavaScript (ES6+) handling the core algorithm logic and state management.
* **Rendering:** HTML5 Canvas API is utilized for rendering complex, non-linear node relationships (Trees, Graphs), while standard DOM manipulation handles linear arrays.
* **UI/UX:** Responsive, modern interface built with raw CSS3 (Grid/Flexbox).
