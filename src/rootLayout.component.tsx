import type React from "react";
import { useContext } from "react";
import { UserContext } from "./providers/user/userProvider";
import Navigator from "./components/navigation/navigator.component";
import BBLink from "./components/common/bbLink.component";
// import { ThemeContext } from "./providers/theme/themeProvider";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BBImage from "./components/common/bbImage.component";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { displayName } = useContext(UserContext);
  // const { currentTheme } = useContext(ThemeContext);

  return (
    <main className="grid grid-rows-[auto_1fr_auto] w-auto h-fit md:h-auto">
      <header className="hidden md:flex items-end justify-between border-b-4 border-black">
        <div className="z-[1]">
          <BBImage
            src="images/logo.png"
            className="relative z-[-1] mb-[-1.5rem] hidden md:block"
            alt="Logo"
          />
          <Navigator />
        </div>
        <div className="self-center w-full p-4">
          <p className="mb-0">
            Welcome, {displayName}! <span>Please login or </span>
            <BBLink to="/user/auth/registration">register</BBLink>.
          </p>
          <p>Did you miss your activation email?</p>
        </div>
      </header>

      <article className="overflow-auto h-full w-full p-2 md:overflow-hidden">
        <div className="grid md:hidden justify-center">
          <BBImage
            src="images/logo.png"
            className="w-full h-full relative z-[-1]"
            alt="Logo"
          />
        </div>
        {children}
      </article>

      <footer className="flex md:hidden justify-around items-center h-10 w-full relative z-[100001] bg-background">
        <BBLink to="/">Home</BBLink>
        <BBLink to="/">Wiki</BBLink>
        <BBLink to="/forum" prefetch="intent">
          Forum
        </BBLink>
        <BBLink to="/">Chat</BBLink>
        <BBLink to="/">
          <FontAwesomeIcon icon={faBars} />
        </BBLink>
      </footer>
    </main>
  );
};

export default RootLayout;
