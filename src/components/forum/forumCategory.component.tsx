import React from "react";
import { styled } from "@linaria/react";
import Widget from "../common/widgets/widget.component";
import { Board } from "../../types/forum";
import { Link } from "react-router-dom";

const Style = {
    forumRow: styled.div`
        height: 4rem;

        &:nth-child(odd){
            background-color: #25334e;
        }

        &:nth-child(even){
            background-color: #1e2b44;
        }
    `,

    forumDesc: styled.div`
        font-size: .8rem;
    `
};

const ForumCategory:React.FC<{title: String, subBoards: Board[]}> = ({title, subBoards}) => {
    return (
        <Widget widgetTitle={title}>
            {subBoards?.map(sb => {
                return (<Style.forumRow className="d-flex">
                    <div className="col-1 d-flex">
                        <img src="http://zfgc.com/forum/Themes/midnight/images/off.gif"/>
                    </div>
                    <div className="col-2 align-content-center">
                        <h6><Link to={`/forum/board/${sb.id}`}>{sb.boardName}</Link></h6>
                    </div>
                    <div className="col-6 align-content-center">
                        <div className="d-flex flex-column">
                            <Style.forumDesc>{sb.description}</Style.forumDesc>
                            <Style.forumDesc>Moderators: me, me and me</Style.forumDesc>
                            <Style.forumDesc>Child board: hello, hello, hello</Style.forumDesc>
                        </div>
                    </div>
                    <div className="col-1 align-content-center">
                        <div className="d-flex flex-column">
                            <Style.forumDesc>Threads: 9001</Style.forumDesc>
                            <Style.forumDesc>Posts: 9001</Style.forumDesc>
                        </div>
                    </div>
                    <div className="col-2 align-content-center">
                        <div className="d-flex flex-column">
                            <Style.forumDesc>Last Post by: MG-Zero</Style.forumDesc>
                            <Style.forumDesc>in Email Issues</Style.forumDesc>
                            <Style.forumDesc>on 07/31/2024 12:00:00PM</Style.forumDesc>
                        </div>
                    </div>
                </Style.forumRow>
                )
            })}
        </Widget>
    )
};

export default ForumCategory;