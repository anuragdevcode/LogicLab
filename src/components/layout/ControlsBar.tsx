import React, { useEffect } from 'react';
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
  const steps = useAppStore((s) => s.steps);
  const stepIdx = useAppStore((s) => s.stepIdx);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const toggleSound = useAppStore((s) => s.toggleSound);

  const togglePlay = () => {
    if (playing) pause();
    else play();
  };

  // Global Keyboard Shortcuts (Space: Play/Pause, ArrowRight: Step, R: Reset, M: Sound)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!playing) stepForward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playing, speed]);

  if (hidePlayback && !customControls) return null;

  const delayMs = Math.round(1200 / speed);

  return (
    <div className="px-4 py-2 border-b border-surface-tertiary bg-surface-secondary flex flex-col lg:flex-row gap-3 items-center justify-between select-none">
      {/* Left Custom Controls (Dataset Presets, Size, Inputs) */}
      <div className="flex items-center gap-3 flex-wrap w-full lg:w-auto" id="custom-controls">
        {customControls}
      </div>

      {/* Right Controls (Speed, Sound, Playback Group) */}
      {!hidePlayback && (
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
          {/* Stacked Speed & Sound Control Cluster */}
          <div className="inline-flex items-center bg-surface p-1 rounded-lg border border-surface-tertiary gap-2">
            {/* Speed Slider & Badge */}
            <div className="flex items-center gap-2 px-2">
              <span className="text-[10px] font-mono text-textSecondary uppercase tracking-wider hidden sm:inline">
                Speed
              </span>
              <input
                type="range"
                min="1"
                max="10"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-16 sm:w-20 h-1.5 bg-surface-tertiary rounded-lg accent-accent cursor-pointer"
              />
              <span className="px-1.5 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-mono text-[11px] font-bold">
                {speed}x
              </span>
              <span className="text-[10px] font-mono text-textSecondary hidden md:inline">
                {delayMs}ms
              </span>
            </div>

            {/* Quick Speed Presets Segmented Bar */}
            <div className="hidden sm:flex items-center bg-surface-secondary p-0.5 rounded-md border border-white/5 gap-0.5">
              {[1, 2, 5, 10].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSpeed(spd)}
                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                    speed === spd
                      ? 'bg-accent text-white font-bold'
                      : 'text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/60'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-md border transition-colors ${
                soundEnabled
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-surface-secondary border-white/5 text-textSecondary hover:text-textPrimary'
              }`}
              title={soundEnabled ? 'Mute audio [M]' : 'Enable sound sonification [M]'}
            >
              {soundEnabled ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
          </div>

          {/* Stacked Minimalist Playback Cluster */}
          <div className="inline-flex items-center rounded-lg border border-surface-tertiary bg-surface p-0.5 shadow-sm">
            {/* Play / Pause */}
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                playing
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-accent text-white hover:bg-accent/90 shadow-sm'
              }`}
              onClick={togglePlay}
              title="Toggle playback [Space]"
            >
              {playing ? (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Step Forward */}
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/60 rounded-md transition-colors disabled:opacity-40 disabled:pointer-events-none"
              onClick={stepForward}
              disabled={playing}
              title="Step forward [→]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span>Step</span>
            </button>

            {/* Reset */}
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-textSecondary hover:text-textPrimary hover:bg-surface-tertiary/60 rounded-md transition-colors"
              onClick={reset}
              title="Reset [R]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlsBar;
