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
    const required = new Set(requiredPermissions);
    return permissions?.some((permission) =>
      required.has(permission.permissionCode as BBPermission),
    );
  }, [requiredPermissions, permissions]);

  return <>{hasPermission && children}</>;
}
