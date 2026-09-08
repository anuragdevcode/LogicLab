import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { TreeCanvas } from '@/components/canvas/TreeCanvas';
import HeapControls from '@/components/controls/HeapControls';
import { HEAP_INFO } from '@/engines';

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

  useEffect(() => {
    setModule('heap');
    setAlgo('minheap');
    setModuleTitle('Heap / HeapSort');
    setAlgoList([]);
    initHeap('minheap');
    loadInfo(HEAP_INFO['minheap']);
    hidePlayControls(true);
    showGenerateButton(false);

    return () => { pause(); };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <HeapControls />
      <div className="flex-1 relative">
        <TreeCanvas type="heap" />
      </div>
    </div>
  );
}
