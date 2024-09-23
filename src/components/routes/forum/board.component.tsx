import React, { useMemo } from "react";
import { useParams } from "react-router";
import Widget from "../../common/widgets/widget.component";
import { styled } from "@linaria/react";
import { Button, Table } from "react-bootstrap";
import { useBBQuery } from "../../../hooks/useBBQuery";
import { Forum } from "../../../types/forum";
import { Link } from "react-router-dom";
import FooterButtons from "./footerButtons.component";

const Style = {
    row: styled.tr`
        &.tableRow{
            th{
                background-color: #1E2B44;
                color: white;
            }

            &.body{
                td{
                    color: white;
                }

                &:nth-child(odd){
                    td{
                        background-color: #25334e;
                    }
                }

                &:nth-child(even){
                    td{
                        background-color: #1e2b44;
                    }
                }
            }
        }

        &.subRow{
            th{
                background-color: black;
                color: white;
                font-size: .75rem;
            }
        }
    `,

    FooterButton: styled(Button)`

        &.footer-btn{
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            background-color: #25334e;
            border-top: 0;
            border: .2rem solid black;
            padding-right: .2rem;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            border-right: 0;

            &:first-child{
                border-bottom-left-radius: .5rem;
            }

            &:last-child{
                border-bottom-right-radius: .5rem;
                border-right: .2rem solid black;
            }
        }
    `
};

const Board:React.FC = () => {
    const {boardId} = useParams();
    const board  = useBBQuery<Forum>(`board/${boardId}`)

    const footer = useMemo(() =>{
        return [
            {
                label: "New Thread",
                callback: () => {}
            },
            {
                label: "New Poll",
                callback: () => {}
            },
            {
                label: "Subscribe",
                callback: () => {}
            },
            {
                label: "Mark Read",
                callback: () => {}
            },
        ];
    },[board]);

    return(
        <>
            <div className="row">
                <div className="col-12 my-2">
                    <div>
                        ZFGC &gt;&gt; ZFGC.com &gt;&gt; Updates
                    </div>
                    {board && <Widget widgetTitle={board.boardName}>
                        <Table striped hover responsive>
                            <thead>
                                <Style.row className="tableRow">
                                    <th></th>
                                    <th></th>
                                    <th>Subject</th>
                                    <th>Author</th>
                                    <th>Replies</th>
                                    <th>Views</th>
                                    <th>Latest Post</th>
                                </Style.row>
                                <Style.row className="subRow">
                                    <th colSpan={7}>
                                        MGZero and 1 other guests are using this board
                                    </th>
                                </Style.row>
                            </thead>
                            <tbody>
                                {board?.threads?.map(thread => {
                                    return <Style.row className="tableRow body">
                                                <td>abced</td>
                                                <td>abcdef</td>
                                                <td><Link to={`/forum/thread/${thread.id}`}>{thread.threadName}</Link></td>
                                                <td>{thread.createdUser?.displayName}</td>
                                                <td>100</td>
                                                <td>100</td>
                                                <td>ok hold up I lied</td>
                                            </Style.row>
                                })}
                            </tbody>
                        </Table>
                        <div>
                            paginator here
                        </div>
                    </Widget>}
                </div>
            </div>
            <FooterButtons options={footer}/>
        </>
    )
};

export default Board;