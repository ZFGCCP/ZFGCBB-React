import type React from "react";
import { useContext } from "react";
import { UserContext } from "./providers/user/userProvider";
import { styled } from "styled-components";
import Navigator from "./components/navigation/navigator.component";
import BBLink from "./components/common/bbLink.component";
import { ThemeContext } from "./providers/theme/themeProvider";
import type { Theme } from "./types/theme";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BBImage from "./components/common/bbImage.component";

const Style = {
  MainContent: styled.main`
    grid-template-rows: auto 1fr auto;
    height: fit-content;
    @media (max-width: 768px) {
      height: 100%;
    }
    width: auto;
  `,

  header: styled.header`
    place-content: stretch space-between;
    place-items: end;
    border-bottom: 0.2rem solid black;
    @media (max-width: 768px) {
      border-bottom: 0;
    }
  `,

  pageWrapper: styled.article`
    overflow: hidden auto;
    height: 100%;
    width: 100%;
    @media (min-width: 768px) {
      overflow: hidden;
    }
  `,

  headerImg: styled.img`
    position: relative;
    z-index: -1; /* Send the image behind the content */
    @media (min-width: 768px) {
      margin-bottom: -1.5rem;
    }
  `,

  mobileNavWrapper: styled.footer<{ theme: Theme }>`
    background-color: ${(props) => props.theme.black};
    height: 2.5rem;
    width: 100%;
    position: relative;
    z-index: 100001; /* This magic number is for tanstack/react-query-devtools */
    align-items: center;
    place-self: end;
  `,

  userGreetingWrapper: styled.div`
    place-self: center stretch;
    padding: 1rem;
  `,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { displayName } = useContext(UserContext);
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.MainContent className="d-grid">
      <Style.header className="d-none d-md-flex">
        <div className="z-1">
          <BBImage src="images/logo.png" as={Style.headerImg} alt="Logo" />
          <Navigator />
        </div>
        <Style.userGreetingWrapper>
          <p className="mb-0">
            Welcome, {displayName}! <span>Please login or </span>
            <BBLink to="/user/auth/registration">register</BBLink>.
          </p>
          <p>Did you miss your activation email?</p>
        </Style.userGreetingWrapper>
      </Style.header>

      <Style.pageWrapper className="p-2">
        <div className="d-grid d-md-none justify-content-center">
          <BBImage
            className="w-100 h-100 z-1"
            src="images/logo.png"
            as={Style.headerImg}
            alt="Logo"
          />
        </div>
        {children}
      </Style.pageWrapper>

      <Style.mobileNavWrapper
        theme={currentTheme}
        className="d-flex d-md-none justify-content-around"
      >
        <BBLink to="/">Home</BBLink>
        <BBLink to="/">Wiki</BBLink>
        <BBLink to="/forum" prefetch="intent">
          Forum
        </BBLink>
        <BBLink to="/">Chat</BBLink>
        <BBLink to="/">
          <FontAwesomeIcon icon={faBars} />
        </BBLink>
      </Style.mobileNavWrapper>
    </Style.MainContent>
  );
};

export default RootLayout;
