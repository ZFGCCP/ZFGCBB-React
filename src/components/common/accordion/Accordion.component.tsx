import React, { useContext, useState } from "react";
import { styled } from "@linaria/react";
import { Theme } from "../../../types/theme";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faMinusSquare } from "@fortawesome/free-solid-svg-icons";

const Style = {
    accordionWrapper: styled.div`
        margin: 2rem;
    `,

    accordionHeader: styled.div<{theme: Theme}>`
        background-color: ${(props) => props.theme.backgroundColor};
        border: ${(props) => props.theme.borderWidth} solid ${(props) => props.theme.black};
    `,

    headerText: styled.h5`
        cursor: pointer;
    `,
}

const Accordion:React.FC<{title:string, children: React.ReactNode}> = ({title, children}) => {
    const { currentTheme } = useContext(ThemeContext);
    const [ expanded, setExpanded ] = useState(false);

    return( 
        <Style.accordionWrapper>
            <Style.accordionHeader theme={currentTheme} className="p-3">
                <Style.headerText onClick={() => setExpanded((prev) => !prev)}>
                    <FontAwesomeIcon icon={expanded ? faMinusSquare : faPlusSquare} className="me-2"/>
                    {title}
                </Style.headerText>
            </Style.accordionHeader>
            {expanded && <div className="m-2">
                {children}
            </div>}
        </Style.accordionWrapper>
    )

};

export default Accordion;