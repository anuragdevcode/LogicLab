import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const Sidebar: React.FC = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const navGroups = [
    {
      title: 'Algorithms',
      links: [
        {
          to: '/sorting',
          label: 'Sorting Algorithms',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          ),
        },
        {
          to: '/searching',
          label: 'Searching',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Data Structures',
      links: [
        {
          to: '/stack',
          label: 'Stack & Queue',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ),
        },
        {
          to: '/linkedlist',
          label: 'Linked List',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          ),
        },
        {
          to: '/bst',
          label: 'Binary Search Tree',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0-16a3 3 0 100-6 3 3 0 000 6zm-7 16a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6zM5 14l7-7 7 7" />
            </svg>
          ),
        },
        {
          to: '/heap',
          label: 'Heap / HeapSort',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Advanced',
      links: [
        {
          to: '/graph',
          label: 'Graph Traversal',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          ),
        },
        {
          to: '/dp',
          label: 'DP Visualizer',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-60 bg-surface border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 rounded-md bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-mono font-bold text-sm">
              LL
            </div>
            <div>
              <div className="text-textPrimary font-bold text-sm tracking-tight font-sans">LogicLab</div>
              <div className="text-textSecondary/60 text-[9px] tracking-wider uppercase font-mono">Algorithm Visualizer</div>
            </div>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-textSecondary hover:text-white p-1 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-[10px] font-semibold text-textSecondary/70 uppercase tracking-[0.15em] mb-2 px-3 font-mono">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.links.map((link) => (
                  <motion.div
                    key={link.to}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.12 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `nav-btn flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-accent text-white font-medium shadow-sm'
                            : 'text-textSecondary hover:text-textPrimary hover:bg-white/[0.04]'
                        }`
                      }
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="opacity-80">{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 text-center text-[10px] font-mono text-textSecondary/50">
          Made by Anurag
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
