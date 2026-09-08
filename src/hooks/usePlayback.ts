import { useAppStore } from '@/store/useAppStore';

export function usePlayback() {
  const { playing, stepIdx, steps, play, pause, stepForward, reset } = useAppStore();

  const totalSteps = steps.length;
  const currentStep = stepIdx > 0 && steps.length > 0 ? steps[stepIdx - 1] : null;

  return {
    isPlaying: playing,
    currentStep,
    stepIdx,
    totalSteps,
    play,
    pause,
    stepForward,
    reset,
  };
}
