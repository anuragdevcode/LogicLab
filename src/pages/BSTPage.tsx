import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TreeCanvas } from '@/components/canvas/TreeCanvas';
import BSTControls from '@/components/controls/BSTControls';
import { BST_INFO } from '@/engines';

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

  useEffect(() => {
    setModule('bst');
    setAlgo('bst');
    setModuleTitle('Binary Search Tree');
    setAlgoList([]);
    initBST();
    loadInfo(BST_INFO);
    hidePlayControls(true);
    showGenerateButton(false);

    return () => { pause(); };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <BSTControls />
      <div className="flex-1 relative">
        <TreeCanvas type="bst" />
      </div>
    </div>
  );
}
