import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import ControlsBar from '@/components/layout/ControlsBar';
import MetricsBar from '@/components/layout/MetricsBar';
import InfoPanel from '@/components/layout/InfoPanel';
import { useAppStore } from '@/store/useAppStore';

import SortingPage from './pages/SortingPage';
import SearchingPage from './pages/SearchingPage';
import StackPage from './pages/StackPage';
import LinkedListPage from './pages/LinkedListPage';
import BSTPage from './pages/BSTPage';
import HeapPage from './pages/HeapPage';
import GraphPage from './pages/GraphPage';
import DPPage from './pages/DPPage';

export default function App() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-textPrimary">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <Topbar />
        <ControlsBar />
        <main className="flex-1 relative overflow-hidden bg-surface-secondary">
          <Routes>
            <Route path="/" element={<Navigate to="/sorting" replace />} />
            <Route path="/sorting" element={<SortingPage />} />
            <Route path="/searching" element={<SearchingPage />} />
            <Route path="/stack" element={<StackPage />} />
            <Route path="/linkedlist" element={<LinkedListPage />} />
            <Route path="/bst" element={<BSTPage />} />
            <Route path="/heap" element={<HeapPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/dp" element={<DPPage />} />
          </Routes>
        </main>
        <MetricsBar />
        <InfoPanel />
      </div>
    </div>
  );
}
