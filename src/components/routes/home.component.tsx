import React from "react";
import Widget from "../common/widgets/widget.component";
import { styled } from "@linaria/react";


const Style = {
    FeaturedProjectImg: styled.img`
        border-right: .1rem solid black;
    `,
};

const Home:React.FC = () => {

    return(
        <div className="row">
            <div className="col-12 col-lg-6 my-2">
                <Widget widgetTitle="Featured Project">
                        <div className="d-flex">
                            <Style.FeaturedProjectImg src="http://zfgc.com/files/potms/triforceSaga.png" className="col-12 col-lg-6"/>
                            <div className="ms-2 mt-2 col-12 col-lg-6">
                                <h5>Triforce Saga</h5>
                                <h6>Developer: chaoazul1</h6>
                            </div>
                        </div>
                </Widget>
            </div>

            <div className="col-12 col-lg-6 my-2">
                <Widget widgetTitle="Announcements">
                    <>
                        <div>
                            <h6>7/23/2024 - blah blah blah</h6>
                            <div>Test content</div>
                        </div>
                    </>
                </Widget>
            </div>

            <div className="col-12 my-2">
                <Widget widgetTitle="Announcements">
                    <>
                        <div>Test content</div>
                    </>
                </Widget>
            </div>
        </div>
    )
};

export default Home;