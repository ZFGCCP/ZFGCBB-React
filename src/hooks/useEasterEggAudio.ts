interface UseEasterEggAudioProps {
  targetRef?: HTMLElement | typeof globalThis | null;
  triggerEvent?: keyof HTMLElementEventMap;
}

function connectEasterEggAudio(
  audio: HTMLAudioElement,
  target: HTMLElement | typeof globalThis,
  triggerEvent: keyof HTMLElementEventMap,
) {
  let disconnected = false;

  async function handlePlay() {
    await audio.play().catch((error) => {
      console.warn("Audio playback blocked by browser policies:", error);
    });

    if (!disconnected) {
      target.removeEventListener(triggerEvent, handlePlay);
    }
  }

  audio.play().catch(() => {
    if (!disconnected) {
      target.addEventListener(triggerEvent, handlePlay);
    }
  });

  return () => {
    disconnected = true;
    target.removeEventListener(triggerEvent, handlePlay);
    audio.pause();
    audio.currentTime = 0;
  };
}

export function useEasterEggAudio({
  targetRef = import.meta.env.SSR ? null : globalThis,
  triggerEvent = "mouseenter",
}: UseEasterEggAudioProps = {}) {
  return useCallback(
    (audio: HTMLAudioElement | null) => {
      if (import.meta.env.SSR || !audio || !targetRef) return undefined;

      return connectEasterEggAudio(audio, targetRef, triggerEvent);
    },
    [targetRef, triggerEvent],
  );
}
