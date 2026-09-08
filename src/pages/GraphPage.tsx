import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { GraphCanvas } from '@/components/canvas/GraphCanvas';
import GraphControls from '@/components/controls/GraphControls';
import { GRAPH_INFO } from '@/engines';

export default function GraphPage() {
  const setModule = useAppStore((s) => s.setModule);
  const setAlgo = useAppStore((s) => s.setAlgo);
  const loadInfo = useAppStore((s) => s.loadInfo);
  const hidePlayControls = useAppStore((s) => s.hidePlayControls);
  const showGenerateButton = useAppStore((s) => s.showGenerateButton);
  const pause = useAppStore((s) => s.pause);
  const setModuleTitle = useAppStore((s) => s.setModuleTitle);
  const setAlgoList = useAppStore((s) => s.setAlgoList);
  const setCustomControls = useAppStore((s) => s.setCustomControls);

  useEffect(() => {
    setModule('graph');
    setAlgo('bfs');
    setModuleTitle('Graph Traversal');
    setAlgoList(
      Object.entries(GRAPH_INFO).map(([id, info]) => ({ id, name: info.name }))
    );
    loadInfo(GRAPH_INFO['bfs']);
    hidePlayControls(false);
    showGenerateButton(false);
    setCustomControls(<GraphControls />);

    return () => {
      pause();
      setCustomControls(null);
    };
  }, []);

  return <GraphCanvas />;
}
