export default function ForumBoardLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading";
  return (
    <article>
      <section className="row" aria-busy={isNavigating}>
        <div className="col-12 my-2">
          <div
            aria-hidden
            className={`h-1 transition-opacity duration-200 ${isNavigating ? "opacity-100 animate-pulse" : "opacity-0"}`}
            style={{
              background:
                "repeating-linear-gradient(45deg, var(--text-color-highlighted) 0 4px, transparent 4px 8px)",
            }}
          />
          <Outlet />
        </div>
      </section>
    </article>
  );
}
