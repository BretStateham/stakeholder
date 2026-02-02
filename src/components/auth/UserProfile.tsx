import { useAuth, useRoles, type AppRole } from "@/lib/auth";
import { LogoutButton } from "./LogoutButton";

const roleBadgeColors: Record<AppRole, string> = {
  Admin: "bg-red-100 text-red-800",
  Editor: "bg-blue-100 text-blue-800",
  Viewer: "bg-green-100 text-green-800",
};

export function UserProfile() {
  const { user } = useAuth();
  const { roles } = useRoles();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">{user.name}</span>
        <div className="flex gap-1">
          {roles.map((role) => (
            <span
              key={role}
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleBadgeColors[role] || "bg-gray-100 text-gray-800"}`}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
