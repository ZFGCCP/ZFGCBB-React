import type React from "react";
import { useContext } from "react";
import { UserContext } from "../../../providers/user/userProvider";
import { styled } from "@linaria/react";
import { Outlet } from "react-router-dom";
import Navigator from "../../navigation/navigator.component";
import BBLink from "../bbLink";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import type { Theme } from "../../../types/theme";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Style = {
  MainContent: styled.div``,

  header: styled.div`
    border-bottom: 0.2rem solid black;
    height: 7.45rem;
  `,

  headerImg: styled.img`
    position: relative;
    top: 2.3rem;
    z-index: 1;

    @media (max-width: 767px) {
      top: 3rem;
    }
  `,

  navWrapper: styled.div`
    position: relative;
    top: -2rem;
  `,

  mobileNavWrapper: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.black};
    height: 2.5rem;
    position: fixed;
    width: 100%;
    bottom: 0;
  `,
};

const ContentView: React.FC = () => {
  const { displayName } = useContext(UserContext);
  const { currentTheme } = useContext(ThemeContext);

  return (
    <Style.MainContent className="d-flex flex-column mb-5">
      <Style.header className="d-flex mb-5 px-3 justify-content-between">
        <Style.navWrapper>
          <Style.headerImg
            src="http://zfgc.com/forum/Themes/midnight/images/midnight/logo.png"
            className="d-none d-sm-block"
          />
          <Style.headerImg
            src="http://localhost:8080/zfgbb/content/image/4"
            className="d-block d-sm-none"
          />
          <Navigator />
        </Style.navWrapper>
        <div className="d-none d-lg-flex flex-column justify-content-center">
          <div>
            Welcome, {displayName}! Please login or{" "}
            <BBLink to="/user/registration">register</BBLink>
          </div>
          <div>Did you miss your activation email?</div>
        </div>
      </Style.header>
      <div className="container-xxl">
        <Outlet />
      </div>
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
