import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bell, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Target,
  DollarSign,
  FileText,
  Users
} from "lucide-react";
import { useState } from "react";

interface SmartNotificationsProps {
  userRole: 'admin' | 'officer';
}

export default function SmartNotifications({ userRole }: SmartNotificationsProps) {
  const [dismissedNotifications, setDismissedNotifications] = useState<string[]>([]);

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const generateNotifications = () => {
    if (!projects || !reports || !stats) return [];

    const notifications = [];
    const now = new Date();

    // Overdue projects
    const overdueProjects = projects.filter((p: any) => {
      if (p.status === 'completed' || p.status === 'cancelled') return false;
      if (!p.deadline) return false;
      return new Date(p.deadline) < now;
    });

    if (overdueProjects.length > 0) {
      notifications.push({
        id: 'overdue-projects',
        type: 'urgent',
        icon: AlertTriangle,
        title: `${overdueProjects.length} Project${overdueProjects.length > 1 ? 's' : ''} Overdue`,
        description: `${overdueProjects.map((p: any) => p.name).join(', ')} ${overdueProjects.length > 1 ? 'are' : 'is'} past deadline`,
        action: userRole === 'admin' ? 'Review Projects' : 'Update Progress',
        color: 'destructive'
      });
    }

    // Projects approaching deadline (within 7 days)
    const upcomingDeadlines = projects.filter((p: any) => {
      if (p.status === 'completed' || p.status === 'cancelled') return false;
      if (!p.deadline) return false;
      const deadline = new Date(p.deadline);
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return deadline > now && deadline <= sevenDaysFromNow;
    });

    if (upcomingDeadlines.length > 0) {
      notifications.push({
        id: 'upcoming-deadlines',
        type: 'warning',
        icon: Clock,
        title: `${upcomingDeadlines.length} Deadline${upcomingDeadlines.length > 1 ? 's' : ''} Approaching`,
        description: `Projects due within 7 days: ${upcomingDeadlines.map((p: any) => p.name).join(', ')}`,
        action: 'View Calendar',
        color: 'warning'
      });
    }

    // Low progress projects (less than 25% and active for over 30 days)
    const stalledProjects = projects.filter((p: any) => {
      if (p.status !== 'active') return false;
      const progress = p.progress || 0;
      const createdDate = new Date(p.createdAt);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return progress < 25 && createdDate < thirtyDaysAgo;
    });

    if (stalledProjects.length > 0) {
      notifications.push({
        id: 'stalled-projects',
        type: 'info',
        icon: Target,
        title: `${stalledProjects.length} Project${stalledProjects.length > 1 ? 's' : ''} Need Attention`,
        description: `Low progress on projects active for over 30 days`,
        action: 'Review Progress',
        color: 'default'
      });
    }

    // Budget alerts (over 80% utilized)
    const budgetWarnings = projects.filter((p: any) => {
      if (!p.budget || p.budget <= 0) return false;
      const utilization = (p.budgetSpent || 0) / p.budget;
      return utilization > 0.8 && p.status === 'active';
    });

    if (budgetWarnings.length > 0 && userRole === 'admin') {
      notifications.push({
        id: 'budget-warnings',
        type: 'warning',
        icon: DollarSign,
        title: `Budget Alert: ${budgetWarnings.length} Project${budgetWarnings.length > 1 ? 's' : ''}`,
        description: `Projects have used over 80% of allocated budget`,
        action: 'Review Budgets',
        color: 'warning'
      });
    }

    // Pending reports (admin only)
    if (userRole === 'admin') {
      const pendingReports = reports.filter((r: any) => r.status === 'submitted');
      if (pendingReports.length > 0) {
        notifications.push({
          id: 'pending-reports',
          type: 'info',
          icon: FileText,
          title: `${pendingReports.length} Report${pendingReports.length > 1 ? 's' : ''} Awaiting Review`,
          description: `New reports submitted for approval`,
          action: 'Review Reports',
          color: 'default'
        });
      }
    }

    // Officer-specific: Rejected reports that need resubmission
    if (userRole === 'officer') {
      const rejectedReports = reports.filter((r: any) => r.status === 'rejected');
      if (rejectedReports.length > 0) {
        notifications.push({
          id: 'rejected-reports',
          type: 'warning',
          icon: FileText,
          title: `${rejectedReports.length} Report${rejectedReports.length > 1 ? 's' : ''} Need Revision`,
          description: `Reports require updates based on admin feedback`,
          action: 'View Feedback',
          color: 'warning'
        });
      }
    }

    // Performance insights
    const totalReports = reports.length;
    const approvedReports = reports.filter((r: any) => r.status === 'approved').length;
    const approvalRate = totalReports > 0 ? (approvedReports / totalReports) * 100 : 0;

    if (approvalRate < 70 && totalReports > 5) {
      notifications.push({
        id: 'low-approval-rate',
        type: 'info',
        icon: TrendingUp,
        title: 'Report Approval Rate Below Target',
        description: `Current approval rate: ${Math.round(approvalRate)}%. Consider reviewing report quality guidelines.`,
        action: 'View Guidelines',
        color: 'default'
      });
    }

    // Milestone celebrations
    const recentlyCompleted = projects.filter((p: any) => {
      if (p.status !== 'completed') return false;
      const updatedDate = new Date(p.updatedAt || p.createdAt);
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      return updatedDate >= threeDaysAgo;
    });

    if (recentlyCompleted.length > 0) {
      notifications.push({
        id: 'recent-completions',
        type: 'success',
        icon: CheckCircle2,
        title: `🎉 ${recentlyCompleted.length} Project${recentlyCompleted.length > 1 ? 's' : ''} Completed!`,
        description: `Congratulations on completing: ${recentlyCompleted.map((p: any) => p.name).join(', ')}`,
        action: 'View Details',
        color: 'success'
      });
    }

    return notifications.filter(n => !dismissedNotifications.includes(n.id));
  };

  const notifications = generateNotifications();

  const dismissNotification = (id: string) => {
    setDismissedNotifications(prev => [...prev, id]);
  };

  const getPriorityNotifications = () => {
    return notifications.filter(n => n.type === 'urgent').slice(0, 2);
  };

  const getOtherNotifications = () => {
    return notifications.filter(n => n.type !== 'urgent').slice(0, 5);
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm">All caught up! No new notifications.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Priority Notifications */}
      {getPriorityNotifications().map((notification) => {
        const Icon = notification.icon;
        return (
          <Alert key={notification.id} className="border-red-200 bg-red-50">
            <Icon className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-red-800">{notification.title}</div>
                  <div className="text-sm text-red-700 mt-1">{notification.description}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => dismissNotification(notification.id)}
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        );
      })}

      {/* Regular Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent Updates
            </div>
            {notifications.length > 0 && (
              <Badge variant="secondary">{notifications.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getOtherNotifications().map((notification) => {
            const Icon = notification.icon;
            return (
              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className={`p-2 rounded-full ${
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  notification.type === 'success' ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{notification.description}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissNotification(notification.id)}
                  className="text-xs px-2 py-1 h-auto"
                >
                  ×
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}