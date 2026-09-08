import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TreeCanvas } from '@/components/canvas/TreeCanvas';
import BSTControls from '@/components/controls/BSTControls';
import { BST_INFOS } from '@/engines';

export default function BSTPage() {
  const setModule = useAppStore((s) => s.setModule);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const initBST = useAppStore((s) => s.initBST);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const hidePlayControls = useAppStore((s) => s.hidePlayControls);
  const showGenerateButton = useAppStore((s) => s.showGenerateButton);
  const pause = useAppStore((s) => s.pause);
  const setModuleTitle = useAppStore((s) => s.setModuleTitle);
  const setAlgoList = useAppStore((s) => s.setAlgoList);
  const setCustomControls = useAppStore((s) => s.setCustomControls);

  useEffect(() => {
    setModule('bst');
    setAlgo('bst');
    setModuleTitle('Binary Search Tree');
    setAlgoList([
      { id: 'bst', name: 'Operations' },
      { id: 'inorder', name: 'In-Order' },
      { id: 'preorder', name: 'Pre-Order' },
      { id: 'postorder', name: 'Post-Order' },
      { id: 'levelorder', name: 'Level-Order (BFS)' },
    ]);
    initBST();
    loadInfo(BST_INFOS.bst);
    hidePlayControls(true);
    showGenerateButton(false);
    setCustomControls(<BSTControls />);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col bg-surface">
      <TreeCanvas type="bst" />
    </div>
  );
}
