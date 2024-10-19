import type React from "react";
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
