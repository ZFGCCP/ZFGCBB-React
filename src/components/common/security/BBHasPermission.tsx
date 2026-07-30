import { UserContext } from "@/providers/user/userProvider";
import type { BBPermission } from "@/types/api";

export interface BBHasPermissionProps {
  requiredPermissions: readonly BBPermission[];
  children: React.ReactNode;
}

export default function BBHasPermission({
  requiredPermissions,
  children,
}: BBHasPermissionProps) {
  const { permissions } = useContext(UserContext);
  const hasPermission = useMemo(() => {
    const required = new Set<string>(requiredPermissions);
    return permissions?.some((permission) =>
      required.has(permission.permissionCode),
    );
  }, [requiredPermissions, permissions]);

  if (!hasPermission) return null;
  return children;
}
