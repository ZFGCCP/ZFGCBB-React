interface UseEasterEggAudioProps {
  targetRef?: HTMLElement | typeof globalThis | null;
  triggerEvents?: (keyof HTMLElementEventMap)[];
}

const USER_ACTIVATION_EVENTS: (keyof HTMLElementEventMap)[] = [
  "pointerdown",
  "keydown",
];

function connectEasterEggAudio(
  audio: HTMLAudioElement,
  target: HTMLElement | typeof globalThis,
  triggerEvents: (keyof HTMLElementEventMap)[],
) {
  let disconnected = false;

  function stopWaitingForActivation() {
    for (const triggerEvent of triggerEvents) {
      target.removeEventListener(triggerEvent, handlePlay);
    }
  }

  function handlePlay() {
    audio
      .play()
      .catch((error: unknown) => {
        console.warn("Audio playback blocked by browser policies:", error);
      })
      .finally(() => {
        if (!disconnected) {
          stopWaitingForActivation();
        }
      });
  }

  audio.play().catch(() => {
    if (disconnected) return;
    for (const triggerEvent of triggerEvents) {
      target.addEventListener(triggerEvent, handlePlay);
    }
  });

  return () => {
    disconnected = true;
    stopWaitingForActivation();
    audio.pause();
    audio.currentTime = 0;
  };
}

export function useEasterEggAudio({
  targetRef = import.meta.env.SSR ? null : globalThis,
  triggerEvents = USER_ACTIVATION_EVENTS,
}: UseEasterEggAudioProps = {}) {
  return useCallback(
    (audio: HTMLAudioElement | null): (() => void) | undefined => {
      if (import.meta.env.SSR || !audio || !targetRef) return undefined;

      return connectEasterEggAudio(audio, targetRef, triggerEvents);
    },
    [targetRef, triggerEvents],
  );
}
