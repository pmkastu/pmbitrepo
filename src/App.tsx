import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { AppSidebar } from "@/components/AppSidebar";
import { useTheme } from "@/hooks/use-theme";
import { useLearningStore } from "@/hooks/use-learning-store";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Library = lazy(() => import("@/pages/Library"));
const CertificatesPage = lazy(() => import("@/pages/Certificates"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const PeerChallengeDemo = lazy(() => import("@/pages/PeerChallengeDemo"));
const Auth = lazy(() => import("@/pages/Auth"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-xl gradient-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function AppShell() {
  const theme = useTheme();
  const store = useLearningStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar
        streak={store.streak}
        dailyGoalProgress={store.dailyGoalProgress}
        dailyGoalTarget={store.dailyGoalTarget}
        isDark={theme.isDark}
        onToggleTheme={theme.toggle}
        onSimulateNewDay={store.simulateNewDay}
      />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard store={store} />} />
              <Route path="/library" element={<Library />} />
              <Route path="/certificates" element={<CertificatesPage store={store} />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/peer-challenge" element={<PeerChallengeDemo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
