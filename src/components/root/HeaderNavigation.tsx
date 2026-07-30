import { useGlobalSearch } from "@/providers/search/globalSearchProvider";
import type { BBPermission } from "@/types/api";

const SITE_ADMIN_PERMISSION = [
  "ZFGC_SITE_ADMIN",
] as const satisfies readonly BBPermission[];

export default function HeaderNavigation() {
  const { open } = useGlobalSearch();
  const { pathname } = useLocation();
  const isActive = (base: string) =>
    base === "/"
      ? pathname === "/"
      : pathname === base || pathname.startsWith(`${base}/`);
  return (
    <nav className="hidden md:flex items-end gap-1">
      <BBNavTab title="Home" to="/" active={isActive("/")} raiseOnHover />
      <BBNavTab
        title="Forum"
        to="/forum"
        prefetch="intent"
        active={isActive("/forum")}
        raiseOnHover
      />
      <BBNavTab
        title="Chat"
        to="https://discord.gg/NP2nNKjun6"
        target="_blank"
        raiseOnHover
      />
      <BBNavTab
        title="Wiki"
        to="/wiki/Main_Page"
        active={isActive("/wiki")}
        raiseOnHover
      />
      <BBNavTab
        title="Projects"
        to="/content/projects"
        active={isActive("/content/projects")}
        raiseOnHover
      />
      <BBNavTab
        title="Resources"
        to="/content/resources"
        active={isActive("/content/resources")}
        raiseOnHover
      />
      <BBHasPermission requiredPermissions={SITE_ADMIN_PERMISSION}>
        <BBNavTab
          title="Admin"
          to="/admin"
          active={isActive("/admin")}
          raiseOnHover
        />
      </BBHasPermission>
      <button
        type="button"
        onClick={open}
        aria-label="Search ZFGC"
        className="ml-2 flex h-8 items-center gap-2 border-2 border-default border-b-0 bg-muted px-3 text-sm text-dimmed transition-colors hover:bg-elevated hover:text-highlighted"
      >
        <BBIcon name="search" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden rounded border border-default/50 bg-accented px-1 text-[10px] leading-4 tracking-widest text-dimmed lg:inline">
          /
        </kbd>
      </button>
    </nav>
  );
}
