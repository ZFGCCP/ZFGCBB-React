interface UseEasterEggAudioProps {
  targetRef?: HTMLElement | typeof globalThis | null;
  triggerEvent?: keyof HTMLElementEventMap;
}

export function useEasterEggAudio({
  targetRef = import.meta.env.SSR ? null : globalThis,
  triggerEvent = "mouseenter",
}: UseEasterEggAudioProps = {}) {
  return useCallback(
    (audio: HTMLAudioElement | null) => {
      if (import.meta.env.SSR || !audio || !targetRef) return;

      async function handlePlay() {
        if (!audio || !targetRef) return;
        await audio.play().catch((error) => {
          console.warn("Audio playback blocked by browser policies:", error);
        });

        targetRef.removeEventListener(triggerEvent, handlePlay);
      }

      audio.play().catch(() => {
        targetRef.addEventListener(triggerEvent, handlePlay);
      });

      return () => {
        targetRef.removeEventListener(triggerEvent, handlePlay);
        audio.pause();
        audio.currentTime = 0;
      };
    },
    [targetRef, triggerEvent],
  );
}
