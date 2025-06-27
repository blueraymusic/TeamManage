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
  Activity,
  DollarSign,
  Banknote
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
      { name: 'Active', value: projects.filter((p: any) => p.status === 'active').length, color: '#10b981', darkColor: '#059669' },
      { name: 'Completed', value: projects.filter((p: any) => p.status === 'completed').length, color: '#3b82f6', darkColor: '#2563eb' },
      { name: 'On Hold', value: projects.filter((p: any) => p.status === 'on-hold').length, color: '#f59e0b', darkColor: '#d97706' },
      { name: 'Cancelled', value: projects.filter((p: any) => p.status === 'cancelled').length, color: '#ef4444', darkColor: '#dc2626' },
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
      name: p.name && p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name || 'Unnamed Project',
      budget: Number(p.budget) || 0,
      spent: Number(p.budgetSpent) || 0,
      remaining: Math.max(0, (Number(p.budget) || 0) - (Number(p.budgetSpent) || 0)),
      utilization: p.budget && Number(p.budget) > 0 ? Math.round(((Number(p.budgetSpent) || 0) / Number(p.budget)) * 100) : 0
    }));

    // Progress distribution
    const progressRanges = [
      { range: '0-25%', count: 0, color: '#ef4444', label: 'Starting', bgColor: '#fef2f2' },
      { range: '26-50%', count: 0, color: '#f59e0b', label: 'In Progress', bgColor: '#fffbeb' },
      { range: '51-75%', count: 0, color: '#eab308', label: 'Good Progress', bgColor: '#fefce8' },
      { range: '76-99%', count: 0, color: '#22c55e', label: 'Nearly Done', bgColor: '#f0fdf4' },
      { range: '100%', count: 0, color: '#3b82f6', label: 'Completed', bgColor: '#eff6ff' },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{analytics.totalProjects}</div>
            <p className="text-sm text-blue-600 mt-2 font-medium">
              {stats?.activeProjects || 0} currently active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{analytics.avgProgress}%</div>
            <div className="mt-3">
              <Progress 
                value={analytics.avgProgress} 
                className="h-3 bg-emerald-200" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
              <div className="p-2 bg-purple-600 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{analytics.totalReports}</div>
            <p className="text-sm text-purple-600 mt-2 font-medium">
              {analytics.approvalRate}% approval rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-amber-700 flex items-center gap-2">
              <div className="p-2 bg-amber-600 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {analytics.totalProjects > 0 
                ? Math.round((stats?.completedProjects || 0) / analytics.totalProjects * 100)
                : 0}%
            </div>
            <p className="text-sm text-amber-600 mt-2 font-medium">
              {stats?.completedProjects || 0} projects completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-gray-800 font-semibold">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              Project Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.projectStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => value > 0 ? `${name}: ${value} (${(percent * 100).toFixed(0)}%)` : ''}
                    labelLine={false}
                    fontSize={12}
                    fontWeight="600"
                  >
                    {analytics.projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontWeight: '500'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress Distribution */}
        <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-gray-800 font-semibold">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Progress Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.progressRanges} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="range" 
                    tick={{ fontSize: 12, fill: '#6b7280', fontWeight: '500' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280', fontWeight: '500' }}
                    axisLine={{ stroke: '#d1d5db' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontWeight: '500'
                    }}
                    labelStyle={{ color: '#d1d5db' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#progressGradient)"
                    radius={[4, 4, 0, 0]}
                    stroke="#059669"
                    strokeWidth={1}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
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
        <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-gray-800 font-semibold">
              <div className="p-2 bg-green-600 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              Budget Utilization Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Budget Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-3 rounded-lg border border-blue-200">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-600 rounded-lg">
                        <Target className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs font-medium text-blue-700">Total Budget</p>
                    </div>
                    <p className="text-base font-bold text-blue-900 break-all">
                      ${analytics.budgetData.reduce((sum: number, item: any) => sum + Number(item.budget), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-3 rounded-lg border border-emerald-200">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-emerald-600 rounded-lg">
                        <TrendingUp className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs font-medium text-emerald-700">Total Spent</p>
                    </div>
                    <p className="text-base font-bold text-emerald-900 break-all">
                      ${analytics.budgetData.reduce((sum: number, item: any) => sum + Number(item.spent), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-3 rounded-lg border border-amber-200">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-amber-600 rounded-lg">
                        <Banknote className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-xs font-medium text-amber-700">Remaining</p>
                    </div>
                    <p className="text-base font-bold text-amber-900 break-all">
                      ${analytics.budgetData.reduce((sum: number, item: any) => sum + Number(item.remaining), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.budgetData} margin={{ top: 15, right: 20, left: 15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: '#6b7280', fontWeight: '500' }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#6b7280', fontWeight: '500' }}
                      axisLine={{ stroke: '#d1d5db' }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`$${Number(value).toLocaleString()}`, name]}
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontWeight: '500',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: '#d1d5db' }}
                    />
                    <Bar 
                      dataKey="budget" 
                      fill="url(#budgetGradient)" 
                      name="Total Budget"
                      radius={[3, 3, 0, 0]}
                      stroke="#3b82f6"
                      strokeWidth={1}
                    />
                    <Bar 
                      dataKey="spent" 
                      fill="url(#spentGradient)" 
                      name="Amount Spent"
                      radius={[3, 3, 0, 0]}
                      stroke="#10b981"
                      strokeWidth={1}
                    />
                    <Bar 
                      dataKey="remaining" 
                      fill="url(#remainingGradient)" 
                      name="Remaining Budget"
                      radius={[3, 3, 0, 0]}
                      stroke="#f59e0b"
                      strokeWidth={1}
                    />
                    <defs>
                      <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#1e40af" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="remainingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#d97706" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Budget Utilization Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 text-sm mb-2">Project Budget Breakdown</h4>
                {analytics.budgetData.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <h5 className="font-medium text-gray-800 text-sm">{project.name}</h5>
                      <span className="text-xs font-medium text-gray-600">
                        {project.utilization}% utilized
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(project.utilization, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Spent: ${project.spent.toLocaleString()}</span>
                      <span>Budget: ${project.budget.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
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