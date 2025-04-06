import type React from "react";
import { styled } from "styled-components";
import BBLink, { type RoutePaths } from "../common/bbLink.component";

const Style = {
  subTabs: styled.div`
    background-color: #1e2b44;
  `,

  wrapper: styled.nav``,
};

const NavTabStyle = {
  tab: styled.div`
    border: 0.2rem solid black;
    background-color: #1e2b44;
    border-bottom: 0;
    height: 2rem;
    border-radius: 0.5rem 0.5rem 0 0;
  `,
};

const NavTab: React.FC<{ title: String; path: RoutePaths }> = ({
  title,
  path,
}) => {
  return (
    <NavTabStyle.tab className="d-flex px-4 mx-1 align-items-center">
      <BBLink to={path} relative="path">
        {title}
      </BBLink>
    </NavTabStyle.tab>
  );
};

const Navigator: React.FC = () => {
  return (
    <Style.wrapper className="d-none d-md-flex align-items-end">
      <NavTab title="Home" path="/" />
      <NavTab title="Forum" path="/forum" />
      <NavTabStyle.tab className="d-flex px-4 mx-1 align-items-center">
        <BBLink
          to={"https://discord.gg/NP2nNKjun6"}
          relative="path"
          target="_blank"
        >
          Chat
        </BBLink>
      </NavTabStyle.tab>
      <NavTabStyle.tab className="d-flex px-4 mx-1 align-items-center">
        <BBLink to={"http://wiki.zfgc.com"} relative="path" target="_blank">
          Wiki
        </BBLink>
      </NavTabStyle.tab>
      <NavTab title="Projects" path="/projects" />
      <NavTab title="Resources" path="/resources" />
    </Style.wrapper>
  );
};

export default Navigator;
