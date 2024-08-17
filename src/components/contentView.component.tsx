import React,{ useContext } from "react";
import { UserContext } from "../providers/user/userProvider";
import { styled } from "@linaria/react";
import Widget from "./common/widgets/widget.component";
import Navigator from "./navigation/navigator.component";
import logo from "../assets/logo.png";
import Home from "./routes/home.component";
import ForumMain from "./routes/forum/forumMain.component";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Board from "./routes/forum/board.component";
import ForumThread from "./routes/forum/thread.component";

const Style = {
    MainContent: styled.div`
        
    `,

    header: styled.div`
        border-bottom: .2rem solid black;
    `
};

const ContentView:React.FC = () => {
    const {displayName} = useContext(UserContext);

    return (
        <Style.MainContent className="d-flex flex-column justify-content-center">
            <Style.header className="d-flex mb-5 justify-content-between">
                <div>
                    Zelda Fan Game Central
                </div>
                <Navigator/>
                <div>
                    <div className="d-flex float-end me-2 flex-column">
                        <div>Welcome, {displayName}! Please login or register</div>
                        <div>Did you miss your activation email?</div>
                    </div>
                </div>
            </Style.header>
            <div className="container-xl">
                <BrowserRouter>
                    <Routes>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/forum" element={<ForumMain/>}/>
                        <Route path="/forum/board/:boardId" element={<Board/>}/>
                        <Route path="/forum/thread/:threadId" element={<ForumThread/>}/>
                    </Routes>
                </BrowserRouter>
            </div>

        </Style.MainContent>
    )
};

export default ContentView;