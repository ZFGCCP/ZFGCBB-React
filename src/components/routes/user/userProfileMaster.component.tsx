import React, { useContext } from "react";
import Widget from "../../common/widgets/widget.component";
import { useParams } from "react-router";
import { useBBQuery } from "../../../hooks/useBBQuery";
import { User } from "../../../types/user";
import UserLeftPane from "../../user/userLeftPane.component";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-bootstrap";
import { styled } from "@linaria/react";
import { ThemeContext } from "../../../providers/theme/themeProvider";
import { Theme } from "../../../types/theme";

const Style = {
    AccordionBody: styled(AccordionBody)<{theme: Theme}>`
        &.accordion-body{
            background-color: ${(props) => props.theme.widgetColor};
        }
    `
}

const UserProfileMaster:React.FC = () => {

    const { userId } = useParams();
    const user = useBBQuery<User>(`user-profile/${userId}`);
    const { currentTheme } = useContext(ThemeContext);

    return (
        <div className="row">
            <div className="col-12 my-2">
                <Widget widgetTitle={"Profile Summary"}>
                    <div className="d-flex flex-column flex-md-row">
                        {user &&<UserLeftPane user={user}/>}
                        <div className="right-pane col-12 col-md-9">
                            <Accordion>
                                <AccordionItem eventKey="0">
                                    <AccordionHeader>Bio Information</AccordionHeader>
                                    <Style.AccordionBody theme={currentTheme}>
                                        <AccordionBody>test</AccordionBody>
                                    </Style.AccordionBody>
                                </AccordionItem>
                                <AccordionItem eventKey="1">
                                    <AccordionHeader>Contact Information</AccordionHeader>
                                    <AccordionBody>test</AccordionBody>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    )
};

export default UserProfileMaster;