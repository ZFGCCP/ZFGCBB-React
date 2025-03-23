import type React from "react";
import { useContext } from "react";
import { styled } from "styled-components";
import { Form } from "react-bootstrap";
import Widget from "../common/widgets/widget.component";
import { useBBQuery } from "../../hooks/useBBQuery";
import type { User } from "../../types/user";
import type { Theme } from "../../types/theme";
import UserLeftPane from "./userLeftPane.component";
import { ThemeContext } from "../../providers/theme/themeProvider";
import Accordion from "../common/accordion/Accordion.component";

const Style = {
  accordionWrapper: styled.div`
    margin: 2rem;
  `,

  accordionHeader: styled.div<{ theme: Theme }>`
    background-color: ${(props) => props.theme.backgroundColor};
    border: ${(props) => props.theme.borderWidth} solid
      ${(props) => props.theme.black};
  `,
};

const UserProfileMaster: React.FC<{ userId: string }> = ({ userId }) => {
  const { data: user } = useBBQuery<User>(`/user-profile/${userId}`);
  const { currentTheme } = useContext(ThemeContext);

  return (
    <div className="row">
      <div className="col-12 my-2">
        <Widget widgetTitle={"Profile Summary"}>
          <div className="d-flex flex-column flex-md-row">
            {user && <UserLeftPane user={user} />}
            <div className="right-pane col-12 col-md-9">
              <Accordion title="Bio Information">
                <Form>
                  <Form.Group>
                    <Form.Label>Displayname</Form.Label>
                    <Form.Control type="text" value={user?.displayName} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Personal Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={user?.bioInfo?.personalText}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="text" placeholder="MM/dd/YYYY" />
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
                  <Form.Control type="email" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Discord</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Facebook</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Instagram</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Threads</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Twitter</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Accordion>
            </div>
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default UserProfileMaster;
