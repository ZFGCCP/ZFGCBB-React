import { useRegisterSW } from "virtual:pwa-register/react";

export default function BBReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!offlineReady && !needRefresh) {
    return null;
  }

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div role="status" className="reload-prompt">
      <span>
        {offlineReady
          ? "App ready to work offline."
          : "New content available — reload to update."}
      </span>
      {needRefresh && (
        <button type="button" onClick={() => updateServiceWorker(true)}>
          Reload
        </button>
      )}
      <button type="button" onClick={close}>
        Close
      </button>
    </div>
  );
}
