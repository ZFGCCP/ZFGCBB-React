import { useRegisterSW } from "virtual:pwa-register/react";

async function purgeDevServiceWorkers() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  if (registrations.length === 0) {
    return;
  }
  await Promise.all(
    registrations.map((registration) => registration.unregister()),
  );
  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
  }
  if (
    navigator.serviceWorker.controller &&
    !sessionStorage.getItem("dev-sw-purged")
  ) {
    sessionStorage.setItem("dev-sw-purged", "1");
    window.location.reload();
  }
}

export default function BBReloadPrompt() {
  const [updateState, setUpdateState] = useState<
    "idle" | "updating" | "failed"
  >("idle");
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!import.meta.env.DEV || !("serviceWorker" in navigator)) {
      return;
    }
    purgeDevServiceWorkers().catch((error: unknown) => {
      console.warn("Failed to purge dev service workers:", error);
    });
  }, []);

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setUpdateState("idle");
  }, [setNeedRefresh, setOfflineReady]);
  const reload = useCallback(async () => {
    setUpdateState("updating");
    try {
      await updateServiceWorker(true);
      setUpdateState("idle");
    } catch {
      setUpdateState("failed");
    }
  }, [updateServiceWorker]);
  const handleReload = useCallback(() => {
    void reload();
  }, [reload]);

  if (!offlineReady && !needRefresh && updateState === "idle") {
    return null;
  }

  return (
    <output className="reload-prompt">
      <span>
        {updateState === "failed"
          ? "Update failed. Check your connection and try again."
          : updateState === "updating"
            ? "Updating…"
            : offlineReady
              ? "App ready to work offline."
              : "New content available — reload to update."}
      </span>
      {(needRefresh || updateState === "failed") && (
        <button
          type="button"
          onClick={handleReload}
          disabled={updateState === "updating"}
        >
          {updateState === "failed" ? "Retry" : "Reload"}
        </button>
      )}
      <button type="button" onClick={close}>
        Close
      </button>
    </output>
  );
}
