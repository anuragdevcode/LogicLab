import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import StackView from '@/components/visualizers/StackView';
import StackControls from '@/components/controls/StackControls';
import { STACK_INFO } from '@/engines';

export default function StackPage() {
  const setModule = useAppStore((s) => s.setModule);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const resetStackQueueData = useAppStore((s) => s.resetStackQueueData);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const hidePlayControls = useAppStore((s) => s.hidePlayControls);
  const showGenerateButton = useAppStore((s) => s.showGenerateButton);
  const pause = useAppStore((s) => s.pause);
  const setModuleTitle = useAppStore((s) => s.setModuleTitle);
  const setAlgoList = useAppStore((s) => s.setAlgoList);
  const setCustomControls = useAppStore((s) => s.setCustomControls);

  useEffect(() => {
    setModule('stack');
    setAlgo('stack');
    setModuleTitle('Stack & Queue');
    setAlgoList([
      { id: 'stack', name: 'Stack (LIFO)' },
      { id: 'queue', name: 'Queue (FIFO)' },
      { id: 'circular_queue', name: 'Circular Queue' },
      { id: 'min_stack', name: 'Min Stack' },
    ]);
    resetStackQueueData();
    loadInfo(STACK_INFO);
    hidePlayControls(true);
    showGenerateButton(false);
    setCustomControls(<StackControls />);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return <StackView />;
}
