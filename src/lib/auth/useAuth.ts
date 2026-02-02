import { useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [error, setError] = useState<Error | null>(null);

  const user = accounts[0] || null;

  const clearError = () => setError(null);

  const login = async () => {
    setError(null);
    try {
      await instance.loginPopup(loginRequest);
    } catch (err) {
      const loginError = err instanceof Error ? err : new Error("Login failed");
      setError(loginError);
      console.error("Login failed:", err);
    }
  };

  const logout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: window.location.origin,
    });
  };

  const getAccessToken = async () => {
    if (!user) return null;
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: user,
      });
      return response.accessToken;
    } catch (err) {
      const tokenError = err instanceof Error ? err : new Error("Token acquisition failed");
      setError(tokenError);
      console.error("Token acquisition failed:", err);
      return null;
    }
  };

  return {
    isAuthenticated,
    user,
    error,
    login,
    logout,
    getAccessToken,
    clearError,
  };
}
