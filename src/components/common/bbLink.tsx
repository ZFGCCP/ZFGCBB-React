import { styled } from "@linaria/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Theme } from "../../types/theme";
import { ThemeContext } from "../../providers/theme/themeProvider";

const Style = {
    link: styled.div<{theme: Theme}>`
        a{
            &:visited{
                color: ${(props) => props.theme.linkColorVisited};
            }

            &:link{
                color: ${(props) => props.theme.linkColorVisited};
            }
        }
    `
}

const BBLink:React.FC<{to: string, children: React.ReactNode}> = ({to, children}) => {
    const { currentTheme } = useContext(ThemeContext);

    return <Style.link theme={currentTheme}>
        <Link to={to}>
            {children}
        </Link>
    </Style.link>;
};

export default BBLink;