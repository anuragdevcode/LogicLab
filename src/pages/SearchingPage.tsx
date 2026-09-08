import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { SearchingCanvas } from '@/components/canvas/SearchingCanvas';
import { SEARCHING_ALGORITHMS } from '@/engines';
import SearchControls from '@/components/controls/SearchControls';

export default function SearchingPage() {
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
    setModule('searching');
    setAlgo('linear');
    setModuleTitle('Searching Algorithms');
    setAlgoList(
      Object.entries(SEARCHING_ALGORITHMS).map(([id, meta]) => ({ id, name: meta.name }))
    );
    loadInfo(SEARCHING_ALGORITHMS['linear']);
    hidePlayControls(false);
    showGenerateButton(true);
    setCustomControls(<SearchControls />);
    generateArray(true);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return <SearchingCanvas />;
}
