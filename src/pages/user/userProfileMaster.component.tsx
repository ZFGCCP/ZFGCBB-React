import React, { useContext } from "react";
import Widget from "../../components/common/widgets/widget.component";
import { useParams } from "react-router";
import { useBBQuery } from "../../hooks/useBBQuery";
import { User } from "../../types/user";
import UserLeftPane from "../../components/user/userLeftPane.component";
import { styled } from "@linaria/react";
import { ThemeContext } from "../../providers/theme/themeProvider";
import { Theme } from "../../types/theme";
import Accordion from "../../components/common/accordion/Accordion.component";
import { Form } from "react-bootstrap";

const Style = {
    accordionWrapper: styled.div`
        margin: 2rem;
    `,

    accordionHeader: styled.div<{theme: Theme}>`
        background-color: ${(props) => props.theme.backgroundColor};
        border: ${(props) => props.theme.borderWidth} solid ${(props) => props.theme.black};
    `,
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
                            <Accordion title="Bio Information">
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Displayname</Form.Label>
                                        <Form.Control type="text" value={user?.displayName}/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Personal Text</Form.Label>
                                        <Form.Control type="text" value={user?.bioInfo?.personalText}/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Date of Birth</Form.Label>
                                        <Form.Control type="text" placeholder="MM/dd/YYYY"/>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Gender</Form.Label>
                                        <Form.Select>
                                            <option value="1">Male</option>
                                            <option value="2">Female</option>
                                            <option value="3">Non-binary/Other</option>
                                            <option value="4">Prefer not to say</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </Accordion>

                            <Accordion title="Contact Information">
                                <Form.Group>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control type="email"/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Discord</Form.Label>
                                    <Form.Control type="text"/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Facebook</Form.Label>
                                    <Form.Control type="text"/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Instagram</Form.Label>
                                    <Form.Control type="text"/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Threads</Form.Label>
                                    <Form.Control type="text"/>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Twitter</Form.Label>
                                    <Form.Control type="text"/>
                                </Form.Group>
                            </Accordion>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    )
};

export default UserProfileMaster;