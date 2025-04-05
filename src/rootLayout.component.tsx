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
  MainContent: styled.div`
    grid-template-rows: auto 1fr auto;
    @media (max-width: 768px) {
      height: 100dvh;
      width: 100dvw;
    }
  `,

  header: styled.div`
    border-bottom: 0.2rem solid black;
    @media (max-width: 768px) {
      border-bottom: 0;
    }
  `,

  pageWrapper: styled.div`
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

  navWrapper: styled.div`
    overflow: clip;
    @media (max-width: 768px) {
      display: grid;
      width: 100dvw;
      place-self: start;
    }
  `,

  mobileNavWrapper: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.black};
    height: 2.5rem;
    width: 100dvw;
    position: relative;
    z-index: 100001; /* This magic number is for tanstack/react-query-devtools */
    place-content: end center;
    align-items: center;
  `,

  loginRegistrationWrapper: styled.div`
    @media (max-width: 870px) {
      font-size: 0.6rem;
    }
  `,
};

const ContentView = ({ children }: { children: React.ReactNode }) => {
  const { displayName } = useContext(UserContext);
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.MainContent className="d-grid overflow-hidden">
      <Style.header className="d-flex justify-content-start justify-content-md-around">
        <Style.navWrapper>
          <BBImage
            className="d-none d-md-block"
            src="images/logo.png"
            as={Style.headerImg}
            alt="Logo"
          />
          <Navigator />
        </Style.navWrapper>
        <Style.loginRegistrationWrapper className="d-none d-md-flex flex-column justify-content-center text-start ">
          <div>
            Welcome, {displayName}! <span>Please login or </span>
            <BBLink to="/user/auth/registration">register</BBLink>.
          </div>
          <div>Did you miss your activation email?</div>
        </Style.loginRegistrationWrapper>
      </Style.header>
      <Style.pageWrapper className="container-xxl pt-1 pb-1">
        <div className="d-grid d-md-none justify-content-center">
          <BBImage
            className="d-md-none pb-1 w-100 h-100"
            src="images/logo.png"
            as={Style.headerImg}
            alt="Logo"
          />
        </div>
        {children}
      </Style.pageWrapper>
      <Style.mobileNavWrapper
        theme={currentTheme}
        className="d-flex d-md-none justify-content-around align-items-center"
      >
        <BBLink to="/">Home</BBLink>
        <BBLink to="/">Wiki</BBLink>
        <BBLink to="/forum">Forum</BBLink>
        <BBLink to="/">Chat</BBLink>
        <BBLink to="/">
          <FontAwesomeIcon icon={faBars} />
        </BBLink>
      </Style.mobileNavWrapper>
    </Style.MainContent>
  );
};

export default ContentView;
