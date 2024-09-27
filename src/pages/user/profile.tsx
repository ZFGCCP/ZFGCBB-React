import React, { useContext } from "react";
import Widget from "../../components/common/widgets/widget.component";
import UserProfileMaster from "../../components/user/userProfileMaster.component";

const UserProfile: React.FC = () => {
  return (
    <div className="row">
      <div className="col-12 my-2">
        <Widget widgetTitle={"Profile Summary"}>
          <div className="d-flex flex-column flex-md-row">
            <UserProfileMaster />
          </div>
        </Widget>
      </div>
    </div>
  );
};

export default UserProfile;
