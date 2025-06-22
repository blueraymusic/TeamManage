import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/components/admin-dashboard";
import OfficerDashboard from "@/components/officer-dashboard";
import LanguageSwitcher from "@/components/language-switcher";
import { t } from "@/lib/i18n";
import { LogOut, User } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`shadow-sm border-b ${user.role === "admin" ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="@assets/logoO_1750625759438.png" 
                  alt="ADEL Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-bold text-gray-900">ADEL</span>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
                  {user.role === "admin" ? "Admin Panel" : "Officer Panel"}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
                <Badge 
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={user.role === "admin" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
                >
                  {user.role === "admin" ? "Administrator" : "Officer"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === "admin" 
              ? "Manage your organization's projects and review team reports." 
              : "Submit reports and track your project contributions."}
          </p>
        </div>

        {/* Role-based Dashboard */}
        {user.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <OfficerDashboard />
        )}
      </main>
    </div>
  );
}
