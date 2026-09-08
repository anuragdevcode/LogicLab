import React from 'react';
import { useAppStore } from '@/store/useAppStore';

const ControlsBar: React.FC = () => {
  const playing = useAppStore((s) => s.playing);
  const play = useAppStore((s) => s.play);
  const pause = useAppStore((s) => s.pause);
  const stepForward = useAppStore((s) => s.stepForward);
  const reset = useAppStore((s) => s.reset);
  const generateArray = useAppStore((s) => s.generateArray);
  const speed = useAppStore((s) => s.speed);
  const setSpeed = useAppStore((s) => s.setSpeed);
  const hidePlayback = useAppStore((s) => s.hidePlayback);
  const showGenerate = useAppStore((s) => s.showGenerate);
  const customControls = useAppStore((s) => s.customControls);

  if (hidePlayback && !customControls) return null;

  const togglePlay = () => {
    if (playing) pause();
    else play();
  };

  return (
    <div className="px-4 py-2.5 border-b border-surface-tertiary bg-surface-secondary flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto" id="custom-controls">
        {customControls}
      </div>

      {!hidePlayback && (
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end flex-wrap">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-xs text-textSecondary font-medium">Speed</span>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-24"
            />
          </div>

          {showGenerate && (
            <button className="btn-secondary text-sm" onClick={() => generateArray()}>
              New Array
            </button>
          )}

          <div className="flex items-center gap-2">
            <button className="btn-primary w-24 flex justify-center" onClick={togglePlay}>
              {playing ? '⏸ Pause' : '▶ Play'}
            </button>
            <button className="btn-secondary" onClick={stepForward} disabled={playing}>
              Step →
            </button>
            <button className="btn-secondary" onClick={reset}>
              ↺ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlsBar;
