import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/components/admin-dashboard-simple";
import OfficerDashboard from "@/components/officer-dashboard-redesigned";
import LanguageSwitcher from "@/components/language-switcher";
import { t } from "@/lib/i18n";
import { LogOut, User } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const logoutMutation = useLogout();

  console.log("Dashboard - User data:", user);
  console.log("Dashboard - User role:", user?.role);
  console.log("Dashboard - Is admin:", user?.role === "admin");

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Force proper role detection
  const isAdmin = user.role === "admin";
  console.log("Dashboard - Final isAdmin check:", isAdmin);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <main className="w-full">
        {isAdmin ? <AdminDashboard /> : <OfficerDashboard />}
      </main>
    </div>
  );
}
