import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import DPTableView from '@/components/visualizers/DPTableView';
import DPControls from '@/components/controls/DPControls';
import { DP_ALGORITHMS } from '@/engines';

export default function DPPage() {
  const setModule = useAppStore((s) => s.setModule);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const hidePlayControls = useAppStore((s) => s.hidePlayControls);
  const showGenerateButton = useAppStore((s) => s.showGenerateButton);
  const pause = useAppStore((s) => s.pause);
  const setModuleTitle = useAppStore((s) => s.setModuleTitle);
  const setAlgoList = useAppStore((s) => s.setAlgoList);
  const setDpAlgo = useAppStore((s) => s.setDpAlgo);
  const setCustomControls = useAppStore((s) => s.setCustomControls);

  useEffect(() => {
    setModule('dp');
    setAlgo('lcs');
    setDpAlgo('lcs');
    setModuleTitle('DP Visualizer');
    setAlgoList(
      Object.entries(DP_ALGORITHMS).map(([id, meta]) => ({ id, name: meta.name }))
    );
    loadInfo(DP_ALGORITHMS['lcs']);
    hidePlayControls(false);
    showGenerateButton(false);
    setCustomControls(<DPControls />);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return <DPTableView />;
}
