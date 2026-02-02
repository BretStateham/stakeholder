import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import { AuthStatus } from "@/components/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
              <h1 className="text-2xl font-bold">Stakeholder</h1>
              <AuthStatus />
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <p>Welcome to the Stakeholder application.</p>
          </main>
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
