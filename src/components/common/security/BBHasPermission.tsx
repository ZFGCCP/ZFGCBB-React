import { UserContext } from "../../../providers/user/userProvider";
import type { BBPermission } from "../../../types/api";

export interface BBHasPermissionProps {
  requiredPermissions: BBPermission[];
  children: React.ReactNode;
}

export default function BBHasPermission({
  requiredPermissions,
  children,
}: BBHasPermissionProps) {
  const { permissions } = useContext(UserContext);
  const hasPermission = useMemo(() => {
    return permissions
      ?.map((permission) => permission.permissionCode as BBPermission)
      .some((permissionCode) => requiredPermissions.includes(permissionCode));
  }, [requiredPermissions, permissions]);

  return <>{hasPermission && children}</>;
}
