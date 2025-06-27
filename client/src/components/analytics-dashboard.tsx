import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Target,
  BarChart3,
  Calendar,
  Activity
} from "lucide-react";

interface AnalyticsDashboardProps {
  userRole: 'admin' | 'officer';
}

export default function AnalyticsDashboard({ userRole }: AnalyticsDashboardProps) {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Calculate analytics data
  const calculateAnalytics = () => {
    if (!projects || !reports) return null;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Project status distribution
    const projectStatusData = [
      { name: 'Active', value: projects.filter((p: any) => p.status === 'active').length, color: '#22c55e' },
      { name: 'Completed', value: projects.filter((p: any) => p.status === 'completed').length, color: '#3b82f6' },
      { name: 'On Hold', value: projects.filter((p: any) => p.status === 'on-hold').length, color: '#f59e0b' },
      { name: 'Cancelled', value: projects.filter((p: any) => p.status === 'cancelled').length, color: '#ef4444' },
    ];

    // Report approval trends (last 30 days)
    const recentReports = reports.filter((r: any) => 
      new Date(r.createdAt) >= thirtyDaysAgo
    );

    const reportTrendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayReports = recentReports.filter((r: any) => {
        const reportDate = new Date(r.createdAt);
        return reportDate.toDateString() === date.toDateString();
      });

      reportTrendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        submitted: dayReports.filter((r: any) => r.status === 'submitted').length,
        approved: dayReports.filter((r: any) => r.status === 'approved').length,
        rejected: dayReports.filter((r: any) => r.status === 'rejected').length,
      });
    }

    // Budget utilization
    const budgetData = projects.map((p: any) => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      budget: p.budget || 0,
      spent: p.budgetSpent || 0,
      remaining: (p.budget || 0) - (p.budgetSpent || 0),
      utilization: p.budget ? Math.round(((p.budgetSpent || 0) / p.budget) * 100) : 0
    }));

    // Progress distribution
    const progressRanges = [
      { range: '0-25%', count: 0, color: '#ef4444' },
      { range: '26-50%', count: 0, color: '#f59e0b' },
      { range: '51-75%', count: 0, color: '#eab308' },
      { range: '76-99%', count: 0, color: '#22c55e' },
      { range: '100%', count: 0, color: '#3b82f6' },
    ];

    projects.forEach((p: any) => {
      const progress = p.progress || 0;
      if (progress <= 25) progressRanges[0].count++;
      else if (progress <= 50) progressRanges[1].count++;
      else if (progress <= 75) progressRanges[2].count++;
      else if (progress < 100) progressRanges[3].count++;
      else progressRanges[4].count++;
    });

    return {
      projectStatusData,
      reportTrendData,
      budgetData,
      progressRanges,
      totalProjects: projects.length,
      totalReports: reports.length,
      approvalRate: reports.length > 0 ? Math.round((reports.filter((r: any) => r.status === 'approved').length / reports.length) * 100) : 0,
      avgProgress: projects.length > 0 ? Math.round(projects.reduce((acc: number, p: any) => acc + (p.progress || 0), 0) / projects.length) : 0
    };
  };

  const analytics = calculateAnalytics();

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.activeProjects || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Avg Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgProgress}%</div>
            <Progress value={analytics.avgProgress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalReports}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.approvalRate}% approval rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalProjects > 0 
                ? Math.round((stats?.completedProjects || 0) / analytics.totalProjects * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.completedProjects || 0} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Project Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.projectStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  >
                    {analytics.projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Progress Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.progressRanges}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Report Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Report Trends (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.reportTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="submitted" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                  <Area type="monotone" dataKey="approved" stackId="1" stroke="#22c55e" fill="#22c55e" />
                  <Area type="monotone" dataKey="rejected" stackId="1" stroke="#ef4444" fill="#ef4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Budget Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                  <Bar dataKey="budget" fill="#e5e7eb" name="Total Budget" />
                  <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Projects on track</span>
              <Badge variant="outline" className="text-green-600">
                {analytics.progressRanges[3].count + analytics.progressRanges[4].count}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Need attention</span>
              <Badge variant="outline" className="text-yellow-600">
                {analytics.progressRanges[0].count + analytics.progressRanges[1].count}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Report approval rate</span>
              <Badge variant="outline" className={analytics.approvalRate > 80 ? "text-green-600" : "text-yellow-600"}>
                {analytics.approvalRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.progressRanges[0].count > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                {analytics.progressRanges[0].count} project(s) need immediate attention
              </div>
            )}
            {stats?.overdueProjects > 0 && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <Clock className="h-4 w-4" />
                {stats.overdueProjects} project(s) overdue
              </div>
            )}
            {analytics.approvalRate < 70 && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <TrendingDown className="h-4 w-4" />
                Low report approval rate needs review
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Reports this month</span>
              <span className="font-medium">
                {reports?.filter((r: any) => {
                  const reportDate = new Date(r.createdAt);
                  const now = new Date();
                  return reportDate.getMonth() === now.getMonth() && 
                         reportDate.getFullYear() === now.getFullYear();
                }).length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg project progress</span>
              <span className="font-medium">{analytics.avgProgress}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active projects</span>
              <span className="font-medium">{stats?.activeProjects || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}