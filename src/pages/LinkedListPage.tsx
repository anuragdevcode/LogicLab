import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import LinkedListView from '@/components/visualizers/LinkedListView';
import LinkedListControls from '@/components/controls/LinkedListControls';
import { SINGLY_LL_INFO } from '@/engines';

export default function LinkedListPage() {
  const setModule = useAppStore((s) => s.setModule);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const resetLinkedListData = useAppStore((s) => s.resetLinkedListData);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const hidePlayControls = useAppStore((s) => s.hidePlayControls);
  const showGenerateButton = useAppStore((s) => s.showGenerateButton);
  const pause = useAppStore((s) => s.pause);
  const setModuleTitle = useAppStore((s) => s.setModuleTitle);
  const setAlgoList = useAppStore((s) => s.setAlgoList);
  const setCustomControls = useAppStore((s) => s.setCustomControls);

  useEffect(() => {
    setModule('linkedlist');
    setAlgo('singly');
    setModuleTitle('Linked List');
    setAlgoList([
      { id: 'singly', name: 'Singly Linked List' },
      { id: 'doubly', name: 'Doubly Linked List' },
      { id: 'circular', name: 'Circular Linked List' },
    ]);
    resetLinkedListData();
    loadInfo(SINGLY_LL_INFO);
    hidePlayControls(true);
    showGenerateButton(false);
    setCustomControls(<LinkedListControls />);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return <LinkedListView />;
}
