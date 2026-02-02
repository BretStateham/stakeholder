import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const user = accounts[0] || null;

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error("Login failed:", error);
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
    } catch (error) {
      console.error("Token acquisition failed:", error);
      return null;
    }
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    getAccessToken,
  };
}
