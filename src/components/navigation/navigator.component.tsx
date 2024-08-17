import React from "react";
import { styled } from "@linaria/react";

const Style = {
    subTabs: styled.div`
        background-color: #1E2B44;
    `
};

const NavTabStyle = {
    tab: styled.div`
        border: .2rem solid black;
        background-color: #1E2B44;
        border-bottom: 0;

        border-top-left-radius: .5rem;
        border-top-right-radius: .5rem;
    `
};

const NavTab:React.FC<{title: String}> = ({title}) => {
    return (
        <NavTabStyle.tab className="d-flex px-5 mx-1 align-items-center">
            {title}
        </NavTabStyle.tab>
    )
};

const Navigator:React.FC = () => {
    return (
            <div className="d-flex pt-3">
                <NavTab title="Home"/>
                <NavTab title="Forum"/>
                <NavTab title="Chat"/>
                <NavTab title="Wiki"/>
                <NavTab title="Projects"/>
                <NavTab title="Resources"/>
            </div>
    )
};

export default Navigator;