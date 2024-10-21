import React from "react";
import { styled } from "@linaria/react";
import BBLink from "../common/bbLink";

const Style = {
  subTabs: styled.div`
    background-color: #1e2b44;
  `,

  wrapper: styled.div`
    position: relative;
    z-index: 2;
  `,
};

const NavTabStyle = {
  tab: styled.div`
    border: 0.2rem solid black;
    background-color: #1e2b44;
    border-bottom: 0;
    height: 2rem;

    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  `,
};

const NavTab: React.FC<{ title: String; path: `/${string}` }> = ({
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
    <Style.wrapper className="d-flex pt-3 align-items-end">
      <NavTab title="Home" path="/" />
      <NavTab title="Forum" path="/forum" />
      <NavTab title="Chat" path="/" />
      <NavTab title="Wiki" path="/" />
      <NavTab title="Projects" path="/" />
      <NavTab title="Resources" path="/" />
    </Style.wrapper>
  );
};

export default Navigator;
