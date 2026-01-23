import React, { ReactNode } from "react";
import { useAuthStore, Role } from "../../store/authstore";

interface RequireRoleProps {
  role: Role;
  children: ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ role, children }) => {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== role) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
};

export default RequireRole;
