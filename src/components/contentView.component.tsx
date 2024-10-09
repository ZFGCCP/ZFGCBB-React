import React, { useContext } from "react";
import { UserContext } from "../providers/user/userProvider";
import { styled } from "@linaria/react";
import Navigator from "./navigation/navigator.component";
import { Outlet } from "react-router-dom";
import BBLink from "./common/bbLink";
const Style = {
  MainContent: styled.div``,

  header: styled.div`
    border-bottom: 0.2rem solid black;
  `,
};

const ContentView: React.FC = () => {
  const { displayName } = useContext(UserContext);

  return (
    <Style.MainContent className="d-flex flex-column">
      <Style.header className="d-flex mb-5 justify-content-between">
        <div>Zelda Fan Game Central</div>
        <Navigator />
        <div>
          <div className="d-flex me-2 flex-column">
            <div>
              Welcome, {displayName}! Please login or{" "}
              <BBLink to="/user/registration">register</BBLink>
            </div>
            <div>Did you miss your activation email?</div>
          </div>
        </div>
      </Style.header>
      <div className="container-xxl">
        <Outlet />
      </div>
    </Style.MainContent>
  );
};

export default ContentView;
