import { Navigate } from "react-router";
import { UserContext } from "./providers/user/userProvider";
import { useInstallStatus } from "./hooks/data/useInstallStatus";
import { useGlobalSearch } from "./providers/search/globalSearchProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { displayName, id } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { data: installStatus } = useInstallStatus();
  const { open: openSearch } = useGlobalSearch();

  if (installStatus?.installed === false && !pathname.startsWith("/system")) {
    return <Navigate to="/system/install" replace />;
  }

  return (
    <div className="grid grid-rows-[1fr_auto] md:grid-rows-[1fr] size-full overflow-hidden">
      <main className="overflow-auto bg-default min-h-0 size-full scrollbar-color-default scrollbar-gutter-stable px-1.5 mr-1">
        <header className="hidden md:flex justify-between items-end border-b-2 border-default bg-default px-2">
          <div className="z-10">
            <div className="relative -z-10 md:-mb-6 min-h-25 min-w-120">
              <BBImage src="images/logo.webp" alt="Logo" loading="eager" />
            </div>
            <HeaderNavigation />
          </div>

          <div className="self-center px-2">
            {Number(id) <= 0 ? (
              <>
                <span>Welcome, {displayName}! Please </span>
                <BBLink to="/user/auth/login">Login</BBLink>
                <span> or </span>
                <BBLink to="/user/auth/registration">register</BBLink>.
                <p className="text-dimmed">
                  Did you miss your activation email?
                </p>
              </>
            ) : (
              <>
                <span>Welcome, {displayName}! </span>
                <BBLink to="/user/settings/account">Account Settings</BBLink>
                <span> · </span>
                <BBLink to="/user/auth/logout">Logout</BBLink>
              </>
            )}
          </div>
        </header>

        <header className="md:hidden bg-default border-b-2 border-default">
          <div className="flex justify-center pt-2 m-h-18 min-w-full items-center">
            <BBImage
              className="h-16 w-auto"
              src="images/logo.webp"
              alt="Logo"
              loading="eager"
            />
          </div>
        </header>

        <div className="p-2 sm:p-3.5">
          <BBBreadcrumb />
          {children}
          <BBBreadcrumb />
        </div>
      </main>

      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav className="fixed bottom-12 left-0 right-0 z-50 bg-elevated border-t-2 border-default md:hidden">
            <BBHasPermission requiredPermissions={["ZFGC_SITE_ADMIN"]}>
              <BBLink
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-3 hover:bg-muted transition-colors border-b border-default"
              >
                <span className="text-sm">Admin Dashboard</span>
              </BBLink>
            </BBHasPermission>
            {Number(id) <= 0 ? (
              <>
                <BBLink
                  to="/user/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 hover:bg-muted transition-colors border-b border-default"
                >
                  <span className="text-sm">Login</span>
                </BBLink>
                <BBLink
                  to="/user/auth/registration"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 hover:bg-muted transition-colors border-b border-default"
                >
                  <span className="text-sm">Register</span>
                </BBLink>
              </>
            ) : (
              <>
                <BBLink
                  to="/user/settings/account"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 hover:bg-muted transition-colors border-b border-default"
                >
                  <span className="text-sm">Account Settings</span>
                </BBLink>
                <BBLink
                  to="/user/auth/logout"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center px-4 py-3 hover:bg-muted transition-colors border-b border-default"
                >
                  <span className="text-sm">Logout</span>
                </BBLink>
              </>
            )}
          </nav>
        </>
      )}

      <nav className="md:hidden bg-elevated border-t-2 border-default">
        <div className="grid grid-cols-5 h-12">
          <BBLink
            to="/"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="text-xs">Home</span>
          </BBLink>
          <BBLink
            to="/forum"
            prefetch="render"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="text-xs">Forum</span>
          </BBLink>
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <BBIcon name="search" />
          </button>
          <BBLink
            to="/wiki/Main_Page"
            className="flex items-center justify-center hover:bg-muted transition-colors"
          >
            <span className="text-xs">Wiki</span>
          </BBLink>
          <button
            type="button"
            className="flex items-center justify-center hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <Fa6SolidBars />
          </button>
        </div>
      </nav>
    </div>
  );
}
