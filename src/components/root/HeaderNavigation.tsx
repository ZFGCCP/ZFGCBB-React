import { useGlobalSearch } from "@/providers/search/globalSearchProvider";

const HeaderNavigation: React.FC = () => {
  const { open } = useGlobalSearch();
  return (
    <nav className="hidden md:flex items-end gap-1">
      <BBNavTab title="Home" to="/" />
      <BBNavTab title="Forum" to="/forum" prefetch="intent" />
      <BBNavTab
        title="Chat"
        to="https://discord.gg/NP2nNKjun6"
        target="_blank"
      />
      <BBNavTab title="Wiki" to="/wiki/Main_Page" />
      <BBNavTab title="Projects" to="/content/projects" />
      <BBNavTab title="Resources" to="/content/resources" />
      <BBHasPermission requiredPermissions={["ZFGC_SITE_ADMIN"]}>
        <BBNavTab title="Admin" to="/admin" />
      </BBHasPermission>
      <button
        type="button"
        onClick={open}
        aria-label="Search ZFGC"
        className="mb-1 ml-2 flex h-8 items-center gap-2 border-2 border-default bg-muted px-3 text-sm text-dimmed transition-colors hover:bg-elevated hover:text-highlighted"
      >
        <BBIcon name="search" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden rounded border border-default/50 bg-accented px-1 text-[10px] leading-4 tracking-widest text-dimmed lg:inline">
          /
        </kbd>
      </button>
    </nav>
  );
};

export default HeaderNavigation;
