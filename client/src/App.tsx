import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import Landing from "@/pages/landing-new";
import Dashboard from "@/pages/dashboard";
import OwnerBookings from "@/pages/owner-bookings";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import { useEffect } from "react";
import { initializeLanguage } from "@/lib/i18n";

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    initializeLanguage();
  }, []);

  console.log("Router - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "user:", user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If we have a user object in localStorage but auth query failed, try to use that
  const storedUser = localStorage.getItem('adel_user');
  const localUser = storedUser ? JSON.parse(storedUser) : null;
  
  const userToUse = user || localUser;
  const shouldShowDashboard = !!userToUse;

  console.log("Router - shouldShowDashboard:", shouldShowDashboard, "userToUse:", userToUse);

  return (
    <Switch>
      {!shouldShowDashboard ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/owner-bookings" component={OwnerBookings} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
