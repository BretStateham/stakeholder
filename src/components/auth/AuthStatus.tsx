import { useAuth } from "@/lib/auth";
import { LoginButton } from "./LoginButton";
import { UserProfile } from "./UserProfile";

export function AuthStatus() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <UserProfile /> : <LoginButton />;
}
