import { useMsal } from "@azure/msal-react";

export type AppRole = "Admin" | "Editor" | "Viewer";

export function useRoles() {
  const { accounts } = useMsal();
  const roles = (accounts[0]?.idTokenClaims?.roles as AppRole[]) || [];

  return {
    roles,
    isAdmin: roles.includes("Admin"),
    isEditor: roles.includes("Editor"),
    isViewer: roles.includes("Viewer"),
    canEdit: roles.includes("Admin") || roles.includes("Editor"),
    canManage: roles.includes("Admin"),
    hasAnyRole: roles.length > 0,
  };
}
