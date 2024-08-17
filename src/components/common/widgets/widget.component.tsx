import React from "react";
import { styled } from "@linaria/react";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import { useContext } from "react";

const Style = {
    widgetMain: styled.div`
        background-color: #1E2B44;
        border: .2rem solid black;
        height: 100%

        .widget-title{
            border-bottom: .2rem solid black;
        }
    `
};

const Widget:React.FC<{widgetTitle: String, className: String, children: React.ReactNode}> = ({widgetTitle, className = "", children}) => {
    return (
            <Style.widgetMain className={`${className}`}>
                <div className="p-1 widget-title">{widgetTitle}</div>
                <div>
                    {children}
                </div>
            </Style.widgetMain>
    )
};

export default Widget;