import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import LinkedListView from '@/components/visualizers/LinkedListView';
import { LINKED_LIST_INFO } from '@/engines';

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

  useEffect(() => {
    setModule('linkedlist');
    setAlgo('singly');
    setModuleTitle('Linked List');
    setAlgoList([]);
    resetLinkedListData();
    loadInfo(LINKED_LIST_INFO);
    hidePlayControls(true);
    showGenerateButton(false);

    return () => { pause(); };
  }, []);

  return <LinkedListView />;
}
