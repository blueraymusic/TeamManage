import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
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
  Line
} from 'recharts';
import { 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Target,
  Calendar,
  Users,
  FileText,
  Activity,
  Eye,
  EyeOff,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";
import WidgetAnalytics from "./widget-analytics";

interface WidgetConfig {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'list' | 'progress';
  visible: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
  chartType?: 'bar' | 'pie' | 'line';
}

interface DashboardWidgetsProps {
  userRole: 'admin' | 'officer';
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'project-overview', title: 'Project Overview', type: 'metric', visible: true, position: 1, size: 'medium' },
  { id: 'budget-summary', title: 'Budget Summary', type: 'chart', visible: true, position: 2, size: 'medium', chartType: 'pie' },
  { id: 'progress-tracking', title: 'Progress Tracking', type: 'chart', visible: true, position: 3, size: 'large', chartType: 'bar' },
  { id: 'recent-reports', title: 'Recent Reports', type: 'list', visible: true, position: 4, size: 'medium' },
  { id: 'deadlines', title: 'Upcoming Deadlines', type: 'list', visible: true, position: 5, size: 'medium' },
  { id: 'team-activity', title: 'Team Activity', type: 'chart', visible: false, position: 6, size: 'large', chartType: 'line' },
  { id: 'project-timeline', title: 'Project Timeline', type: 'chart', visible: false, position: 7, size: 'large', chartType: 'line' },
  { id: 'budget-analytics', title: 'Budget Analytics', type: 'chart', visible: false, position: 8, size: 'large', chartType: 'bar' },
  { id: 'report-analytics', title: 'Report Analytics', type: 'chart', visible: false, position: 9, size: 'medium', chartType: 'pie' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DashboardWidgets({ userRole }: DashboardWidgetsProps) {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem(`dashboard-widgets-${userRole}`);
    return saved ? JSON.parse(saved) : defaultWidgets;
  });
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Save widget configuration to localStorage
  useEffect(() => {
    localStorage.setItem(`dashboard-widgets-${userRole}`, JSON.stringify(widgets));
  }, [widgets, userRole]);

  const { data: dashboardStats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
  };

  const changeWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, size }
        : widget
    ));
  };

  const resetToDefaults = () => {
    setWidgets(defaultWidgets);
  };

  const getProjectStatusData = () => {
    if (!projects) return [];
    
    const statusCounts = (projects as any[]).reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count as number
    }));
  };

  const getBudgetData = () => {
    if (!projects) return [];
    
    return (projects as any[]).map(project => ({
      name: project.name.length > 10 ? `${project.name.substring(0, 10)}...` : project.name,
      budget: project.budget || 0,
      spent: project.spentAmount || 0,
      remaining: (project.budget || 0) - (project.spentAmount || 0)
    }));
  };

  const getProgressData = () => {
    if (!projects) return [];
    
    return (projects as any[]).map(project => ({
      name: project.name.length > 8 ? `${project.name.substring(0, 8)}...` : project.name,
      progress: project.progress || 0
    }));
  };

  const getRecentReports = () => {
    if (!reports) return [];
    
    return (reports as any[])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getUpcomingDeadlines = () => {
    if (!projects) return [];
    
    return (projects as any[])
      .filter(project => project.deadline && new Date(project.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  };

  const renderWidget = (widget: WidgetConfig) => {
    if (!widget.visible) return null;

    const sizeClasses = {
      small: 'col-span-1',
      medium: 'col-span-2', 
      large: 'col-span-3'
    };

    switch (widget.id) {
      case 'project-overview':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{dashboardStats?.activeProjects || 0}</div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{dashboardStats?.completedProjects || 0}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{dashboardStats?.pendingReports || 0}</div>
                  <div className="text-sm text-gray-600">Pending Reports</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{dashboardStats?.totalBudget || 0}</div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'budget-summary':
        const budgetData = getBudgetData();
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'progress-tracking':
        const progressData = getProgressData();
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                    <Bar dataKey="progress" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'recent-reports':
        const recentReports = getRecentReports();
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.length > 0 ? recentReports.map((report: any) => (
                  <div key={report.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{report.title}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={
                      report.status === 'approved' ? 'default' : 
                      report.status === 'rejected' ? 'destructive' : 
                      'secondary'
                    }>
                      {report.status}
                    </Badge>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-4">No reports yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'deadlines':
        const upcomingDeadlines = getUpcomingDeadlines();
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{project.name}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-xs text-orange-600">
                      {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-500 py-4">No upcoming deadlines</div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'team-activity':
        return (
          <Card key={widget.id} className={`${sizeClasses[widget.size]} transition-all duration-200 hover:shadow-md`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-cyan-600" />
                {widget.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div>Team activity tracking coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'project-timeline':
        return <WidgetAnalytics key={widget.id} type="project-timeline" timeRange="30d" className={sizeClasses[widget.size]} />;

      case 'budget-analytics':
        return <WidgetAnalytics key={widget.id} type="budget-trend" timeRange="30d" className={sizeClasses[widget.size]} />;

      case 'report-analytics':
        return <WidgetAnalytics key={widget.id} type="report-analytics" timeRange="30d" className={sizeClasses[widget.size]} />;

      default:
        return null;
    }
  };

  const visibleWidgets = widgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-6">
      {/* Widget Configuration Panel */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Dashboard Configuration
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfiguring(!isConfiguring)}
            >
              {isConfiguring ? 'Done' : 'Customize'}
            </Button>
          </div>
        </CardHeader>
        {isConfiguring && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Widget Visibility</h4>
                <Button variant="outline" size="sm" onClick={resetToDefaults}>
                  Reset to Defaults
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWidgetVisibility(widget.id)}
                      >
                        {widget.visible ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <span className={widget.visible ? '' : 'text-gray-400'}>
                        {widget.title}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {['small', 'medium', 'large'].map((size) => (
                        <Button
                          key={size}
                          variant={widget.size === size ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => changeWidgetSize(widget.id, size as any)}
                          className="px-2 py-1 text-xs"
                        >
                          {size.charAt(0).toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Dashboard Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleWidgets.map(renderWidget)}
      </div>

      {visibleWidgets.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets visible</h3>
            <p className="text-gray-600 mb-4">
              Configure your dashboard by enabling some widgets above.
            </p>
            <Button onClick={() => setIsConfiguring(true)}>
              Customize Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}