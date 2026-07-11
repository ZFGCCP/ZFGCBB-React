import { useRegisterSW } from "virtual:pwa-register/react";

export default function BBReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!import.meta.env.DEV || !("serviceWorker" in navigator)) {
      return;
    }
    void navigator.serviceWorker
      .getRegistrations()
      .then(async (registrations) => {
        if (registrations.length === 0) {
          return;
        }
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
        if ("caches" in window) {
          const cacheKeys = await caches.keys();
          await Promise.all(
            cacheKeys.map((cacheKey) => caches.delete(cacheKey)),
          );
        }
        if (
          navigator.serviceWorker.controller &&
          !sessionStorage.getItem("dev-sw-purged")
        ) {
          sessionStorage.setItem("dev-sw-purged", "1");
          window.location.reload();
        }
      });
  }, []);

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
