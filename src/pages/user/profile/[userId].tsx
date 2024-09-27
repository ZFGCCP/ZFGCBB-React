import React, { useContext } from "react";
import Widget from "../../../components/common/widgets/widget.component";
import UserProfileMaster from "../../../components/user/userProfileMaster.component";
import { useParams } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { userId } = useParams();
  return (
    <>
      <UserProfileMaster userId={userId!} />
    </>
  );
};

export default UserProfile;
