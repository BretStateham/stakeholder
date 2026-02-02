import { useAuth } from "@/lib/auth";

export function LoginButton() {
  const { login } = useAuth();

  return (
    <button
      onClick={login}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      Sign In
    </button>
  );
}
