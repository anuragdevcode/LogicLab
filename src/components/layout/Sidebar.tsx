import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

const Sidebar: React.FC = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  const navGroups = [
    {
      title: 'Algorithms',
      links: [
        { to: '/sorting', icon: '⇅', label: 'Sorting Algorithms' },
        { to: '/searching', icon: '◎', label: 'Searching' },
      ],
    },
    {
      title: 'Data Structures',
      links: [
        { to: '/stack', icon: '▤', label: 'Stack & Queue' },
        { to: '/linkedlist', icon: '⬡', label: 'Linked List' },
        { to: '/bst', icon: '⬡', label: 'Binary Search Tree' },
        { to: '/heap', icon: '△', label: 'Heap / HeapSort' },
      ],
    },
    {
      title: 'Advanced',
      links: [
        { to: '/graph', icon: '◈', label: 'Graph Traversal' },
        { to: '/dp', icon: '⊞', label: 'DP Visualizer' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-60 bg-surface border-r border-surface-tertiary flex flex-col z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-4 border-b border-surface-tertiary">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <span className="text-accent text-2xl">⬡</span>
            <div>
              <div className="text-textPrimary font-bold text-base tracking-tight">LogicLab</div>
              <div className="text-textSecondary text-[10px] tracking-wider uppercase">Algorithm Visualizer</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-[10px] font-semibold text-textSecondary uppercase tracking-[0.15em] mb-2 px-3">
                {group.title}
              </h3>
              <div className="space-y-0.5">
                {group.links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `nav-btn ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-base opacity-70">{link.icon}</span>
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-tertiary text-center text-[10px] text-textSecondary">
          Made by Fantastic 4 · B.Tech CSE
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
