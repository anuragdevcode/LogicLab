import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { HeapView } from '@/components/visualizers/HeapView';
import HeapControls from '@/components/controls/HeapControls';
import { HEAP_INFOS } from '@/engines';

export default function HeapPage() {
  const setModule = useAppStore((s) => s.setModule);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const initHeap = useAppStore((s) => s.initHeap);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const hidePlayControls = useAppStore((s) => s.hidePlayControls);
  const showGenerateButton = useAppStore((s) => s.showGenerateButton);
  const pause = useAppStore((s) => s.pause);
  const setModuleTitle = useAppStore((s) => s.setModuleTitle);
  const setAlgoList = useAppStore((s) => s.setAlgoList);
  const setCustomControls = useAppStore((s) => s.setCustomControls);

  useEffect(() => {
    setModule('heap');
    setAlgo('minheap');
    setModuleTitle('Heap / Priority Queue');
    setAlgoList([
      { id: 'minheap', name: 'Min Heap' },
      { id: 'maxheap', name: 'Max Heap' },
      { id: 'heapsort', name: 'Heap Sort' },
    ]);
    initHeap('minheap');
    loadInfo(HEAP_INFOS.minheap);
    hidePlayControls(true);
    showGenerateButton(false);
    setCustomControls(<HeapControls />);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return <HeapView />;
}
