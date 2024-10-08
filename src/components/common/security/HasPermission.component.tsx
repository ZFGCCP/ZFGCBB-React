import React, { useContext, useMemo } from "react";
import { UserContext } from "../../../providers/user/userProvider";

const HasPermission: React.FC<{
  perms: string[];
  children: React.ReactNode;
}> = ({ perms, children }) => {
  const { permissions } = useContext(UserContext);
  const hasPerm = useMemo(() => {
    return permissions
      ?.map((p) => p.permissionName)
      .some((p) => perms.includes(p));
  }, [perms, permissions]);

  return <>{hasPerm && <span>{children}</span>}</>;
};

export default HasPermission;
