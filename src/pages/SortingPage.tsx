import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SortingCanvas } from '@/components/canvas/SortingCanvas';
import ArrayControls from '@/components/controls/ArrayControls';
import { SORTING_ALGORITHMS } from '@/engines';

export default function SortingPage() {
  const setModule = useAppStore((s) => s.setModule);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const generateArray = useAppStore((s) => s.generateArray);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const hidePlayControls = useAppStore((s) => s.hidePlayControls);
  const showGenerateButton = useAppStore((s) => s.showGenerateButton);
  const pause = useAppStore((s) => s.pause);
  const setAlgoList = useAppStore((s) => s.setAlgoList);
  const setModuleTitle = useAppStore((s) => s.setModuleTitle);
  const setCustomControls = useAppStore((s) => s.setCustomControls);

  useEffect(() => {
    setModule('sorting');
    setAlgo('bubble');
    setModuleTitle('Sorting Algorithms');
    setAlgoList(
      Object.entries(SORTING_ALGORITHMS).map(([id, meta]) => ({ id, name: meta.name }))
    );
    loadInfo(SORTING_ALGORITHMS['bubble']);
    hidePlayControls(false);
    showGenerateButton(true);
    setCustomControls(<ArrayControls />);
    generateArray(false);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return <SortingCanvas />;
}
