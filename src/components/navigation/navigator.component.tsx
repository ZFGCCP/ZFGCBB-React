import React from "react";
import { styled } from "@linaria/react";
import { Link } from "react-router-dom";

const Style = {
  subTabs: styled.div`
    background-color: #1e2b44;
  `,
};

const NavTabStyle = {
  tab: styled.div`
    border: 0.2rem solid black;
    background-color: #1e2b44;
    border-bottom: 0;

    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  `,
};

const NavTab: React.FC<{ title: String; path: `/${string}` }> = ({
  title,
  path,
}) => {
  return (
    <NavTabStyle.tab className="d-flex px-5 mx-1 align-items-center">
      <Link to={path} relative="path">
        {title}
      </Link>
    </NavTabStyle.tab>
  );
};

const Navigator: React.FC = () => {
  return (
    <div className="d-flex pt-3">
      <NavTab title="Home" path="/" />
      <NavTab title="Forum" path="/forum" />
      <NavTab title="Chat" path="/" />
      <NavTab title="Wiki" path="/" />
      <NavTab title="Projects" path="/" />
      <NavTab title="Resources" path="/" />
    </div>
  );
};

export default Navigator;
