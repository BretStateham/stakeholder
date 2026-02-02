import { Configuration, LogLevel } from "@azure/msal-browser";

// Validate required environment variables in development
if (import.meta.env.DEV) {
  if (!import.meta.env.VITE_ENTRA_CLIENT_ID) {
    console.warn(
      "⚠️ VITE_ENTRA_CLIENT_ID is not configured. Authentication will fail.\n" +
      "Copy .env.example to .env.local and add your Entra ID client ID."
    );
  }
  if (!import.meta.env.VITE_ENTRA_TENANT_ID) {
    console.warn(
      "⚠️ VITE_ENTRA_TENANT_ID is not configured. Using 'common' tenant.\n" +
      "For single-tenant apps, set this to your tenant ID in .env.local."
    );
  }
}

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_ENTRA_TENANT_ID || "common"}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      logLevel: import.meta.env.DEV ? LogLevel.Warning : LogLevel.Error,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const apiRequest = {
  scopes: [`api://${import.meta.env.VITE_ENTRA_CLIENT_ID}/access_as_user`],
};
