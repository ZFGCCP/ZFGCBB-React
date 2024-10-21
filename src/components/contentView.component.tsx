import React, { useContext } from "react";
import { UserContext } from "../providers/user/userProvider";
import { styled } from "@linaria/react";
import Navigator from "./navigation/navigator.component";
import { Outlet } from "react-router-dom";
import BBLink from "./common/bbLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
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
  `,

  navWrapper: styled.div`
    position: relative;
    top: -2rem;
  `
};

const ContentView: React.FC = () => {
  const { displayName } = useContext(UserContext);

  return (
    <Style.MainContent className="d-flex flex-column">
      <Style.header className="d-flex mb-5 px-3 justify-content-between">
        <Style.navWrapper>
          <Style.headerImg src="http://zfgc.com/forum/Themes/midnight/images/midnight/logo.png"/>
          <Navigator />
        </Style.navWrapper>
        <div className="d-none d-lg-flex flex-column justify-content-center">
          <div>
            Welcome, {displayName}! Please login or <BBLink to="/user/registration">register</BBLink>
          </div>
          <div>Did you miss your activation email?</div>
        </div>
        <div className="d-flex d-lg-none">
          <FontAwesomeIcon icon={faBurger} />
        </div>
      </Style.header>
      <div className="container-xxl">
        <Outlet />
      </div>
    </Style.MainContent>
  );
};

export default ContentView;
